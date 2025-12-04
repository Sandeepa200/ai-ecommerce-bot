export type PolicyKey = "returns" | "shipping" | "privacy" | "terms" | "faq";

type PolicyEntry = { title: string; content: string };

const entries: Record<PolicyKey, PolicyEntry> = {
  returns: {
    title: "Returns & Exchanges",
    content:
      "Eligibility: Items can be returned within 30 days of delivery in original condition and packaging.\nProcess: Initiate a return from the Returns page, print the label, and drop off at the listed carrier.\nRefunds: Issued to original payment method within 5–7 business days after inspection.\nExceptions: Final sale items, used products, and damaged goods are not eligible.\nExchanges: One free size/color exchange within 30 days if stock is available.",
  },
  shipping: {
    title: "Shipping Information",
    content:
      "Methods: Standard (3–5 business days) and Express (1–2 business days).\nRates: Calculated at checkout based on weight and destination.\nTracking: Email confirmation includes tracking link; track orders via the Orders page.\nDelays: Weather or carrier issues may affect delivery times; we will notify you of significant delays.",
  },
  privacy: {
    title: "Privacy Policy",
    content:
      "Data: We collect basic account, order, and browsing information to operate the store.\nUse: Data is used for order fulfillment, support, and product improvements.\nSecurity: We apply industry-standard safeguards; avoid sharing sensitive data via chat.\nRights: You may request data export or deletion via support.",
  },
  terms: {
    title: "Terms of Service",
    content:
      "Agreement: By using the site you agree to the posted terms.\nOrders: We may refuse or cancel orders at our discretion; refunds provided where applicable.\nLiability: Provided as-is to the maximum extent permitted by law.\nChanges: Policies may be updated periodically; check the site for the latest version.",
  },
  faq: {
    title: "Frequently Asked Questions",
    content:
      "How do I track my order? Use your email on the Orders > Track page.\nWhat is the return window? 30 days from delivery.\nDo you offer international shipping? Not at this time.\nHow can I contact support? Use chat or the Contact page.",
  },
};

export const Policies = {
  get(key: PolicyKey): PolicyEntry {
    return entries[key];
  },
  all(): Record<PolicyKey, PolicyEntry> {
    return entries;
  },
};

