import type {
  Timestamp,
} from "firebase-admin/firestore";

export type ServicePartnerSettlementStatus =
  | "draft"
  | "calculated"
  | "underReview"
  | "approved"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "onHold";

export type ServicePartnerSettlementCycle =
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "manual";

export type ServicePartnerSettlementLineType =
  | "assignmentEarning"
  | "bonus"
  | "adjustment"
  | "refundRecovery"
  | "disputeRecovery"
  | "platformFee"
  | "taxDeduction"
  | "penalty"
  | "manualCredit"
  | "manualDebit";

export type ServicePartnerSettlementPaymentMethod =
  | "bankTransfer"
  | "upi"
  | "manualBankTransfer";

export interface ServicePartnerSettlementLine {
  readonly id: string;
  readonly type: ServicePartnerSettlementLineType;
  readonly referenceType:
    | "assignment"
    | "dispute"
    | "refund"
    | "adjustment"
    | "system";
  readonly referenceId: string;
  readonly title: string;
  readonly description?: string;
  readonly grossAmountPaise: number;
  readonly deductionAmountPaise: number;
  readonly netAmountPaise: number;
  readonly taxable: boolean;
  readonly taxRatePercentage?: number;
  readonly metadata: Readonly<
    Record<string, unknown>
  >;
  readonly createdAt: Timestamp;
}

export interface ServicePartnerSettlementBankSnapshot {
  readonly accountHolderName: string;
  readonly bankName: string;
  readonly accountNumberLastFour: string;
  readonly ifscCode: string;
  readonly accountType:
    | "savings"
    | "current";
  readonly verified: boolean;
  readonly verifiedAt?: Timestamp;
}

export interface ServicePartnerSettlementTotals {
  readonly assignmentEarningsPaise: number;
  readonly bonusPaise: number;
  readonly manualCreditsPaise: number;
  readonly platformFeePaise: number;
  readonly taxDeductionPaise: number;
  readonly penaltiesPaise: number;
  readonly recoveriesPaise: number;
  readonly manualDebitsPaise: number;
  readonly grossAmountPaise: number;
  readonly totalDeductionsPaise: number;
  readonly netPayablePaise: number;
}

export interface ServicePartnerSettlementDocument {
  readonly settlementNumber: string;
  readonly partnerId: string;
  readonly partnerNumber: string;
  readonly partnerName: string;
  readonly applicantUserId: string;
  readonly cycle: ServicePartnerSettlementCycle;
  readonly periodStart: Timestamp;
  readonly periodEnd: Timestamp;
  readonly status: ServicePartnerSettlementStatus;
  readonly currency: "INR";
  readonly totals: ServicePartnerSettlementTotals;
  readonly lineCount: number;
  readonly assignmentIds: readonly string[];
  readonly bankSnapshot?: ServicePartnerSettlementBankSnapshot;
  readonly paymentMethod?: ServicePartnerSettlementPaymentMethod;
  readonly paymentReference?: string;
  readonly paymentProvider?: string;
  readonly paymentFailureReason?: string;
  readonly reviewNote?: string;
  readonly approvedNote?: string;
  readonly holdReason?: string;
  readonly cancelledReason?: string;
  readonly calculatedBy: string;
  readonly calculatedAt: Timestamp;
  readonly reviewedBy?: string;
  readonly reviewedAt?: Timestamp;
  readonly approvedBy?: string;
  readonly approvedAt?: Timestamp;
  readonly processingStartedAt?: Timestamp;
  readonly paidAt?: Timestamp;
  readonly failedAt?: Timestamp;
  readonly cancelledAt?: Timestamp;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface ServicePartnerSettlementProfileDocument {
  readonly partnerId: string;
  readonly settlementCycle: ServicePartnerSettlementCycle;
  readonly commissionPercentage: number;
  readonly platformFeePercentage: number;
  readonly taxDeductionPercentage: number;
  readonly settlementHoldDays: number;
  readonly minimumSettlementPaise: number;
  readonly automaticSettlementEnabled: boolean;
  readonly bankAccount?: ServicePartnerSettlementBankSnapshot;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface ServicePartnerSettlementAdjustmentDocument {
  readonly partnerId: string;
  readonly type:
    | "credit"
    | "debit";
  readonly category:
    | "bonus"
    | "penalty"
    | "refundRecovery"
    | "disputeRecovery"
    | "manual";
  readonly title: string;
  readonly description: string;
  readonly amountPaise: number;
  readonly taxable: boolean;
  readonly status:
    | "pending"
    | "consumed"
    | "cancelled";
  readonly settlementId?: string;
  readonly createdBy: string;
  readonly consumedAt?: Timestamp;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface CalculateServicePartnerSettlementInput {
  readonly partnerId: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly cycle: ServicePartnerSettlementCycle;
  readonly includePendingAdjustments?: boolean;
}

export interface CreateServicePartnerSettlementInput
  extends CalculateServicePartnerSettlementInput {
  readonly reviewNote?: string;
}

export interface ReviewServicePartnerSettlementInput {
  readonly settlementId: string;
  readonly decision:
    | "approve"
    | "hold"
    | "cancel";
  readonly note: string;
}

export interface MarkServicePartnerSettlementPaidInput {
  readonly settlementId: string;
  readonly paymentMethod: ServicePartnerSettlementPaymentMethod;
  readonly paymentReference: string;
  readonly paymentProvider?: string;
  readonly paidAt?: string;
}

export interface MarkServicePartnerSettlementFailedInput {
  readonly settlementId: string;
  readonly failureReason: string;
}

export interface SerializedServicePartnerSettlementLine
  extends Omit<
    ServicePartnerSettlementLine,
    "createdAt"
  > {
  readonly createdAt: string;
}

export interface SerializedServicePartnerSettlement
  extends Omit<
    ServicePartnerSettlementDocument,
    | "periodStart"
    | "periodEnd"
    | "calculatedAt"
    | "reviewedAt"
    | "approvedAt"
    | "processingStartedAt"
    | "paidAt"
    | "failedAt"
    | "cancelledAt"
    | "createdAt"
    | "updatedAt"
    | "bankSnapshot"
  > {
  readonly id: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly calculatedAt: string;
  readonly reviewedAt?: string;
  readonly approvedAt?: string;
  readonly processingStartedAt?: string;
  readonly paidAt?: string;
  readonly failedAt?: string;
  readonly cancelledAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly bankSnapshot?: Omit<
    ServicePartnerSettlementBankSnapshot,
    "verifiedAt"
  > & {
    readonly verifiedAt?: string;
  };
}
