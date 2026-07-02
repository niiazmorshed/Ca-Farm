export const site = {
  name: "CA Farm",
  url: "https://cafarm.co",
  email: "hello@cafarm.co",
  phone: "+353 (0)1 234 5678",
  phoneHref: "tel:+35312345678",
  address: ["The Chase, Carmanhall Road", "Sandyford, Dublin 18, D18 Y3X2"],
  hours: "Mon–Fri, 9:00–17:30",
};

export const industries = [
  {
    name: "Startups & SaaS",
    note: "R&D credits, KEEP options and investor-ready reporting.",
  },
  {
    name: "Hospitality",
    note: "Cafés, restaurants and hotels — tips, margins and seasonal cash flow.",
  },
  {
    name: "Retail",
    note: "Bricks-and-mortar and online sellers — stock, VAT and multi-channel margins.",
  },
  {
    name: "Healthcare",
    note: "GPs, consultants and clinics — practice income, pensions and locum structuring.",
  },
  {
    name: "Professional services",
    note: "Agencies and consultancies — WIP, utilisation and partner profit shares.",
  },
];

export interface PricingTier {
  name: string;
  monthly: number;
  annualMonthly: number;
  blurb: string;
  features: string[];
  popular?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Sole Trader",
    monthly: 59,
    annualMonthly: 49,
    blurb: "For the self-employed who want filings handled and a number to call.",
    features: [
      "Income tax return (Form 11)",
      "Quarterly bookkeeping review",
      "Revenue registration and correspondence",
      "Deadline tracking and reminders",
      "Email and phone support",
    ],
  },
  {
    name: "Limited Company",
    monthly: 169,
    annualMonthly: 139,
    blurb: "The complete compliance package for trading limited companies.",
    popular: true,
    features: [
      "Year-end accounts and CT1",
      "Director income tax return included",
      "VAT returns",
      "Payroll for up to 5 employees",
      "Quarterly management accounts",
      "Dedicated accountant",
    ],
  },
  {
    name: "Growth & CFO",
    monthly: 429,
    annualMonthly: 359,
    blurb: "A finance function without the headcount, for businesses scaling up.",
    features: [
      "Everything in Limited Company",
      "Monthly management accounts",
      "Cash-flow forecasting",
      "Quarterly virtual-CFO session",
      "Unlimited payroll",
      "R&D tax credit claims included",
    ],
  },
];

export const pricingAddons = [
  { name: "Statutory audit", note: "Scoped and quoted separately" },
  { name: "Books cleanup / catch-up", note: "One-off, quoted after review" },
  { name: "Company formation", note: "€150 one-off" },
  { name: "R&D credit claim", note: "Included on Growth, else from €750" },
];

export const team = [
  { name: "Niaz Morshed", role: "Managing Partner", credential: "FCA" },
  { name: "Sarah Whitfield", role: "Audit Partner", credential: "ACA" },
  { name: "Tom Adeyemi", role: "Tax Director", credential: "CTA" },
  { name: "Emily Carter", role: "Practice Manager", credential: "ATI" },
];

export const values = [
  {
    title: "Plain English, always",
    description:
      "If you need a glossary to read your accounts, we have failed. Every report we send is written to be understood on first read.",
  },
  {
    title: "Proactive beats reactive",
    description:
      "Tax planning in October is too late. We work ahead of deadlines and bring you ideas before you ask.",
  },
  {
    title: "A short client list, on purpose",
    description:
      "Each partner caps their client list. You get someone who knows your business, not whoever picks up the phone.",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Service taxonomy (Ireland)
   Figures current for 2026 (Budget 2026 basis) — Republic of Ireland. Verify at point of advice.
   Two levels: ServiceCategory → SubService.
   `kind` controls how a category renders:
     - "services"  → landing page lists sub-services, each with a detail page
     - "personas"  → landing lists audience segments, each with a detail page
     - "single"    → category IS the detail page (no children); uses included/bestFor
   `status: "coming-soon"` renders a placeholder and is excluded from detail routes.
   ────────────────────────────────────────────────────────────────────────── */

export type CategoryKind = "services" | "personas" | "single";
export type Availability = "available" | "coming-soon";

export interface SubService {
  slug: string;
  title: string;
  blurb: string;
  overview: string;
  included: string[];
  bestFor: string[];
  /** Long-form detail — 2+ paragraphs (split on blank line). Rendered below the scope list. */
  context?: string;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  blurb: string;
  overview: string;
  kind: CategoryKind;
  status?: Availability;
  /** Sub-services or personas. Empty for `kind: "single"`. */
  items: SubService[];
  /** Used only when `kind: "single"`. */
  included?: string[];
  bestFor?: string[];
  /** Long-form detail for single-kind categories. */
  context?: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "account-bookkeeping",
    title: "Accounting & Bookkeeping",
    blurb:
      "Books that are never behind, VAT and payroll that just run, accounts filed early. The compliance work, off your desk.",
    overview:
      "The compliance backbone of your business, run properly. From live bookkeeping to year-end accounts and tax filings, we keep you current and on the right side of Revenue — with numbers you can actually use to make decisions.",
    kind: "services",
    items: [
      {
        slug: "taxation",
        title: "Taxation",
        blurb:
          "Corporation tax, VAT, income tax and reliefs — planned ahead, filed on time, never more than you owe.",
        overview:
          "Corporation tax in Ireland runs at 12.5% on trading income and 25% on everything else — and the gap between those two rates is where most of the planning happens. We run the full cycle: the CT1 filed through Revenue's ROS, R&D and capital-allowance claims, and the director's own Form 11 handled alongside the company. If you're a group turning over more than €750m, the 15% minimum top-up under Pillar Two comes into play — we tell you early if that's you. Whatever position we take, you get it in writing.",
        included: [
          "Corporation tax returns — the CT1, prepared and filed through ROS",
          "Trading vs passive income — split correctly, close-company surcharge kept in check",
          "R&D tax credit — 35% back on qualifying spend, claimed and documented (Budget 2026)",
          "Capital allowances — reviewed for accelerated reliefs you might be missing",
          "Director's income tax — the personal Form 11, filed with the company accounts",
          "Revenue audits — interventions and correspondence handled on your behalf",
        ],
        bestFor: [
          "Owner-managed companies trading in Ireland",
          "Businesses with R&D spend, capital investment or innovation grants",
          "Groups large enough to face Pillar Two",
        ],
        context:
          "The corporation tax return — the CT1 — is due nine months after your accounting year-end, on or before the 23rd of that month, and it's filed through Revenue's ROS. Miss the date and you face a surcharge on top of the tax, plus restrictions on using losses and reliefs, so we work to a timetable that has the return ready well before the deadline rather than on it.\n\nTwo things move real money here. The R&D tax credit is now worth 35% of qualifying spend, and Budget 2026 raised the first-year cash refund threshold to €87,500 — worth knowing if you're investing in genuine development work. And the gap between the 12.5% trading rate and the 25% rate on passive income means how profits are classified, and how a close company distributes them, changes the bill. We plan both rather than leaving them to the year-end scramble.",
      },
      {
        slug: "vat-returns",
        title: "VAT Returns",
        blurb:
          "Accurate VAT registration and returns — filed through ROS and reconciled to your books before they go in.",
        overview:
          "VAT is where small mistakes get expensive fast. Ireland registers at €85,000 for goods and €42,500 for services, files bi-monthly through ROS, and adds an annual Return of Trading Details. We handle registration, scheme selection and every return — and reconcile each one to your books before it goes in.",
        included: [
          "VAT registration — €85k goods, €42.5k services thresholds handled",
          "VAT3 returns — filed bi-monthly through ROS",
          "Trading details — the annual Return of Trading Details (RTD)",
          "EU trade — VIES and Intrastat for cross-border sales",
          "Scheme advice — cash accounting, margin, OSS/IOSS",
          "Reconciliation — every return matched to your ledger before it goes in",
        ],
        bestFor: [
          "Businesses trading across Ireland and the EU",
          "E-commerce and cross-border sellers",
          "Anyone near or over the registration threshold",
        ],
        context:
          "You have to register for VAT once turnover passes €85,000 for goods or €42,500 for services in any twelve-month period — and you can register voluntarily below that where it pays to reclaim VAT on what you buy. From there most businesses file a VAT3 every two months through ROS, plus an annual Return of Trading Details that reconciles the year. Selling across the EU brings in VIES returns, and distance sellers cross into the OSS/IOSS regime once past €10,000.\n\nRates matter as much as thresholds. From 1 July 2026 the VAT rate on food, catering and hairdressing dropped to 9% from 13.5% — the sort of change that quietly affects both your pricing and your returns. We keep the treatment right and reconcile every return to your ledger before it's submitted, because VAT mistakes are the ones Revenue tends to spot fastest.",
      },
      {
        slug: "annual-accounts",
        title: "Annual Accounts",
        blurb:
          "Year-end statutory accounts under FRS 102 / FRS 105, filed with the CRO — done early, not at the deadline.",
        overview:
          "Year-end accounts should tell you something, not just satisfy a filing. We prepare statutory accounts under FRS 102 (or FRS 105 for micro-entities), agree them with you in plain English, and file on time — Irish accounts go to the CRO with the annual return (Form B1), tagged in iXBRL for Revenue. Many small companies (turnover up to €15m, balance sheet up to €7.5m, 50 staff) qualify for audit exemption.",
        included: [
          "Statutory accounts — prepared under FRS 102 or FRS 105",
          "CRO filing — accounts and the Form B1 annual return",
          "iXBRL tagging — for Revenue and CRO requirements",
          "Directors' report — prepared alongside the annual return",
          "Tax computation — corporation tax prepared with the accounts",
          "Exemption check — small-company and audit-exemption assessment",
        ],
        bestFor: [
          "Limited companies in Ireland",
          "Directors who file late every year",
          "Groups with multiple entities",
        ],
        context:
          "Every Irish company files an annual return (Form B1) with the CRO, with financial statements attached, within 56 days of its Annual Return Date. Miss that and a €100 late fee applies straight away, then €3 a day up to a maximum of €1,200 — and, more expensively, the company can lose its audit exemption. We file early to keep both the penalty and the exemption off the table.\n\nThe accounts themselves are prepared under FRS 102, or FRS 105 for micro-entities, and tagged in iXBRL for Revenue. Most small companies — turnover up to €15m, balance sheet up to €7.5m, and up to 50 employees — qualify for audit exemption, which keeps the cost down. We prepare the accounts so they actually tell you something, agree them with you in plain English, and file them alongside the corporation tax computation.",
      },
      {
        slug: "bookkeeping",
        title: "Bookkeeping & Cloud Accounting",
        blurb:
          "Clean, current books on Xero or QuickBooks, with monthly management accounts you can actually read.",
        overview:
          "Books that are three months behind are books you cannot run a business on. We keep yours current on Xero or QuickBooks — bank feeds live, receipts captured, queries chased — and close each month with accounts in plain English, ready for whatever Revenue asks.",
        included: [
          "Bookkeeping — full ledger on Xero or QuickBooks",
          "Reconciliation — bank feeds, receipt capture and matching",
          "Monthly close — with management accounts you can read",
          "Digital records — real-time and ready for ROS filing",
          "Reporting — debtors, creditors and who owes what",
          "Migration — off spreadsheets or legacy software, team trained",
        ],
        bestFor: [
          "Founders doing their own books at midnight",
          "Sole traders and landlords filing with Revenue",
          "Businesses that want monthly numbers, not annual",
        ],
        context:
          "Revenue's shift towards real-time and digital reporting is quietly ending the shoebox-of-receipts approach. Records kept live on Xero or QuickBooks aren't just tidier — they're increasingly what ROS filing, VAT returns and any Revenue query assume you already have to hand.\n\nWe keep the bank feeds flowing, chase the receipts and reconcile as we go, then close each month with management accounts written in plain English. The point isn't neat books for their own sake — it's that you can see margin, cash and who owes you money in the month it matters, rather than finding out nine months later in a set of statutory accounts.",
      },
      {
        slug: "payroll",
        title: "Payroll & Pensions",
        blurb:
          "Accurate payslips, real-time submissions and pension auto-enrolment handled — your team paid right, every cycle.",
        overview:
          "Payroll is unforgiving: one late submission or a missed pension upload and you are writing to Revenue. We run the whole cycle — payslips, PAYE Modernisation submissions, pensions and year-end forms. We also keep you ahead of the cost changes that keep coming — the scheduled PRSI increases and My Future Fund pension auto-enrolment, live since January 2026.",
        included: [
          "Payroll runs — weekly or monthly, on schedule",
          "PAYE Modernisation — real-time submissions to Revenue",
          "Deductions — PRSI, USC and PAYE calculated and filed",
          "Auto-enrolment — My Future Fund readiness",
          "Benefits — benefit-in-kind and expense reporting",
          "Year-end — payroll returns posted to your books",
        ],
        bestFor: [
          "Companies hiring their first employees",
          "Teams of 1 to 100 on the payroll",
          "Directors balancing salary and dividends",
        ],
        context:
          "Payroll in Ireland runs on PAYE Modernisation: every pay run is reported to Revenue in real time, before your employees are paid, through ROS. A late or wrong submission shows up immediately, which is what makes payroll unforgiving in a way annual filings aren't. We run the full cycle — payslips, PRSI, USC, PAYE and the year-end returns — so nothing slips through.\n\nTwo cost changes are live right now. Employee PRSI sits at 4.2% and rises again to 4.35% from 1 October 2026, part of a run of scheduled increases. And pension auto-enrolment — My Future Fund — started on 1 January 2026: employees aged 23 to 60 earning over €20,000, who aren't already in a scheme, are enrolled automatically, with employer and employee each contributing 1.5% of gross pay to begin with. We handle the enrolment and the contributions so it's one less thing to get wrong.",
      },
      {
        slug: "audit-assurance",
        title: "Audit & Assurance",
        blurb:
          "Statutory and voluntary audits that stand up to scrutiny — and give lenders, boards and buyers confidence in your numbers.",
        overview:
          "An audit should do more than satisfy a legal requirement. The first question we answer is whether you even need one — many companies qualify for audit exemption (turnover up to €15m, balance sheet up to €7.5m, 50 employees). Since 16 July 2025, a single late annual return no longer costs a small or micro company that exemption — it is lost only on a second late filing within five years. When you do need an audit, ours are planned around your risks, run under ISA (Ireland) with minimal disruption, and end with a management letter you will actually act on.",
        included: [
          "Statutory audits — conducted under ISA (Ireland)",
          "Exemption check — audit-exemption and group-size assessment",
          "Voluntary audits — for lenders, boards or investors",
          "Internal audit — controls reviewed and tested",
          "Grant and charity — SORP audits handled",
          "Due diligence — support on acquisitions",
        ],
        bestFor: [
          "Companies above the audit-exemption threshold",
          "Companies that lost exemption through repeated late filings",
          "Businesses raising debt or equity",
        ],
        context:
          "The first question about an audit is whether you need one at all. A company stays audit-exempt while it's under two of three limits — turnover €15m, balance sheet €7.5m, and 50 employees — and files on time. Since 16 July 2025 a single late annual return no longer costs a small or micro company that exemption; it's now lost only on a second late filing within five years, which gives a real second chance where there used to be none.\n\nWhen you do need an audit — because you're over the limits, you've lost the exemption, or a lender, investor or grant body asks for one — we plan it around where the risk actually sits, run it under ISA (Ireland), and finish with a management letter you can act on. A statutory audit under the Companies Act 2014 is the baseline; a voluntary one is often what gets a deal or a facility over the line.",
      },
    ],
  },
  {
    slug: "business-consulting",
    title: "Business Consulting",
    blurb:
      "Forming a company, raising finance, moving into a new market — the big calls, made with the numbers in front of you.",
    overview:
      "Practical advice from people who know your numbers. Whether you are forming a company, raising finance or expanding into a new market, we help you make the call with the figures in front of you.",
    kind: "services",
    items: [
      {
        slug: "company-setup",
        title: "Company Setup & Secretarial",
        blurb:
          "Incorporation, registrations and statutory filings to get you trading fast and keep the CRO happy.",
        overview:
          "Starting a company involves a dozen small registrations that are easy to get wrong and tedious to fix. We incorporate at the CRO, register you for the right taxes with Revenue, and keep the statutory book maintained — including the annual return (Form B1), which falls due six months after incorporation and every year after.",
        included: [
          "Company incorporation — registered at the CRO and ready to trade",
          "Tax registration — PAYE, VAT and corporation tax set up with Revenue",
          "Annual returns — the Form B1 and statutory filings kept current",
          "Statutory registers — maintained, including beneficial ownership (RBO)",
          "Shares and office — issues, transfers and a registered office service",
          "Board paperwork — dividend documentation and minutes drawn up",
        ],
        bestFor: [
          "First-time founders",
          "Sole traders incorporating",
          "Groups adding subsidiaries",
        ],
        context:
          "A new Irish company is incorporated at the CRO, usually as a private company limited by shares (LTD), and needs at least one EEA-resident director — or a Section 137 insurance bond if every director is non-resident. Straight after incorporation come the registrations that are easy to overlook: corporation tax, and PAYE or VAT where they apply, plus the Register of Beneficial Ownership (RBO), which has to be filed within five months.\n\nThe filing that catches people out is the first annual return (Form B1), due six months after incorporation — no financial statements are needed that first time, but miss it and the clock starts on penalties and audit-exemption risk. We handle the incorporation, the registrations and the statutory registers, so you're trading quickly and both the CRO and Revenue are satisfied from day one.",
      },
      {
        slug: "financial-consulting",
        title: "Financial Consulting",
        blurb:
          "Funding strategy, financial modelling and decision support — a finance brain on call when the stakes are high.",
        overview:
          "When the numbers behind a decision run to six or seven figures, a gut call isn't enough. We build the model, pressure-test the assumptions and sit with you while you decide — funding rounds, pricing, major hires, acquisitions.",
        included: [
          "Financial modelling — scenarios built and stress-tested",
          "Funding support — loan and grant applications put together",
          "Pricing analysis — margins and price points pulled apart",
          "Investment appraisal — business cases costed before you commit",
          "Cash-flow strategy — the runway mapped, not guessed",
          "Board reporting — packs your investors and directors trust",
        ],
        bestFor: [
          "Founders facing a big financial decision",
          "Businesses raising debt or equity",
          "Teams without an in-house finance lead",
        ],
        context:
          "Big financial decisions tend to arrive with a deadline and imperfect information — a funding round closing, a lease to commit to, a hire you can't easily undo. The value of a model isn't precision to the last euro; it's seeing how the decision behaves when your assumptions turn out wrong, so you know where the real risk is before you sign.\n\nWe build the numbers around your actual accounts rather than a template — cash runway, pricing and margin, the funding gap and how it gets filled — and stay in the room while you weigh it up. If you're applying for finance, banks and State-backed funders want to see that the projections hold together and the assumptions are defensible; we make sure they are.",
      },
      {
        slug: "international-expansion",
        title: "International Expansion",
        blurb:
          "Cross-border setup and tax structuring for businesses moving from Ireland into the EU and beyond.",
        overview:
          "Expanding into a new country multiplies your obligations. Whether you are moving into the EU single market or further afield, there are VAT registration, permanent-establishment and transfer-pricing questions to answer first. Large groups also need to watch the 15% global minimum tax (Pillar Two). We map the landscape before you commit, then set up the structure and keep it compliant.",
        included: [
          "Cross-border structuring — the setup planned from Ireland out",
          "Entity setup — companies established in new jurisdictions",
          "PE and transfer pricing — permanent-establishment and pricing risk reviewed",
          "EU VAT — OSS/IOSS registration and customs guidance",
          "Treaty planning — withholding tax and double-tax relief",
          "Pillar Two — the 15% global minimum tax assessed for large groups",
        ],
        bestFor: [
          "Irish firms expanding into the EU",
          "Overseas businesses setting up in Ireland",
          "Groups rationalising their structure",
        ],
        context:
          "Trading into another country rarely means one new obligation — it usually means several at once. Selling goods or services across the EU can trigger a VAT registration abroad or bring you into the OSS/IOSS regime, and putting people or a fixed place of business on the ground can create a permanent establishment that's taxable there. Get the structure wrong early and it's slow and costly to unwind.\n\nFor larger groups there's Pillar Two on top: a 15% global minimum effective tax rate for groups with consolidated turnover above €750m, now in force across the EU. Ireland keeps its 12.5% headline rate, but big groups pay a top-up to reach 15%. We map the VAT, permanent-establishment, transfer-pricing and treaty questions before you move, then set the structure up and keep it compliant.",
      },
    ],
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation",
    blurb:
      "Move off spreadsheets, onto a system that scales, with AI handling the repetitive work. The finance function, modernised.",
    overview:
      "Technology should take work off your plate, not add to it. We modernise finance operations end to end — migrating systems, automating the manual, and embedding AI where it earns its place. With Revenue's real-time reporting and e-invoicing spreading across Europe, digital records are fast becoming the baseline, not the upgrade.",
    kind: "services",
    items: [
      {
        slug: "financial-transformation",
        title: "Financial Transformation",
        blurb:
          "Redesign finance processes and reporting so month-end close is faster, cleaner and built for scale.",
        overview:
          "Growing businesses outgrow their finance processes quietly — until close takes three weeks. We redesign the workflow — systems, controls and reporting — so the numbers arrive faster and you trust them more.",
        included: [
          "Process review — finance workflows redesigned end to end",
          "Faster close — month-end cut from weeks to days",
          "Management reporting — dashboards that answer real questions",
          "Controls — approval and sign-off workflows built in",
          "Systems roadmap — the right tools selected, in the right order",
          "Change management — the team trained and brought along",
        ],
        bestFor: [
          "Businesses where close takes too long",
          "Teams scaling past their spreadsheets",
          "Finance leads inheriting a mess",
        ],
        context:
          "Finance processes tend to be inherited rather than designed. They work at one size and quietly break at the next — month-end drags on, the numbers need caveats, and nobody fully trusts the report. The fix is rarely a single new tool; it's redesigning how data flows from transaction to statement so the close is fast because it's clean, not because someone worked the weekend.\n\nThere's a compliance tailwind, too. Revenue's real-time reporting and the spread of e-invoicing across Europe mean structured, digital finance data is becoming the baseline rather than a nice-to-have. We redesign the workflow, the controls and the reporting together, then bring the team along so the new way of working actually sticks.",
      },
      {
        slug: "erp-migration",
        title: "ERP Migration",
        blurb:
          "Plan and run your move to a modern ERP — Xero, NetSuite, Dynamics or Sage — without losing your data or your mind.",
        overview:
          "An ERP migration done badly can set you back a year. We scope the move, map and clean the data, run the migration in parallel, and stay on through go-live so the numbers reconcile from day one — with ROS-ready digital record-keeping built in.",
        included: [
          "ERP selection — the right platform for how you actually work",
          "Data migration — mapped, cleaned and moved across",
          "Chart of accounts — redesigned for the new system",
          "Parallel running — old and new reconciled before switch-off",
          "Integrations — existing tools and e-invoicing connected",
          "Go-live support — hands on through the switch, plus training",
        ],
        bestFor: [
          "Businesses outgrowing entry-level software",
          "Groups consolidating onto one system",
          "Anyone burned by a past migration",
        ],
        context:
          "Most ERP migrations don't fail on the software — they fail on the data and the switch. Years of transactions, half of them with quirks nobody documented, have to be mapped to a new chart of accounts and moved without breaking your history or your VAT trail. Run it as a big-bang cutover with no parallel period and you find the problems in production, which is the worst place to find them.\n\nWe scope the move, clean and map the data, and run the old and new systems side by side until the numbers reconcile, then stay on through go-live. Digital, ROS-ready record-keeping is built in from the start, so the new system meets Revenue's requirements on day one instead of being something you retrofit later.",
      },
      {
        slug: "ai-automation",
        title: "AI Automation",
        blurb:
          "Automate the repetitive finance work — invoice processing, reconciliations, approvals — so the team does judgement, not data entry.",
        overview:
          "A lot of finance work is repetitive and rules-based — exactly the kind of thing software handles better than people. We find those tasks and automate them — invoice capture, reconciliations, approvals, reporting — so the team spends its time where judgement is actually needed.",
        included: [
          "Automation assessment — the rules-based work identified first",
          "Invoice capture — receipts and bills read by OCR / AI",
          "Bank reconciliation — matched automatically, exceptions flagged",
          "Approval workflows — routing and sign-off automated",
          "Automated reporting — numbers and alerts on schedule",
          "Rollout — tools integrated and the team onboarded",
        ],
        bestFor: [
          "Teams drowning in manual data entry",
          "High-volume transaction businesses",
          "Finance functions under headcount pressure",
        ],
        context:
          "The finance work worth automating is the high-volume, rules-based kind: matching invoices, chasing receipts, coding transactions, reconciling the bank. It's repetitive, it's error-prone when people are tired, and it's exactly what OCR and modern automation handle well. Automating it isn't about cutting the team — it's about pointing them at the work that needs judgement.\n\nWe start by measuring where the hours actually go, then automate the tasks with the best return first rather than trying to boil the ocean. Everything stays inside proper controls and approvals, because the point of taking people out of data entry is to put them back where they add value — reviewing, deciding, and catching the things a rule can't.",
      },
      {
        slug: "ai-integration",
        title: "AI Integration",
        blurb:
          "Embed AI into your existing systems and workflows — connected to your real data, with the guardrails to trust it.",
        overview:
          "Generic AI tools rarely fit the way you actually work. We integrate AI into your real systems and data — forecasting, anomaly detection, document processing — with the controls and oversight to rely on the output.",
        included: [
          "Use-case discovery — the highest-value applications prioritised",
          "System integration — AI wired into your finance stack",
          "Custom models — trained on your own data, not generic",
          "Forecasting — anomaly detection and prediction built in",
          "Data pipelines — governed, documented and maintainable",
          "Guardrails — security, controls and human oversight",
        ],
        bestFor: [
          "Businesses with data but no AI strategy",
          "Teams piloting AI tools that don't connect",
          "Leaders wanting AI with guardrails",
        ],
        context:
          "Generic AI tools demo well and disappoint in practice, because they don't know your chart of accounts, your customers or your history. The value comes from connecting AI to your real data — forecasting on your actual cash patterns, flagging anomalies against your own baselines, reading your own documents — inside the systems you already use.\n\nThat only works with guardrails. Financial data needs access controls, an audit trail, and a human signing off anything that drives a decision or a filing. We build the integration and the governance together, so the output is something you can rely on and defend, not a black box you have to take on trust.",
      },
    ],
  },
  {
    slug: "personal-finance",
    title: "Personal Finance",
    blurb:
      "How you earn decides your tax bill. We plan around your profession so you keep more of what you make.",
    overview:
      "Your tax position depends on how you earn. We tailor planning to your profession — the reliefs, structures and pitfalls specific to your work — so you keep more of it and sleep better at year-end.",
    kind: "personas",
    items: [
      {
        slug: "doctors",
        title: "Doctors & Medical Professionals",
        blurb:
          "Pension funding, private practice income and locum structuring for medics.",
        overview:
          "Medical careers create tax problems other professions never see — pension funding limits, mixed public (HSE) and private income, and locum work. We handle the specifics so a good year doesn't turn into a tax-bill shock.",
        included: [
          "Pension planning — funding limits and retirement relief",
          "Mixed income — HSE and private practice earnings reconciled",
          "Locum work — consultancy and locum income structured",
          "Structure — sole trader vs limited company, decided on the numbers",
          "Form 11 — the personal income tax return filed",
          "Reliefs — expenses, capital allowances and retirement planning",
        ],
        bestFor: [
          "Consultants with HSE and private income",
          "Locum doctors",
          "GPs running their own practice",
        ],
        context:
          "Medicine creates tax questions most professions never face. Consultants often earn through a mix of HSE salary and private practice income, which have to be reported and structured correctly; GPs frequently run a practice as a business in its own right; and locum work adds another layer again. A strong year can turn into a preliminary-tax shock if none of it has been planned for.\n\nPensions are where the biggest reliefs sit — and where the limits bite. Contributions attract tax relief up to age-related percentage limits, and the Standard Fund Threshold — the cap on a tax-relieved pension pot — rose to €2.2 million in 2026 and is set to climb in steps to €2.8 million by 2029, so timing matters, particularly later in a career. We handle the Form 11, the practice structure and the pension planning together, so a good income doesn't quietly become a bad tax bill.",
      },
      {
        slug: "it-professionals",
        title: "IT Workers & Professionals",
        blurb:
          "Contractor structuring and share-option taxation for tech workers and contractors.",
        overview:
          "Tech pay comes in forms Revenue treats very differently — contract income, RSUs, share options. We structure it properly and plan around capital gains (33% CGT) so equity doesn't catch you out.",
        included: [
          "Contractor structuring — limited company set up properly",
          "PSC vs umbrella — the personal service company question answered",
          "Equity tax — RSUs and share options planned around",
          "Capital gains — 33% CGT on share disposals planned for",
          "Form 11 — income tax returns and home-office claims",
          "Wealth — pension and investment planning",
        ],
        bestFor: [
          "Contract and freelance developers",
          "Employees with RSUs or options",
          "Consultants weighing limited vs umbrella",
        ],
        context:
          "Tech pay arrives in forms Revenue treats very differently. Salary is taxed under PAYE; contract income depends on whether you trade as a sole trader, through your own limited company, or via an umbrella; and equity — RSUs, options, ESPP — has its own timing and its own traps. RSUs are generally taxed as pay when they vest, and a later sale can bring a separate capital gains charge on top.\n\nCapital gains run at 33%, with only the first €1,270 of gains each year exempt, so selling vested shares needs planning rather than a panic in October. We get the trading structure right, plan the equity around the tax, and keep the Form 11 and preliminary tax on track so nothing lands unexpectedly.",
      },
      {
        slug: "independent-contractors",
        title: "Independent Contractors",
        blurb:
          "End-to-end tax and bookkeeping for self-employed contractors — expenses and the right trading structure.",
        overview:
          "When you work for yourself, the admin is on you too. We take it off your plate — bookkeeping, expenses, returns — and keep you square with Revenue. Whatever your trade, we get the structure and the reliefs right, and stay on top of preliminary tax so nothing lands as a surprise.",
        included: [
          "Structure — sole trader vs limited company, decided early",
          "RCT — Relevant Contracts Tax handled for construction work",
          "Books — bookkeeping and expense tracking kept current",
          "Form 11 — the personal income tax return filed",
          "VAT — registration and returns once you cross the threshold",
          "Preliminary tax — planned so it never lands as a surprise",
        ],
        bestFor: [
          "Self-employed trades and freelancers",
          "Construction subcontractors under RCT",
          "Anyone going limited for the first time",
        ],
        context:
          "Going out on your own means the admin comes with it. Whether you stay a sole trader or set up a limited company changes your tax, your paperwork and your exposure, so it's worth deciding deliberately rather than by default. Once you're trading, income tax is self-assessed on the Form 11, due by 31 October each year — a little later if you pay and file through ROS — and preliminary tax for the year ahead falls due at the same time, which is the bill that surprises people in their first full year.\n\nIf you work in construction, Relevant Contracts Tax (RCT) adds another layer, with deduction rates of 0%, 20% or 35% set by your compliance record. We keep the books, handle the returns and manage preliminary tax so it's planned for, not a shock in the post.",
      },
      {
        slug: "entrepreneurs",
        title: "Entrepreneurs & Founders",
        blurb:
          "Personal tax strategy for founders — remuneration, share schemes, reliefs and the path to exit.",
        overview:
          "For a founder, the business and your personal wealth move together. We plan remuneration, equity and reliefs across both — salary vs dividends, share schemes, and the exit reliefs that matter. Revised Entrepreneur Relief charges 10% CGT on qualifying gains up to a €1.5m lifetime limit (raised from €1m for disposals from January 2026) — so timing and structure are worth real money.",
        included: [
          "Remuneration — salary and dividend mix planned",
          "Share schemes — KEEP options designed and administered",
          "Entrepreneur Relief — 10% CGT up to the €1.5m lifetime limit",
          "Exit timing — capital gains planned around the sale",
          "Alignment — personal and business tax pulled together",
          "Wealth — investment and succession planning",
        ],
        bestFor: [
          "Founders of growing companies",
          "Owners planning an exit",
          "Anyone balancing personal and business tax",
        ],
        context:
          "For a founder the business and your own finances are one system, and the tax works best when they're planned together. How you pay yourself — salary versus dividends — affects both the company's position and your personal bill, and a share scheme like KEEP lets you bring key people in on equity in a tax-efficient way rather than with cash you'd rather keep in the business.\n\nThe number that rewards planning most sits at exit. Revised Entrepreneur Relief charges 10% CGT on qualifying gains, and Budget 2026 raised the lifetime limit to €1.5 million — up from €1 million — for disposals from January 2026, against a standard CGT rate of 33%. Getting the structure and the timing right ahead of a sale is worth real money, often more than a full year of trading profit.",
      },
    ],
  },
  {
    slug: "ai",
    title: "AI",
    blurb:
      "AI on real finance problems — forecasting, automation, tax. A chartered accountant signs off every output.",
    overview:
      "We put AI to work on real finance problems. Where it adds genuine value — forecasting, automation, tax analysis — we deploy it; where it doesn't, we say so. Practical applications, measurable results, with a chartered accountant on every output.",
    kind: "services",
    items: [
      {
        slug: "finance",
        title: "AI for Finance",
        blurb:
          "AI-driven forecasting, reporting and analysis that turns your finance data into decisions.",
        overview:
          "There are answers in your finance data you don't have time to dig for. We apply AI to surface them — cash-flow forecasting, anomaly detection, real-time reporting — so you see what's coming, not just what already happened.",
        included: [
          "Forecasting — AI cash-flow and revenue projections",
          "Anomaly detection — fraud and errors flagged early",
          "Real-time reporting — dashboards that stay current",
          "Scenario modelling — what-if analysis on demand",
          "Margin analysis — spend and profitability broken down",
          "Data setup — sources integrated and cleaned",
        ],
        bestFor: [
          "Businesses wanting forward-looking numbers",
          "Finance teams short on analysis time",
          "Leaders making data-led decisions",
        ],
        context:
          "Most finance teams are rich in data and poor in time to interrogate it. The monthly numbers tell you what already happened; the questions that matter — will cash hold up, which customers are slipping, where margin is leaking — need someone to dig, and the digging rarely gets done. That's the gap AI is genuinely good at closing.\n\nWe apply it to your own figures: cash-flow and revenue forecasting built on your real patterns, anomaly detection that flags the odd transaction early, and reporting that stays current instead of being rebuilt every month. A chartered accountant reviews what it produces, because a forecast you're going to act on needs judgement behind it, not just output.",
      },
      {
        slug: "business-automation",
        title: "AI for Business Model & Automation",
        blurb:
          "Rethink and automate how the business runs — workflows, pricing and operations powered by AI.",
        overview:
          "AI can reshape how the business earns, not just how the back office runs. We help you find those opportunities — automated operations, AI-driven pricing, new service lines — and build them in.",
        included: [
          "Opportunity assessment — where AI actually moves the model",
          "Operations — workflows automated end to end",
          "Pricing — AI-driven pricing and segmentation",
          "Analytics — customer and demand insight",
          "New revenue — service lines designed and costed",
          "Rollout — built, integrated and launched",
        ],
        bestFor: [
          "Businesses exploring AI opportunities",
          "Operations-heavy companies",
          "Leaders rethinking their model",
        ],
        context:
          "AI often gets bolted onto the back office when the bigger opportunity is in the business model itself — how you price, how you serve customers, what you can offer that wasn't economic before. Automating operations frees up capacity; rethinking pricing or productising a service can change what the business is actually worth.\n\nWe look at both: the workflows worth automating now, and the model-level moves AI makes possible — dynamic pricing, demand analytics, new service lines. Then we build the ones with a real return, grounded in your numbers rather than in hype, so the change shows up in margin and not just in a slide deck.",
      },
      {
        slug: "taxation",
        title: "AI for Taxation",
        blurb:
          "AI-assisted tax analysis and optimisation — spot reliefs, model scenarios and cut compliance time.",
        overview:
          "Tax work is full of repetition and pattern-matching — the kind of thing AI genuinely helps with. We use it to scan for reliefs you're missing, model the tax impact of decisions, and speed up compliance across the Irish tax regime — always with a chartered accountant signing off the output.",
        included: [
          "Relief discovery — allowances and reliefs surfaced by AI",
          "Scenario modelling — the tax impact of decisions, mapped",
          "Compliance checks — automated across the Irish tax regime",
          "Data extraction — documents and figures pulled automatically",
          "Risk flagging — anomalies caught before Revenue does",
          "Expert sign-off — a chartered accountant reviews every output",
        ],
        bestFor: [
          "Businesses with complex tax positions",
          "High-volume compliance work",
          "Anyone leaving reliefs unclaimed",
        ],
        context:
          "Irish tax is detailed, changes every Budget, and is full of reliefs that go unclaimed simply because nobody had time to check — R&D, capital allowances, various sector-specific measures. Much of the work of finding them is pattern-matching across documents and prior returns, which is exactly where AI earns its place.\n\nWe use it to scan for reliefs and allowances you may be missing, model the tax impact of a decision before you make it, and speed up routine compliance across the Irish regime. Nothing goes out on AI's say-so, though: a chartered accountant reviews and signs off every position, because with Revenue the responsibility is yours and the answer has to be right.",
      },
    ],
  },
  {
    slug: "cfo-service",
    title: "Fractional CFO",
    blurb:
      "A finance director for a few days a month. Forecasts, board packs and funding support, without the salary.",
    overview:
      "Most businesses don't need a full-time finance director — they need a few hours of a great one, armed with current numbers. We build the forecast, sit in the board meeting, and tell you what the numbers mean for the decision in front of you.",
    kind: "single",
    items: [],
    included: [
      "Forecasting — cash-flow and P&L, kept current",
      "CFO sessions — monthly or quarterly, in the room",
      "Board packs — budgets, KPIs and reporting",
      "Funding support — loan and investment applications",
      "Valuations — the business valued when it matters",
      "Exit planning — succession and sale prepared for",
    ],
    bestFor: [
      "Scaling businesses making their first big hires",
      "Companies raising or refinancing",
      "Founders who need strategy, not just compliance",
    ],
    context:
      "There's a stage where a business is too big to run the finances on instinct but too small to justify a full-time finance director on a six-figure salary. What you actually need is a few days a month of someone senior, working from current numbers — building the forecast, sitting in the board meeting, and translating the figures into the decision in front of you.\n\nThat's the role we fill: cash-flow and P&L forecasting, budgets, KPIs and board packs, and hands-on support when you're raising or refinancing. You get the judgement of an experienced finance director and the continuity of the same person each month, without the cost or the commitment of the hire.",
  },
  {
    slug: "outsourcing",
    title: "Outsourcing",
    blurb:
      "Hand us the finance function — bookkeeping through to management accounts — and run lean. We become your back office.",
    overview:
      "Hiring a full finance team is slow and expensive. We run all or part of yours as an extension of your business — bookkeeping, payroll, reporting, controls — for a fraction of the cost of building it in-house.",
    kind: "single",
    items: [],
    included: [
      "Finance function — run in full or in part, as your back office",
      "Bookkeeping — transactions processed and reconciled",
      "Payments — payroll and suppliers paid on time",
      "Reporting — management accounts every month",
      "Credit control — invoices chased, cash collected",
      "Named contact — a dedicated team you actually know",
    ],
    bestFor: [
      "Businesses without an in-house finance team",
      "Companies cutting overhead",
      "Irish firms scaling fast",
    ],
    context:
      "Building an in-house finance team is slow and expensive: you're recruiting for several roles, covering holidays and sick leave, and carrying the cost whether the work is there that month or not. Outsourcing the function — or just the parts you don't want to own — gives you the same output as an extension of your business, scaled to what you actually need.\n\nWe run bookkeeping, payroll, supplier payments, management accounts and credit control, keeping everything ROS-ready and reconciled, with a named contact who knows your business rather than a faceless queue. As you grow, the service grows with you, which is usually cheaper and far less disruptive than hiring, training and replacing a team of your own.",
  },
  {
    slug: "crypto",
    title: "Crypto & Digital Assets",
    blurb:
      "Crypto gains, staking, mining and DeFi — calculated, reported and planned. Ahead of the CARF rules landing in 2026.",
    overview:
      "Crypto tax is complex, fast-moving and easy to get wrong — and the days of it going unnoticed are over. In Ireland, disposals are subject to 33% Capital Gains Tax above the €1,270 annual exemption, while income from staking, mining or airdrops can be taxable at your marginal rate. Under the OECD Crypto-Asset Reporting Framework (CARF), exchanges begin collecting data in 2026 and reporting it to Revenue from 2027 — so accurate records are no longer optional. We calculate, report and plan it properly.",
    kind: "single",
    items: [],
    included: [
      "Gains calculation — capital gains across every wallet and exchange",
      "CGT reporting — filed via ROS / Form CG1 (33%, €1,270 exemption)",
      "Income vs capital — staking, mining, airdrops and DeFi classified",
      "CARF readiness — prepared for 2026/27 exchange reporting",
      "Record reconstruction — portfolios rebuilt and reconciled",
      "Preliminary tax — payments planned ahead",
    ],
    bestFor: [
      "Investors and traders with multi-exchange activity",
      "Businesses accepting or holding digital assets",
      "Anyone facing CARF reporting or a Revenue query",
    ],
    context:
      "Crypto is taxed in Ireland under the existing rules, not a special regime, which is what trips people up. Disposing of a crypto-asset — selling it, swapping one token for another, or spending it — is a capital gains event, taxed at 33% on the gain above the €1,270 annual exemption. Income from staking, mining or airdrops is treated differently again, and can be taxable at your marginal rate when it's received. Every wallet and exchange has to be pulled together to get it right.\n\nThe bigger shift is visibility. Under the OECD Crypto-Asset Reporting Framework (CARF), and the EU's DAC8, exchanges begin collecting user data in 2026 and reporting it to Revenue from 2027 — so positions that once went unnoticed no longer will. We reconstruct the records, calculate the gains, classify the income correctly and file through ROS, so you're straight with Revenue before the data arrives ahead of you.",
  },
];

export function getCategory(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.slug === slug);
}

/** Category + sub-service slug pairs that have a detail page (excludes coming-soon and single). */
export function getServiceParams(): { category: string; slug: string }[] {
  return serviceCategories
    .filter((category) => category.status !== "coming-soon")
    .flatMap((category) =>
      category.items.map((item) => ({ category: category.slug, slug: item.slug })),
    );
}
