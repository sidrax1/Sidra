export interface WalletMetrics {

      totalCreditsPaise:number;

      totalDebitsPaise:number;

      totalPendingPaise:number;

      totalHeldPaise:number;

      totalPaidPaise:number;

      totalAvailablePaise:number;

      totalPayouts:number;

      successfulPayouts:number;

      failedPayouts:number;

      retryCount:number;

      reconciliationCount:number;
}

export function emptyWalletMetrics():WalletMetrics{

      return{

        totalCreditsPaise:0,

        totalDebitsPaise:0,

        totalPendingPaise:0,

        totalHeldPaise:0,

           totalPaidPaise:0,

           totalAvailablePaise:0,

           totalPayouts:0,

           successfulPayouts:0,

           failedPayouts:0,

           retryCount:0,

           reconciliationCount:0,

      };

}
