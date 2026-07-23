import { firestore } from "../servicePartnerRepository";

import type { ServicePartnerWalletDocument } from "./servicePartnerWalletTypes";

export interface WalletHealthReport {
  walletId: string;
  healthy: boolean;
  issues: string[];
}

export async function servicePartnerWalletHealthCheck(
  partnerId: string
): Promise<WalletHealthReport> {
  const snapshot = await firestore
    .collection("servicePartnerWallets")
    .doc(partnerId)
    .get();

  if (!snapshot.exists) {
    return {
      walletId: partnerId,
      healthy: false,
      issues: ["Wallet not found"],
    };
  }

  const wallet = snapshot.data() as ServicePartnerWalletDocument;

  const issues: string[] = [];

  if (wallet.balances.availablePaise < 0) {
    issues.push("Negative available balance");
  }

  if (wallet.balances.pendingPaise < 0) {
    issues.push("Negative pending balance");
  }

  if (wallet.balances.heldPaise < 0) {
    issues.push("Negative held balance");
  }

  return {
    walletId: partnerId,
    healthy: issues.length === 0,
    issues,
  };
}
