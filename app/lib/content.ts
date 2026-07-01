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
   Figures current for 2025/26 — Republic of Ireland. Verify at point of advice.
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
          "Good tax work happens before the year ends, not after. Ireland holds its 12.5% trading rate (with 25% on non-trading income), and a 15% effective minimum top-up (QDTT) applies only to groups turning over more than €750m. We plan reliefs and timing around all of it, file on schedule with Revenue through ROS, and put your positions in writing.",
        included: [
          "Corporation tax returns — CT1, filed via ROS",
          "Trading vs passive income and close-company surcharge planning",
          "R&D tax credit — 30%, rising to 35% from January 2026",
          "Capital allowances and accelerated-allowance reviews",
          "Income tax returns (Form 11) for directors and owners",
          "Revenue audit and intervention handling",
        ],
        bestFor: [
          "Owner-managed companies trading in Ireland",
          "Businesses with R&D, capital spend or innovation grants",
          "Groups managing Pillar Two exposure",
        ],
      },
      {
        slug: "vat-returns",
        title: "VAT Returns",
        blurb:
          "Accurate VAT registration and returns — filed through ROS and reconciled to your books before they go in.",
        overview:
          "VAT is where small mistakes get expensive fast. Ireland registers at €85,000 for goods and €42,500 for services, files bi-monthly through ROS, and adds an annual Return of Trading Details. We handle registration, scheme selection and every return — and reconcile each one to your books before it goes in.",
        included: [
          "VAT registration (€85k goods, €42.5k services)",
          "Bi-monthly VAT3 returns filed through ROS",
          "Annual Return of Trading Details (RTD)",
          "VIES and Intrastat for cross-border EU trade",
          "Scheme advice — cash accounting, margin, OSS/IOSS",
          "Reconciliation of every return to your ledger before submission",
        ],
        bestFor: [
          "Businesses trading across Ireland and the EU",
          "E-commerce and cross-border sellers",
          "Anyone near or over the registration threshold",
        ],
      },
      {
        slug: "annual-accounts",
        title: "Annual Accounts",
        blurb:
          "Year-end statutory accounts under FRS 102 / FRS 105, filed with the CRO — done early, not at the deadline.",
        overview:
          "Year-end accounts should tell you something, not just satisfy a filing. We prepare statutory accounts under FRS 102 (or FRS 105 for micro-entities), agree them with you in plain English, and file on time — Irish accounts go to the CRO with the annual return (Form B1), tagged in iXBRL for Revenue. Many small companies (turnover up to €15m, balance sheet up to €7.5m, 50 staff) qualify for audit exemption.",
        included: [
          "Statutory accounts under FRS 102 / FRS 105",
          "Filing with the CRO via Form B1",
          "iXBRL tagging for Revenue and CRO requirements",
          "Directors' report and annual return",
          "Corporation tax computation prepared alongside",
          "Small-company and audit-exemption assessment",
        ],
        bestFor: [
          "Limited companies in Ireland",
          "Directors who file late every year",
          "Groups with multiple entities",
        ],
      },
      {
        slug: "bookkeeping",
        title: "Bookkeeping & Cloud Accounting",
        blurb:
          "Clean, current books on Xero or QuickBooks, with monthly management accounts you can actually read.",
        overview:
          "Books that are three months behind are books you cannot run a business on. We keep yours current on Xero or QuickBooks — bank feeds live, receipts captured, queries chased — and close each month with accounts in plain English, ready for whatever Revenue asks.",
        included: [
          "Full bookkeeping on Xero or QuickBooks",
          "Bank feeds, receipt capture and reconciliation",
          "Monthly close with management accounts",
          "Real-time digital records, ready for ROS filing",
          "Debtor and creditor reporting",
          "Migration from spreadsheets or legacy software, with team training",
        ],
        bestFor: [
          "Founders doing their own books at midnight",
          "Sole traders and landlords filing with Revenue",
          "Businesses that want monthly numbers, not annual",
        ],
      },
      {
        slug: "payroll",
        title: "Payroll & Pensions",
        blurb:
          "Accurate payslips, real-time submissions and pension auto-enrolment handled — your team paid right, every cycle.",
        overview:
          "Payroll is unforgiving: one late submission or a missed pension upload and you are writing to Revenue. We run the whole cycle — payslips, PAYE Modernisation submissions, pensions and year-end forms. We also keep you ahead of cost changes: employee PRSI rose to 4.2% from October 2025, and pension auto-enrolment (My Future Fund) begins in 2026.",
        included: [
          "Weekly or monthly payroll runs",
          "Real-time PAYE Modernisation submissions to Revenue",
          "PRSI, USC and PAYE calculated and filed",
          "Pension auto-enrolment (My Future Fund) readiness",
          "Benefit-in-kind and expense reporting",
          "Year-end payroll returns, posted to your books",
        ],
        bestFor: [
          "Companies hiring their first employees",
          "Teams of 1 to 100 on the payroll",
          "Directors balancing salary and dividends",
        ],
      },
      {
        slug: "audit-assurance",
        title: "Audit & Assurance",
        blurb:
          "Statutory and voluntary audits that stand up to scrutiny — and give lenders, boards and buyers confidence in your numbers.",
        overview:
          "An audit should do more than satisfy a legal requirement. The first question we answer is whether you even need one — many companies qualify for audit exemption (turnover up to €15m, balance sheet up to €7.5m, 50 employees), though a late annual return can cost you that exemption. When you do need an audit, ours are planned around your risks, run under ISA (Ireland) with minimal disruption, and end with a management letter you will actually act on.",
        included: [
          "Statutory audits under ISA (Ireland)",
          "Audit-exemption and group-size assessment",
          "Voluntary audits for lenders or investors",
          "Internal audit and controls review",
          "Grant and charity (SORP) audits",
          "Due-diligence support on acquisitions",
        ],
        bestFor: [
          "Companies above the audit-exemption threshold",
          "Companies that lost exemption through a late return",
          "Businesses raising debt or equity",
        ],
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
          "Company incorporation at the CRO",
          "PAYE, VAT and corporation tax registration with Revenue",
          "Annual returns (Form B1) and statutory filings",
          "Statutory registers, including beneficial ownership (RBO)",
          "Share issues, transfers and registered office service",
          "Dividend paperwork and board minutes",
        ],
        bestFor: [
          "First-time founders",
          "Sole traders incorporating",
          "Groups adding subsidiaries",
        ],
      },
      {
        slug: "financial-consulting",
        title: "Financial Consulting",
        blurb:
          "Funding strategy, financial modelling and decision support — a finance brain on call when the stakes are high.",
        overview:
          "Some decisions are too big to make on a hunch. We build the model, pressure-test the assumptions and sit with you while you decide — funding rounds, pricing, major hires, acquisitions.",
        included: [
          "Financial modelling and scenario planning",
          "Funding and loan application support",
          "Pricing and margin analysis",
          "Investment appraisal and business cases",
          "Cash-flow strategy",
          "Board and investor reporting",
        ],
        bestFor: [
          "Founders facing a big financial decision",
          "Businesses raising debt or equity",
          "Teams without an in-house finance lead",
        ],
      },
      {
        slug: "international-expansion",
        title: "International Expansion",
        blurb:
          "Cross-border setup and tax structuring for businesses moving from Ireland into the EU and beyond.",
        overview:
          "Expanding into a new country multiplies your obligations. Whether you are moving into the EU single market or further afield, there are VAT registration, permanent-establishment and transfer-pricing questions to answer first. Large groups also need to watch the 15% global minimum tax (Pillar Two). We map the landscape before you commit, then set up the structure and keep it compliant.",
        included: [
          "Cross-border structuring from Ireland",
          "Entity setup in new jurisdictions",
          "Permanent establishment and transfer-pricing review",
          "EU VAT, OSS/IOSS and customs guidance",
          "Withholding tax and double-tax treaty planning",
          "Pillar Two / global minimum tax assessment for large groups",
        ],
        bestFor: [
          "Irish firms expanding into the EU",
          "Overseas businesses setting up in Ireland",
          "Groups rationalising their structure",
        ],
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
          "Finance process review and redesign",
          "Month-end close acceleration",
          "Management reporting and dashboards",
          "Controls and approval workflows",
          "Systems selection and roadmap",
          "Change management and team training",
        ],
        bestFor: [
          "Businesses where close takes too long",
          "Teams scaling past their spreadsheets",
          "Finance leads inheriting a mess",
        ],
      },
      {
        slug: "erp-migration",
        title: "ERP Migration",
        blurb:
          "Plan and run your move to a modern ERP — Xero, NetSuite, Dynamics or Sage — without losing your data or your mind.",
        overview:
          "An ERP migration done badly can set you back a year. We scope the move, map and clean the data, run the migration in parallel, and stay on through go-live so the numbers reconcile from day one — with ROS-ready digital record-keeping built in.",
        included: [
          "ERP selection and fit assessment",
          "Data mapping, cleansing and migration",
          "Chart of accounts redesign",
          "Parallel running and reconciliation",
          "Integration with existing tools and e-invoicing",
          "Go-live support and training",
        ],
        bestFor: [
          "Businesses outgrowing entry-level software",
          "Groups consolidating onto one system",
          "Anyone burned by a past migration",
        ],
      },
      {
        slug: "ai-automation",
        title: "AI Automation",
        blurb:
          "Automate the repetitive finance work — invoice processing, reconciliations, approvals — so the team does judgement, not data entry.",
        overview:
          "Most finance teams spend their days on work a machine should do. We identify the high-volume, rules-based tasks and automate them — invoice capture, reconciliations, approvals, reporting — freeing people for the work that needs a brain.",
        included: [
          "Process automation assessment",
          "Invoice and receipt capture (OCR / AI)",
          "Bank reconciliation automation",
          "Approval and workflow automation",
          "Automated reporting and alerts",
          "Tool integration and rollout",
        ],
        bestFor: [
          "Teams drowning in manual data entry",
          "High-volume transaction businesses",
          "Finance functions under headcount pressure",
        ],
      },
      {
        slug: "ai-integration",
        title: "AI Integration",
        blurb:
          "Embed AI into your existing systems and workflows — connected to your real data, with the guardrails to trust it.",
        overview:
          "Off-the-shelf AI rarely fits how you work. We integrate AI into your actual systems and data — forecasting, anomaly detection, document processing — with the controls and oversight to rely on the output.",
        included: [
          "AI use-case discovery and prioritisation",
          "Integration with your finance systems",
          "Custom models on your own data",
          "Forecasting and anomaly detection",
          "Data pipeline and governance setup",
          "Security, controls and human oversight",
        ],
        bestFor: [
          "Businesses with data but no AI strategy",
          "Teams piloting AI tools that don't connect",
          "Leaders wanting AI with guardrails",
        ],
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
          "Pension funding and retirement-relief planning",
          "HSE and private practice income",
          "Locum and consultancy structuring",
          "Sole trader vs limited company structuring",
          "Income tax returns (Form 11)",
          "Expense, capital allowance and retirement planning",
        ],
        bestFor: [
          "Consultants with HSE and private income",
          "Locum doctors",
          "GPs running their own practice",
        ],
      },
      {
        slug: "it-professionals",
        title: "IT Workers & Professionals",
        blurb:
          "Contractor structuring and share-option taxation for tech workers and contractors.",
        overview:
          "Tech pay comes in forms Revenue treats very differently — contract income, RSUs, share options. We structure it properly and plan around capital gains (33% CGT) so equity doesn't catch you out.",
        included: [
          "Limited company and contractor structuring",
          "Personal service company vs umbrella advice",
          "RSU and share-option tax planning",
          "Capital gains planning on share disposals (33% CGT)",
          "Income tax returns and home-office claims",
          "Pension and investment planning",
        ],
        bestFor: [
          "Contract and freelance developers",
          "Employees with RSUs or options",
          "Consultants weighing limited vs umbrella",
        ],
      },
      {
        slug: "independent-contractors",
        title: "Independent Contractors",
        blurb:
          "End-to-end tax and bookkeeping for self-employed contractors — expenses and the right trading structure.",
        overview:
          "When you work for yourself, the admin is on you too. We take it off your plate — bookkeeping, expenses, returns — and keep you square with Revenue. Whatever your trade, we get the structure and the reliefs right, and stay on top of preliminary tax so nothing lands as a surprise.",
        included: [
          "Sole trader vs limited company advice",
          "Relevant Contracts Tax (RCT) handling (construction)",
          "Bookkeeping and expense tracking",
          "Income tax returns (Form 11)",
          "VAT registration and returns",
          "Preliminary tax and cash-flow planning",
        ],
        bestFor: [
          "Self-employed trades and freelancers",
          "Construction subcontractors under RCT",
          "Anyone going limited for the first time",
        ],
      },
      {
        slug: "entrepreneurs",
        title: "Entrepreneurs & Founders",
        blurb:
          "Personal tax strategy for founders — remuneration, share schemes, reliefs and the path to exit.",
        overview:
          "Building a business and your personal wealth are the same project. We plan remuneration, equity and reliefs across both — salary vs dividends, share schemes, and the exit reliefs that matter. Revised Entrepreneur Relief charges 10% CGT on qualifying gains up to a €1m lifetime limit — so timing and structure are worth real money.",
        included: [
          "Salary, dividend and remuneration planning",
          "KEEP share-scheme design and administration",
          "Revised Entrepreneur Relief (10% CGT, €1m lifetime limit)",
          "Capital gains and exit-timing planning",
          "Personal and business tax alignment",
          "Investment, wealth and succession planning",
        ],
        bestFor: [
          "Founders of growing companies",
          "Owners planning an exit",
          "Anyone balancing personal and business tax",
        ],
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
          "Your finance data holds answers you don't have time to dig for. We apply AI to surface them — cash-flow forecasting, anomaly detection, real-time reporting — so you see what's coming, not just what happened.",
        included: [
          "AI cash-flow and revenue forecasting",
          "Anomaly and fraud detection",
          "Real-time reporting and dashboards",
          "Scenario modelling",
          "Spend and margin analysis",
          "Data integration and setup",
        ],
        bestFor: [
          "Businesses wanting forward-looking numbers",
          "Finance teams short on analysis time",
          "Leaders making data-led decisions",
        ],
      },
      {
        slug: "business-automation",
        title: "AI for Business Model & Automation",
        blurb:
          "Rethink and automate how the business runs — workflows, pricing and operations powered by AI.",
        overview:
          "AI changes what's possible in your business model, not just your back office. We help you find those opportunities — automated operations, AI-driven pricing, new service lines — and build them in.",
        included: [
          "Business model and opportunity assessment",
          "Workflow and operations automation",
          "AI-driven pricing and segmentation",
          "Customer and demand analytics",
          "New revenue-stream design",
          "Implementation and rollout",
        ],
        bestFor: [
          "Businesses exploring AI opportunities",
          "Operations-heavy companies",
          "Leaders rethinking their model",
        ],
      },
      {
        slug: "taxation",
        title: "AI for Taxation",
        blurb:
          "AI-assisted tax analysis and optimisation — spot reliefs, model scenarios and cut compliance time.",
        overview:
          "Tax is full of patterns AI is good at finding. We use it to scan for reliefs you're missing, model the tax impact of decisions, and speed up compliance across the Irish tax regime — always with a chartered accountant signing off the output.",
        included: [
          "AI-assisted relief and allowance discovery",
          "Tax scenario modelling",
          "Automated compliance checks",
          "Document and data extraction",
          "Risk and anomaly flagging",
          "Expert review of all output",
        ],
        bestFor: [
          "Businesses with complex tax positions",
          "High-volume compliance work",
          "Anyone leaving reliefs unclaimed",
        ],
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
      "Cash-flow and P&L forecasting",
      "Monthly or quarterly CFO sessions",
      "Budgets, KPIs and board packs",
      "Funding and loan application support",
      "Business valuations",
      "Exit and succession planning",
    ],
    bestFor: [
      "Scaling businesses making their first big hires",
      "Companies raising or refinancing",
      "Founders who need strategy, not just compliance",
    ],
  },
  {
    slug: "outsourcing",
    title: "Outsourcing",
    blurb:
      "Hand us the finance function — bookkeeping through to management accounts — and run lean. We become your back office.",
    overview:
      "Why build a finance team when you can rent a better one? We run all or part of your finance function as an extension of your business — bookkeeping, payroll, reporting, controls — at a fraction of the cost of hiring.",
    kind: "single",
    items: [],
    included: [
      "Full or partial finance-function outsourcing",
      "Bookkeeping and transaction processing",
      "Payroll and supplier payments",
      "Management accounts and reporting",
      "Credit control and cash collection",
      "Dedicated team with a named contact",
    ],
    bestFor: [
      "Businesses without an in-house finance team",
      "Companies cutting overhead",
      "Irish firms scaling fast",
    ],
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
      "Capital gains calculation across wallets and exchanges",
      "CGT reporting via ROS / Form CG1 (33%, €1,270 exemption)",
      "Income vs capital treatment — staking, mining, airdrops and DeFi",
      "CARF readiness ahead of 2026/27 exchange reporting",
      "Record reconstruction and portfolio reconciliation",
      "Preliminary tax and payment planning",
    ],
    bestFor: [
      "Investors and traders with multi-exchange activity",
      "Businesses accepting or holding digital assets",
      "Anyone facing CARF reporting or a Revenue query",
    ],
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
