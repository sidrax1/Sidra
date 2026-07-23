import {
onSchedule,
} from
"firebase-functions/v2/scheduler";

import {
logger,
} from
"firebase-functions";

import {
servicePartnerWalletHealthCheck,
} from
"./servicePartnerWalletHealthCheck";

import {
firestore,
} from
"../servicePartnerRepository";

export const
servicePartnerWalletMaintenance=

onSchedule(

{

schedule:"every day 03:00",

timeZone:"Asia/Kolkata",

region:"asia-south1",

},

async()=>{

const wallets=

await firestore

.collection(

"servicePartnerWallets"

)

.get();

let checked=0;

let unhealthy=0;

for(const doc of wallets.docs){

const report=

await servicePartnerWalletHealthCheck(

doc.id

);

checked++;

if(!report.healthy){

unhealthy++;

logger.warn(

"Wallet issue",

report

);

}

}

logger.info(

"Wallet maintenance completed",

{

checked,

unhealthy,

}

);

}

);
