export const site = {
  name: "CA Farm",
  url: "https://cafarm.co",
  email: "hello@cafarm.co",
  phone: "+44 (0)1234 567 890",
  phoneHref: "tel:+441234567890",
  address: ["12 Harvest Lane", "York, YO1 7AB"],
  hours: "Mon–Fri, 9:00–17:30",
};

export interface Service {
  slug: string;
  title: string;
  blurb: string;
  overview: string;
  included: string[];
  bestFor: string[];
}

export const services: Service[] = [
  {
    slug: "audit-assurance",
    title: "Audit & Assurance",
    blurb:
      "Statutory and voluntary audits that stand up to scrutiny — and give lenders, boards and buyers confidence in your numbers.",
    overview:
      "An audit should do more than satisfy a legal requirement. Ours are planned around your risks, run with minimal disruption to your team, and end with a management letter you will actually act on — not a PDF that goes in a drawer.",
    included: [
      "Statutory audits under ISA (UK)",
      "Voluntary audits for lenders or investors",
      "Internal audit and controls review",
      "Grant and charity (SORP) audits",
      "Due-diligence support on acquisitions",
      "Clear management letter with practical fixes",
    ],
    bestFor: [
      "Companies past the audit threshold",
      "Businesses raising debt or equity",
      "Boards that want assurance, not theatre",
    ],
  },
  {
    slug: "tax",
    title: "Tax Planning & Compliance",
    blurb:
      "Corporation tax, VAT, self-assessment and R&D relief. Planned ahead, filed on time, never more than you owe.",
    overview:
      "Good tax work happens before the year ends, not after. We plan reliefs and timing in advance, file everything on schedule, and put your claims in writing so there are no surprises if HMRC asks questions.",
    included: [
      "Corporation tax returns (CT600)",
      "VAT registration and quarterly returns",
      "Self-assessment for directors and owners",
      "R&D tax relief claims",
      "Capital allowances reviews",
      "HMRC enquiry handling and correspondence",
    ],
    bestFor: [
      "Owner-managed limited companies",
      "Businesses with R&D or capital spend",
      "Anyone who has had a filing surprise before",
    ],
  },
  {
    slug: "bookkeeping",
    title: "Bookkeeping & Cloud Accounting",
    blurb:
      "Clean, current books on Xero or QuickBooks, with monthly management accounts you can actually read.",
    overview:
      "Books that are three months behind are books you cannot run a business on. We keep yours current on Xero or QuickBooks — bank feeds live, receipts captured, queries chased — and close each month with accounts in plain English.",
    included: [
      "Full bookkeeping on Xero or QuickBooks",
      "Bank feeds, receipt capture and reconciliation",
      "Monthly close with management accounts",
      "Debtor and creditor reporting",
      "Migration from spreadsheets or legacy software",
      "Team training on your cloud stack",
    ],
    bestFor: [
      "Founders doing their own books at midnight",
      "Teams switching from spreadsheets",
      "Businesses that want monthly numbers, not annual",
    ],
  },
  {
    slug: "payroll",
    title: "Payroll & Pensions",
    blurb:
      "Accurate payslips, RTI submissions and auto-enrolment handled — your team paid right, every cycle.",
    overview:
      "Payroll is unforgiving: one late RTI submission or a missed pension upload and you are writing to regulators. We run the whole cycle — payslips, submissions, pensions, P60s — so payday is a non-event.",
    included: [
      "Weekly or monthly payroll runs",
      "RTI submissions to HMRC",
      "Auto-enrolment pension administration",
      "P45s, P60s and P11Ds",
      "Statutory pay (sick, maternity, paternity)",
      "Payroll journals posted to your books",
    ],
    bestFor: [
      "Companies hiring their first employees",
      "Teams of 1 to 100 on the payroll",
      "Directors taking salary and dividends",
    ],
  },
  {
    slug: "advisory",
    title: "Advisory & Virtual CFO",
    blurb:
      "Forecasting, cash-flow planning and board-level advice from people who already know your numbers.",
    overview:
      "Most businesses do not need a full-time finance director — they need a few hours of one, armed with current numbers. We build the forecast, sit in the board meeting, and tell you what the numbers mean for the decision in front of you.",
    included: [
      "Cash-flow and P&L forecasting",
      "Quarterly or monthly virtual-CFO sessions",
      "Budgets, KPIs and board packs",
      "Funding and loan application support",
      "Business valuations",
      "Exit and succession planning",
    ],
    bestFor: [
      "Founders making their first big hires",
      "Businesses raising or refinancing",
      "Family firms planning succession",
    ],
  },
  {
    slug: "company-formation",
    title: "Company Formation & Secretarial",
    blurb:
      "Incorporation, registrations and statutory filings to get you trading fast and keep Companies House happy.",
    overview:
      "Starting a company involves a dozen small registrations that are easy to get wrong and tedious to fix. We incorporate, register you for the right taxes, and keep the statutory book maintained from day one.",
    included: [
      "Company incorporation at Companies House",
      "PAYE, VAT and corporation tax registration",
      "Confirmation statements and statutory registers",
      "Share issues and transfers",
      "Registered office address service",
      "Dividend paperwork and board minutes",
    ],
    bestFor: [
      "First-time founders",
      "Sole traders incorporating",
      "Groups adding subsidiaries",
    ],
  },
];

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
