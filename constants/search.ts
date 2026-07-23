/**
 * SIDRA Search Configuration
 */

export const SEARCH = {
 MIN_QUERY_LENGTH: 2,

 MAX_QUERY_LENGTH: 100,

 DEFAULT_LIMIT: 24,

 MAX_LIMIT: 100,

 RECENT_SEARCH_LIMIT: 10,

 SUGGESTION_LIMIT: 8,

 TRENDING_LIMIT: 12,

 DEBOUNCE_MS: 300,

  PLACEHOLDER:
    "Search verified studios, products and collections..."
} as const;
