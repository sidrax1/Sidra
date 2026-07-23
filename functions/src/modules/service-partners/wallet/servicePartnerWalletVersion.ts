export const CURRENT_SERVICE_PARTNER_WALLET_SCHEMA_VERSION = 1;

export const SERVICE_PARTNER_WALLET_MIGRATIONS = {
  1: {
    version: 1,
    description:
      "Initial production wallet schema with payout engine, reconciliation, holds, analytics and statement export.",
  },
};

export function latestWalletSchemaVersion() {
  return CURRENT_SERVICE_PARTNER_WALLET_SCHEMA_VERSION;
}
