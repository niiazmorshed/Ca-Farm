"use server";

import { revalidatePath } from "next/cache";
import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/supabase/guards";
import { createAdminClient } from "../../lib/supabase/admin";
import { TOOLKIT_CATEGORIES, TOOLKIT_FRAMEWORKS } from "../../lib/toolkit-types";

export interface ActionState {
  status: "idle" | "saved" | "error";
  message?: string;
}

const CATEGORY_VALUES = TOOLKIT_CATEGORIES.map((c) => c.value) as string[];
const FRAMEWORK_VALUES = TOOLKIT_FRAMEWORKS as readonly string[];

/* Uploads go into the public "toolkits" bucket. Extension allowlist keeps the
   bucket to documents (no scripts/executables); 20 MB matches the server-action
   body limit headroom in next.config.ts. */
const ALLOWED_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "csv", "txt", "md", "png", "jpg", "jpeg", "zip",
];
const MAX_FILE_BYTES = 20 * 1024 * 1024;

const BUCKET = "toolkits";

function revalidate() {
  revalidatePath("/toolkits");
  revalidatePath("/admin/toolkits");
}

interface ParsedResource {
  title: string;
  description: string | null;
  category: string;
  framework: string | null;
  externalUrl: string | null;
  active: boolean;
}

function parseFields(formData: FormData): ParsedResource | string {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const framework = String(formData.get("framework") ?? "").trim();
  const externalUrl = String(formData.get("external_url") ?? "").trim();

  if (!title) return "Title is required.";
  if (!CATEGORY_VALUES.includes(category)) return "Pick a category.";
  if (framework && !FRAMEWORK_VALUES.includes(framework))
    return "Unknown framework.";
  if (externalUrl && !/^https?:\/\//i.test(externalUrl))
    return "External link must start with http(s)://";

  return {
    title,
    description: description || null,
    category,
    framework: framework || null,
    externalUrl: externalUrl || null,
    active: formData.get("active") === "on",
  };
}

/** Upload one file to the bucket; returns its public URL + storage path. */
async function uploadFile(
  file: File,
  category: string,
): Promise<{ url: string; path: string } | string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return `File type .${ext} is not allowed (documents and images only).`;
  if (file.size > MAX_FILE_BYTES) return "File is larger than 20 MB.";

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const path = `${category}/${Date.now()}-${safeName}`;

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined });
  if (error) {
    console.error("[toolkits] upload failed:", error);
    return "Upload failed — is the toolkits storage bucket created (run the migration)?";
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

async function removeStoredFile(path: string | null) {
  if (!path) return;
  const { error } = await createAdminClient().storage.from(BUCKET).remove([path]);
  if (error) console.error("[toolkits] could not delete stored file:", error);
}

/** Insert (no id) or update (hidden id field). A new upload or external link
    replaces the previous file; otherwise the existing file is kept on update. */
export async function saveResource(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseFields(formData);
  if (typeof parsed === "string") {
    console.warn("[toolkits] save rejected (fields):", parsed);
    return { status: "error", message: parsed };
  }

  const id = String(formData.get("id") ?? "").trim();
  const file = formData.get("file");
  const hasFile = file instanceof File && file.size > 0;

  if (!id && !hasFile && !parsed.externalUrl) {
    console.warn("[toolkits] save rejected: no file and no link");
    return { status: "error", message: "Attach a file or paste an external link." };
  }
  if (hasFile && parsed.externalUrl) {
    console.warn("[toolkits] save rejected: both file and link supplied");
    return { status: "error", message: "Attach a file OR a link — not both." };
  }

  // Resolve the file the row should point at.
  let fileUrl: string | null = null;
  let filePath: string | null = null;
  let fileName: string | null = null;
  if (hasFile) {
    const uploaded = await uploadFile(file, parsed.category);
    if (typeof uploaded === "string") return { status: "error", message: uploaded };
    fileUrl = uploaded.url;
    filePath = uploaded.path;
    fileName = file.name;
  } else if (parsed.externalUrl) {
    fileUrl = parsed.externalUrl;
  }

  try {
    if (id) {
      if (fileUrl) {
        // Replacing the file: clean up the old storage object first.
        const { rows } = await query<{ file_path: string | null }>(
          `select file_path from toolkit_resources where id = $1`,
          [id],
        );
        await removeStoredFile(rows[0]?.file_path ?? null);
        await query(
          `update toolkit_resources
              set title = $1, description = $2, category = $3, framework = $4,
                  active = $5, file_url = $6, file_path = $7, file_name = $8,
                  updated_at = now()
            where id = $9`,
          [parsed.title, parsed.description, parsed.category, parsed.framework,
           parsed.active, fileUrl, filePath, fileName, id],
        );
      } else {
        await query(
          `update toolkit_resources
              set title = $1, description = $2, category = $3, framework = $4,
                  active = $5, updated_at = now()
            where id = $6`,
          [parsed.title, parsed.description, parsed.category, parsed.framework,
           parsed.active, id],
        );
      }
    } else {
      await query(
        `insert into toolkit_resources
           (title, description, category, framework, file_url, file_path,
            file_name, active)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [parsed.title, parsed.description, parsed.category, parsed.framework,
         fileUrl, filePath, fileName, parsed.active],
      );
    }
  } catch (err) {
    console.error("[toolkits] save failed:", err);
    return { status: "error", message: "Could not save — check the values." };
  }

  revalidate();
  console.log("[toolkits] saved:", id ? `updated ${id}` : "inserted new row");
  return { status: "saved", message: id ? "Saved." : "Resource added." };
}

export async function deleteResource(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { status: "error", message: "Missing resource id." };

  try {
    const { rows } = await query<{ file_path: string | null }>(
      `delete from toolkit_resources where id = $1 returning file_path`,
      [id],
    );
    await removeStoredFile(rows[0]?.file_path ?? null);
  } catch (err) {
    console.error("[toolkits] delete failed:", err);
    return { status: "error", message: "Could not delete." };
  }

  revalidate();
  return { status: "saved", message: "Deleted." };
}
