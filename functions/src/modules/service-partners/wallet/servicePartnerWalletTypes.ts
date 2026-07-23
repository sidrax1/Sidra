import type {
  Timestamp,
} from "firebase-admin/firestore";

export type ServicePartnerWalletStatus =
 | "active"
 | "restricted"
 | "suspended"
 | "closed";

export type ServicePartnerWalletEntryType =
 | "settlementCredit"
 | "assignmentCredit"
 | "bonusCredit"
 | "manualCredit"
 | "refundRecoveryDebit"
 | "disputeRecoveryDebit"
 | "penaltyDebit"
 | "platformFeeDebit"
 | "taxDeductionDebit"
 | "manualDebit"
 | "payoutDebit"
 | "payoutReversalCredit"
 | "holdPlaced"
 | "holdReleased"
 | "adjustment";

export type ServicePartnerWalletEntryDirection =
 | "credit"
 | "debit"
 | "neutral";

export type ServicePartnerWalletEntryStatus =
 | "pending"
 | "available"
 | "held"
 | "settled"
 | "reversed"
 | "cancelled";

export type ServicePartnerWalletReferenceType =
 | "assignment"
 | "settlement"
 | "payout"
 | "refund"
 | "dispute"
 | "adjustment"
 | "system";

export interface ServicePartnerWalletBalances {
  readonly availablePaise: number;
  readonly pendingPaise: number;
  readonly heldPaise: number;
  readonly lifetimeCreditsPaise: number;
  readonly lifetimeDebitsPaise: number;
  readonly lifetimePaidPaise: number;
}

export interface ServicePartnerWalletDocument {
 readonly partnerId: string;
 readonly partnerNumber: string;
 readonly applicantUserId: string;
 readonly currency: "INR";
 readonly status: ServicePartnerWalletStatus;
 readonly balances: ServicePartnerWalletBalances;
 readonly minimumPayoutPaise: number;
 readonly automaticPayoutEnabled: boolean;
 readonly lastEntryAt?: Timestamp;
 readonly lastPayoutAt?: Timestamp;
 readonly restrictedAt?: Timestamp;
 readonly restrictedBy?: string;
 readonly restrictionReason?: string;
 readonly suspendedAt?: Timestamp;
 readonly suspendedBy?: string;
 readonly suspensionReason?: string;
 readonly closedAt?: Timestamp;

    readonly closedBy?: string;
    readonly closureReason?: string;
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}

export interface ServicePartnerWalletEntryDocument {
  readonly walletId: string;
  readonly partnerId: string;
  readonly partnerNumber: string;
  readonly applicantUserId: string;
  readonly entryNumber: string;
  readonly entryType: ServicePartnerWalletEntryType;
  readonly direction: ServicePartnerWalletEntryDirection;
  readonly status: ServicePartnerWalletEntryStatus;
  readonly currency: "INR";
  readonly amountPaise: number;
  readonly balanceImpactPaise: number;
  readonly availableBalanceBeforePaise: number;
  readonly availableBalanceAfterPaise: number;
  readonly pendingBalanceBeforePaise: number;
  readonly pendingBalanceAfterPaise: number;
  readonly heldBalanceBeforePaise: number;
  readonly heldBalanceAfterPaise: number;
  readonly referenceType: ServicePartnerWalletReferenceType;
  readonly referenceId: string;
  readonly title: string;
  readonly description?: string;
  readonly idempotencyKey: string;
  readonly metadata: Readonly<
   Record<string, unknown>
  >;
  readonly availableAt?: Timestamp;
  readonly settledAt?: Timestamp;
  readonly reversedAt?: Timestamp;
  readonly cancelledAt?: Timestamp;
  readonly createdBy: string;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface ServicePartnerWalletHoldDocument {
 readonly walletId: string;
 readonly partnerId: string;

    readonly holdNumber: string;
    readonly referenceType:
     | "settlement"
     | "dispute"
     | "refund"
     | "investigation"
     | "manual";
    readonly referenceId: string;
    readonly amountPaise: number;
    readonly status:
     | "active"
     | "released"
     | "consumed"
     | "cancelled";
    readonly reason: string;
    readonly releaseNote?: string;
    readonly placedBy: string;
    readonly releasedBy?: string;
    readonly placedAt: Timestamp;
    readonly releasedAt?: Timestamp;
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}

export interface CreateServicePartnerWalletEntryInput {
  readonly partnerId: string;
  readonly entryType: ServicePartnerWalletEntryType;
  readonly direction: ServicePartnerWalletEntryDirection;
  readonly status: ServicePartnerWalletEntryStatus;
  readonly amountPaise: number;
  readonly referenceType: ServicePartnerWalletReferenceType;
  readonly referenceId: string;
  readonly title: string;
  readonly description?: string;
  readonly idempotencyKey: string;
  readonly availableAt?: string;
  readonly metadata?: Readonly<
   Record<string, unknown>
  >;
}

export interface PlaceServicePartnerWalletHoldInput {
 readonly partnerId: string;
 readonly referenceType:

     | "settlement"
     | "dispute"
     | "refund"
     | "investigation"
     | "manual";
    readonly referenceId: string;
    readonly amountPaise: number;
    readonly reason: string;
}

export interface ReleaseServicePartnerWalletHoldInput {
  readonly holdId: string;
  readonly releaseNote: string;
}

export interface UpdateServicePartnerWalletStatusInput {
  readonly partnerId: string;
  readonly status: ServicePartnerWalletStatus;
  readonly reason: string;
}

export interface SerializedServicePartnerWallet
  extends Omit<
   ServicePartnerWalletDocument,
   | "lastEntryAt"
   | "lastPayoutAt"
   | "restrictedAt"
   | "suspendedAt"
   | "closedAt"
   | "createdAt"
   | "updatedAt"
  >{
  readonly id: string;
  readonly lastEntryAt?: string;
  readonly lastPayoutAt?: string;
  readonly restrictedAt?: string;
  readonly suspendedAt?: string;
  readonly closedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface SerializedServicePartnerWalletEntry
 extends Omit<

  ServicePartnerWalletEntryDocument,
  | "availableAt"
  | "settledAt"
  | "reversedAt"
  | "cancelledAt"
  | "createdAt"
  | "updatedAt"
 >{
 readonly id: string;
 readonly availableAt?: string;
 readonly settledAt?: string;
 readonly reversedAt?: string;
 readonly cancelledAt?: string;
 readonly createdAt: string;
 readonly updatedAt: string;
}
