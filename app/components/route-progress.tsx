"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Global top progress bar. Appears the moment an internal link is clicked and
 * completes when the new route renders — so every navigation (nav links, the
 * account pill, CTAs) shows immediate "it's loading" feedback, even while a
 * server layout/page is still resolving.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [show, setShow] = useState(false);
  const [fast, setFast] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const firstRender = useRef(true);

  // Start when an internal link is clicked (capture phase, before navigation).
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as Element)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page / hash

      // begin: show the bar and creep toward 90% with the slow transition.
      clearTimeout(hideTimer.current);
      setFast(false);
      setShow(true);
      setWidth(8);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setWidth(90)),
      );
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Complete when the route actually changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setFast(true);
    setWidth(100);
    hideTimer.current = setTimeout(() => {
      setShow(false);
      setWidth(0);
      setFast(false);
    }, 280);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-primary-500 shadow-[0_0_10px_1px] shadow-primary-400"
        style={{
          width: `${width}%`,
          transition: fast
            ? "width 200ms ease-out"
            : "width 9000ms cubic-bezier(0.08,0.7,0.2,1)",
        }}
      />
    </div>
  );
}
