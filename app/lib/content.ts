export const site = {
  name: "CA Farm",
  url: "https://cafarm.co",
  email: "hello@cafarm.co",
  phone: "+44 (0)1234 567 890",
  phoneHref: "tel:+441234567890",
  address: ["12 Harvest Lane", "York, YO1 7AB"],
  hours: "Mon–Fri, 9:00–17:30",
};

export const industries = [
  {
    name: "Agriculture & rural",
    note: "Farms, estates and rural enterprise — averaging, BPS and diversification.",
  },
  {
    name: "Hospitality",
    note: "Cafés, restaurants and hotels — tronc, margins and seasonal cash flow.",
  },
  {
    name: "E-commerce",
    note: "Marketplace and DTC sellers — multi-channel VAT and inventory accounting.",
  },
  {
    name: "Construction & trades",
    note: "CIS returns, retentions and project profitability.",
  },
  {
    name: "Professional services",
    note: "Agencies and consultancies — WIP, utilisation and partner profit shares.",
  },
  {
    name: "Startups & SaaS",
    note: "R&D claims, EMI options and investor-ready reporting.",
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
      "Self-assessment tax return",
      "Quarterly bookkeeping review",
      "HMRC registration and correspondence",
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
      "Year-end accounts and CT600",
      "Director self-assessment included",
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
      "R&D relief claims included",
    ],
  },
];

export const pricingAddons = [
  { name: "Statutory audit", note: "Scoped and quoted separately" },
  { name: "Books cleanup / catch-up", note: "One-off, quoted after review" },
  { name: "Company formation", note: "£150 one-off" },
  { name: "R&D relief claim", note: "Included on Growth, else from £750" },
];

export const team = [
  { name: "Niaz Morshed", role: "Managing Partner", credential: "FCA" },
  { name: "Sarah Whitfield", role: "Audit Partner", credential: "ACA" },
  { name: "Tom Adeyemi", role: "Tax Director", credential: "CTA" },
  { name: "Emily Carter", role: "Practice Manager", credential: "AAT" },
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
      "Tax planning in February is too late. We work ahead of deadlines and bring you ideas before you ask.",
  },
  {
    title: "A short client list, on purpose",
    description:
      "Each partner caps their client list. You get someone who knows your business, not whoever picks up the phone.",
  },
];

/* ──────────────────────────────────────────────────────────────────────────
   Service taxonomy (UK & Ireland)
   Figures current for 2025/26 — UK and Ireland. Verify at point of advice.
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
      "Day-to-day finance and statutory compliance across the UK and Ireland — books, VAT, payroll, accounts and tax, handled.",
    overview:
      "The compliance backbone of your business, run properly. From live bookkeeping to year-end accounts and tax filings, we keep you current and on the right side of HMRC and Revenue — with numbers you can actually use to make decisions.",
    kind: "services",
    items: [
      {
        slug: "taxation",
        title: "Taxation",
        blurb:
          "Corporation tax, VAT, income tax and reliefs — planned ahead, filed on time, never more than you owe, in the UK and Ireland.",
        overview:
          "Good tax work happens before the year ends, not after. UK corporation tax now runs at 19% on profits up to £50,000 and 25% above £250,000, with marginal relief (an effective ~26.5%) on the slice between — and those limits are shared across associated companies. Ireland holds its 12.5% trading rate, with a 15% effective minimum (QDTT) only for groups turning over more than €750m. We plan reliefs and timing around all of it, file on schedule with HMRC and Revenue, and put your positions in writing.",
        included: [
          "Corporation tax returns — CT600 (UK) and CT1 via ROS (Ireland)",
          "Marginal relief and associated-company planning (UK)",
          "R&D tax relief — UK merged scheme (20% credit) and Ireland (30%, rising to 35% from January 2026)",
          "Capital allowances and full-expensing reviews",
          "Self-assessment and income tax for directors and owners",
          "HMRC and Revenue enquiry handling",
        ],
        bestFor: [
          "Owner-managed companies trading in the UK or Ireland",
          "Businesses with R&D, capital spend or innovation grants",
          "Groups managing associated-company or Pillar Two exposure",
        ],
      },
      {
        slug: "vat-returns",
        title: "VAT Returns",
        blurb:
          "Accurate VAT registration and returns on both sides of the Irish Sea — MTD-compliant in the UK, ROS-filed in Ireland.",
        overview:
          "VAT is where small mistakes get expensive fast. The UK registration threshold is £90,000 and all returns must be filed under Making Tax Digital; Ireland registers at €85,000 for goods and €42,500 for services, files bi-monthly through ROS, and adds an annual Return of Trading Details. We handle registration, scheme selection and every return — and reconcile each one to your books before it goes in.",
        included: [
          "VAT registration in the UK (£90k) and/or Ireland (€85k goods, €42.5k services)",
          "Making Tax Digital (MTD) compliant filing in the UK",
          "Bi-monthly Irish returns and annual Return of Trading Details (RTD)",
          "VIES and Intrastat for cross-border and post-Brexit trade",
          "Scheme advice — flat rate, cash accounting, margin, OSS/IOSS",
          "Reconciliation of every return to your ledger before submission",
        ],
        bestFor: [
          "Businesses trading across the UK and Ireland",
          "E-commerce and cross-border sellers",
          "Anyone near or over either registration threshold",
        ],
      },
      {
        slug: "annual-accounts",
        title: "Annual Accounts",
        blurb:
          "Year-end statutory accounts under FRS 102 / FRS 105, filed with Companies House or the CRO — done early, not at the deadline.",
        overview:
          "Year-end accounts should tell you something, not just satisfy a filing. We prepare statutory accounts under FRS 102 (or FRS 105 for micro-entities), agree them with you in plain English, and submit on time — UK private company accounts are due nine months after year-end at Companies House; Irish accounts go to the CRO with the annual return (Form B1), tagged in iXBRL. With the 2025 threshold uplift, many more companies (turnover up to £15m, balance sheet up to £7.5m, 50 staff) now qualify as small and skip audit.",
        included: [
          "Statutory accounts under FRS 102 / FRS 105",
          "Filing with Companies House (UK) and the CRO via Form B1 (Ireland)",
          "iXBRL tagging for Revenue and CRO requirements",
          "Directors' report and confirmation statement / annual return",
          "Corporation tax computation prepared alongside",
          "Small-company and audit-exemption assessment (2025 thresholds)",
        ],
        bestFor: [
          "Limited companies in the UK or Ireland",
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
          "Books that are three months behind are books you cannot run a business on. We keep yours current on Xero or QuickBooks — bank feeds live, receipts captured, queries chased — and close each month with accounts in plain English. It also gets you ready for Making Tax Digital for Income Tax, which lands for sole traders and landlords earning over £50,000 from April 2026 (£30,000 from 2027, £20,000 from 2028).",
        included: [
          "Full bookkeeping on Xero or QuickBooks",
          "Bank feeds, receipt capture and reconciliation",
          "Monthly close with management accounts",
          "Making Tax Digital–ready digital records",
          "Debtor and creditor reporting",
          "Migration from spreadsheets or legacy software, with team training",
        ],
        bestFor: [
          "Founders doing their own books at midnight",
          "Sole traders and landlords preparing for MTD for Income Tax",
          "Businesses that want monthly numbers, not annual",
        ],
      },
      {
        slug: "payroll",
        title: "Payroll & Pensions",
        blurb:
          "Accurate payslips, real-time submissions and auto-enrolment handled — your team paid right in the UK and Ireland, every cycle.",
        overview:
          "Payroll is unforgiving: one late submission or a missed pension upload and you are writing to regulators. We run the whole cycle — payslips, RTI (UK) and PAYE Modernisation (Ireland) submissions, pensions and year-end forms. We also keep you ahead of cost changes: UK employer National Insurance is now 15% on earnings above a £5,000 secondary threshold (with Employment Allowance up to £10,500), while Irish employee PRSI rose to 4.2% from October 2025.",
        included: [
          "Weekly or monthly payroll runs",
          "RTI submissions to HMRC and PAYE Modernisation to Revenue",
          "Employer NIC (15% over £5k) and Employment Allowance optimisation (UK)",
          "PRSI, USC and PAYE handled (Ireland)",
          "Auto-enrolment and occupational pension administration",
          "P45s, P60s, P11Ds and Irish equivalents, posted to your books",
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
          "An audit should do more than satisfy a legal requirement. From financial years beginning on or after 6 April 2025, the UK small-company thresholds rose to £15m turnover, £7.5m balance sheet and 50 employees — so the first question we answer is whether you even need one. When you do, ours are planned around your risks, run under ISA (UK and Ireland) with minimal disruption, and end with a management letter you will actually act on.",
        included: [
          "Statutory audits under ISA (UK and Ireland)",
          "Audit-exemption and group-size assessment (2025 thresholds)",
          "Voluntary audits for lenders or investors",
          "Internal audit and controls review",
          "Grant and charity (SORP) audits",
          "Due-diligence support on acquisitions",
        ],
        bestFor: [
          "Companies above the revised audit threshold",
          "Businesses raising debt or equity",
          "Boards that want assurance, not theatre",
        ],
      },
    ],
  },
  {
    slug: "business-consulting",
    title: "Business Consulting",
    blurb:
      "Set up, fund and grow your business in the UK and Ireland — from incorporation to international expansion.",
    overview:
      "Practical advice from people who know your numbers. Whether you are forming a company, raising finance or expanding into a new market, we help you make the call with the figures in front of you.",
    kind: "services",
    items: [
      {
        slug: "company-setup",
        title: "Company Setup & Secretarial",
        blurb:
          "Incorporation, registrations and statutory filings to get you trading fast and keep Companies House and the CRO happy.",
        overview:
          "Starting a company involves a dozen small registrations that are easy to get wrong and tedious to fix. We incorporate at Companies House (UK) or the CRO (Ireland), register you for the right taxes, and keep the statutory book maintained — including the UK confirmation statement and the Irish annual return (Form B1), which falls due within six months of incorporation and every year after.",
        included: [
          "Company incorporation at Companies House or the CRO",
          "PAYE, VAT and corporation tax registration",
          "Confirmation statements (UK) and annual returns / Form B1 (Ireland)",
          "Statutory registers, including persons of significant control",
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
          "Cross-border setup and tax structuring for businesses moving between the UK, Ireland and beyond.",
        overview:
          "Expanding into a new country multiplies your obligations. The UK–Ireland corridor is the most common move we handle — and post-Brexit it means import VAT, customs and the Northern Ireland Protocol on goods, plus permanent-establishment and transfer-pricing questions. Large groups also need to watch the 15% global minimum tax (Pillar Two). We map the landscape before you commit, then set up the structure and keep it compliant on both sides.",
        included: [
          "UK–Ireland cross-border structuring",
          "Entity setup in new jurisdictions",
          "Permanent establishment and transfer-pricing review",
          "Post-Brexit VAT, customs and Northern Ireland Protocol guidance",
          "Withholding tax and double-tax treaty planning",
          "Pillar Two / global minimum tax assessment for large groups",
        ],
        bestFor: [
          "UK firms expanding into Ireland (and vice versa)",
          "Businesses going cross-border post-Brexit",
          "Groups rationalising their structure",
        ],
      },
    ],
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation",
    blurb:
      "Modernise the finance function — cloud systems, ERP migration and AI built into the way you actually work.",
    overview:
      "Technology should take work off your plate, not add to it. We modernise finance operations end to end — migrating systems, automating the manual, and embedding AI where it earns its place. With Making Tax Digital widening and e-invoicing spreading across Europe, digital records are fast becoming the baseline, not the upgrade.",
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
          "An ERP migration done badly can set you back a year. We scope the move, map and clean the data, run the migration in parallel, and stay on through go-live so the numbers reconcile from day one — with MTD-ready digital record-keeping built in.",
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
      "Tax and financial planning built around your profession — keep more of what you earn, in the UK and Ireland.",
    overview:
      "Your tax position depends on how you earn. We tailor planning to your profession — the reliefs, structures and pitfalls specific to your work — so you keep more of it and sleep better at year-end.",
    kind: "personas",
    items: [
      {
        slug: "doctors",
        title: "Doctors & Medical Professionals",
        blurb:
          "Pensions annual allowance, private practice income and locum structuring for medics in the UK and Ireland.",
        overview:
          "Medical careers create tax problems other professions never see — the pensions annual allowance (£60,000, tapered for high earners) and its interaction with the NHS scheme, mixed NHS/HSE and private income, and locum work. We handle the specifics so a good year doesn't turn into a tax-bill shock.",
        included: [
          "Pensions annual allowance and taper planning (£60k limit)",
          "NHS / HSE pension interaction and annual allowance charges",
          "Private practice and locum income",
          "Sole trader vs limited company structuring",
          "Self-assessment and income tax",
          "Expense, capital allowance and retirement planning",
        ],
        bestFor: [
          "Consultants with NHS/HSE and private income",
          "Locum doctors",
          "Medics hit by pension tax charges",
        ],
      },
      {
        slug: "it-professionals",
        title: "IT Workers & Professionals",
        blurb:
          "Contractor structuring, IR35 and share-option taxation for tech workers and contractors.",
        overview:
          "Tech pay comes in forms HMRC and Revenue treat very differently — contract income, RSUs, share options. We structure it properly, navigate IR35, and plan around capital gains (now 18% / 24% in the UK after the October 2024 change) so equity doesn't catch you out.",
        included: [
          "Limited company and contractor structuring",
          "IR35 status review (UK)",
          "RSU and share-option tax planning",
          "Capital gains planning on share disposals (18% / 24% UK)",
          "Self-assessment, income tax and home-office claims",
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
          "End-to-end tax and bookkeeping for self-employed contractors — CIS, expenses and the right trading structure.",
        overview:
          "When you work for yourself, the admin is on you too. We take it off your plate — bookkeeping, expenses, returns — and get you ready for Making Tax Digital for Income Tax, which starts for sole traders earning over £50,000 from April 2026. Construction contractors also get full CIS handling and offset.",
        included: [
          "Sole trader vs limited company advice",
          "CIS returns, deductions and offsetting (construction)",
          "Making Tax Digital for Income Tax readiness (from April 2026)",
          "Bookkeeping and expense tracking",
          "Self-assessment / income tax returns",
          "VAT registration and returns",
        ],
        bestFor: [
          "Self-employed trades and freelancers",
          "Construction contractors under CIS",
          "Anyone going limited for the first time",
        ],
      },
      {
        slug: "entrepreneurs",
        title: "Entrepreneurs & Founders",
        blurb:
          "Personal tax strategy for founders — remuneration, share schemes, reliefs and the path to exit.",
        overview:
          "Building a business and your personal wealth are the same project. We plan remuneration, equity and reliefs across both — salary vs dividends, share schemes, and the exit reliefs that matter. UK Business Asset Disposal Relief now charges 18% on qualifying gains up to a £1m lifetime limit, while Irish Entrepreneur Relief stays at 10% up to €1m — so timing and structure are worth real money.",
        included: [
          "Salary, dividend and remuneration planning",
          "EMI (UK) and KEEP (Ireland) share schemes",
          "Business Asset Disposal Relief (18%, £1m) and Irish Entrepreneur Relief (10%, €1m)",
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
      "AI-powered finance, automation and tax services — practical applications, not hype.",
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
          "Tax is full of patterns AI is good at finding. We use it to scan for reliefs you're missing, model the tax impact of decisions, and speed up compliance across UK and Irish regimes — always with a chartered accountant signing off the output.",
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
      "A senior finance leader on your terms — forecasting, board-level strategy and funding support, without the full-time cost.",
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
      "Your finance function, run by us — from bookkeeping to management accounts, scaled to what you need.",
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
      "UK and Ireland firms scaling fast",
    ],
  },
  {
    slug: "crypto",
    title: "Crypto & Digital Assets",
    blurb:
      "Tax, accounting and reporting for crypto and digital assets across the UK and Ireland — ahead of the 2026 reporting rules.",
    overview:
      "Crypto tax is complex, fast-moving and easy to get wrong — and the days of it going unnoticed are over. HMRC treats cryptoassets as property subject to Capital Gains Tax (18% or 24% in 2025/26, on gains above the £3,000 annual exemption), and Ireland charges its standard 33% CGT above a €1,270 exemption. Under the OECD Crypto-Asset Reporting Framework (CARF), exchanges begin collecting data in 2026 and reporting it to tax authorities from 2027 — so accurate records are no longer optional. We calculate, report and plan it properly.",
    kind: "single",
    items: [],
    included: [
      "Capital gains calculation across wallets and exchanges",
      "UK CGT reporting via self-assessment (18% / 24%, £3,000 exemption)",
      "Irish CGT reporting via ROS / Form CG1 (33%, €1,270 exemption)",
      "Income vs capital treatment — staking, mining, airdrops and DeFi",
      "CARF readiness ahead of 2026/27 exchange reporting",
      "Record reconstruction and portfolio reconciliation",
    ],
    bestFor: [
      "Investors and traders with multi-exchange activity",
      "Businesses accepting or holding digital assets",
      "Anyone facing CARF reporting or an HMRC / Revenue nudge letter",
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
