import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Coupon } from "@/types/coupon";

interface ValidateCouponRequest {
  readonly code: string;
  readonly cartId: string;

}

interface ValidateCouponResponse {
  readonly valid: boolean;
  readonly coupon?: Coupon;
  readonly discountAmountPaise: number;
  readonly message?: string;
}

const validateCouponCallable =
 callableFunction<
  ValidateCouponRequest,
  ValidateCouponResponse
 >("validateCoupon");

export async function validateCoupon(
  input: ValidateCouponRequest
): Promise<ValidateCouponResponse> {
  const result =
    await validateCouponCallable(input);

    return result.data;
}

export async function findActiveCouponByCode(
  code: string
): Promise<Coupon | null> {
  const normalizedCode =
   code.trim().toUpperCase();

    if (!normalizedCode) {
      return null;
    }

    const snapshot = await getDocs(
     query(
      collection(
        getFirebaseFirestore(),
        COLLECTIONS.COUPONS
      ),
      where(
        "code",
        "==",
        normalizedCode

       ),
       where("active", "==", true),
       limit(1)
   )
 );

 const couponDocument =
  snapshot.docs.at(0);

 return couponDocument
  ? ({
      id: couponDocument.id,
      ...couponDocument.data(),
    } as Coupon)
  : null;
}
