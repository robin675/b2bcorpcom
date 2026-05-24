export const CONFIG_KEYS = {
  AdminAllowedEmails: "admin_allowed_emails",
  DiscoveryKeywords: "discovery_keywords",
  DiscoverySettings: "discovery_settings",
} as const;

export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];

export type DiscoverySettings = {
  max_results_per_query: number;
  search_engine: "naver";
};

export type CandidateStatus = "pending" | "scored" | "seeded" | "rejected";
