import {
 FieldValue,

  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  createAuditLog,
  firestore,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";

import {
  assertNonNegativeWalletBalances,
  assertWalletEntryIdempotency,
  ensureServicePartnerWallet,
  nextWalletEntryNumber,
  serializeServicePartnerWalletEntry,
  servicePartnerWalletEntryReference,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";

import {
  validateCreateWalletEntryInput,
} from "./servicePartnerWalletValidation";

import type {
  ServicePartnerDocument,
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
} from "./servicePartnerWalletTypes";

export const createServicePartnerWalletEntry =
onCall(
{
region:"asia-south1",
enforceAppCheck:true,
cors:true,
timeoutSeconds:120,
memory:"512MiB",
},
async(request)=>{

const actor =
requireAuthenticatedActor(request);

requirePermission(
actor,
"servicePartners.manageWallets"
);

const input =
validateCreateWalletEntryInput(
request.data
);

const partnerSnapshot =
await firestore
.collection("servicePartners")
.doc(input.partnerId)
.get();

if(!partnerSnapshot.exists){
throw new HttpsError(
"not-found",
"Partner not found."
);
}

const partner =
partnerSnapshot.data() as ServicePartnerDocument;

const entryRef =
servicePartnerWalletEntryReference(
firestore.collection("_").doc().id
);

const walletRef =
servicePartnerWalletReference(
input.partnerId
);

const entry =
await firestore.runTransaction(
async(transaction)=>{

await assertWalletEntryIdempotency(
transaction,
input.idempotencyKey
);

const wallet =
await ensureServicePartnerWallet(
transaction,
{
partnerId:partner.id,
partnerNumber:partner.partnerNumber,
applicantUserId:partner.applicantUserId,
}
);

const walletSnapshot =
await transaction.get(walletRef);

const current =
walletSnapshot.data() as ServicePartnerWalletDocument;

const balances={
...current.balances,
};

if(input.direction==="credit"){

if(input.status==="available"){
balances.availablePaise+=
input.amountPaise;
}else{
balances.pendingPaise+=
input.amountPaise;
}

balances.lifetimeCreditsPaise+=
input.amountPaise;

}else if(input.direction==="debit"){

balances.availablePaise-=
input.amountPaise;

balances.lifetimeDebitsPaise+=

input.amountPaise;
}

assertNonNegativeWalletBalances(
balances
);

const now =
Timestamp.now();

const document:
ServicePartnerWalletEntryDocument={

walletId:walletRef.id,

partnerId:partner.id,

partnerNumber:
partner.partnerNumber,

applicantUserId:
partner.applicantUserId,

entryNumber:
await nextWalletEntryNumber(
transaction
),

entryType:
input.entryType,

direction:
input.direction,

status:
input.status,

currency:"INR",

amountPaise:
input.amountPaise,

balanceImpactPaise:
input.direction==="credit"

?input.amountPaise
:-input.amountPaise,

availableBalanceBeforePaise:
current.balances.availablePaise,

availableBalanceAfterPaise:
balances.availablePaise,

pendingBalanceBeforePaise:
current.balances.pendingPaise,

pendingBalanceAfterPaise:
balances.pendingPaise,

heldBalanceBeforePaise:
current.balances.heldPaise,

heldBalanceAfterPaise:
balances.heldPaise,

referenceType:
input.referenceType,

referenceId:
input.referenceId,

title:
input.title,

description:
input.description,

idempotencyKey:
input.idempotencyKey,

metadata:
input.metadata ?? {},

availableAt:
input.availableAt
?Timestamp.fromDate(
new Date(
input.availableAt

))
:undefined,

createdBy:
actor.uid,

createdAt:now,

updatedAt:now,

};

transaction.create(
entryRef,
document
);

transaction.update(
walletRef,
{
balances,
lastEntryAt:now,
updatedAt:now,
}
);

await createAuditLog(
{
actor,
action:
"servicePartnerWallet.entryCreated",
entityType:"partner",
entityId:partner.id,
metadata:{
entryId:entryRef.id,
entryType:
input.entryType,
amountPaise:
input.amountPaise,
},
},
transaction
);

return document;

}
);

return{

entry:
serializeServicePartnerWalletEntry(
entryRef.id,
entry
),

};

});
