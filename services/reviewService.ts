import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "@/firebase/client";
import { callableFunction } from "@/firebase/functions";
import type {
  ModerateReviewInput,
  ReportReviewInput,
  SubmitReviewInput,
  UpdateReviewInput,
} from "@/lib/schemas/review";
import type { ProductReview } from "@/types/review";

interface ReviewMutationResponse {
  readonly review: ProductReview;
}

interface DeleteReviewRequest {
  readonly reviewId: string;
}

interface HelpfulReviewRequest {
  readonly reviewId: string;
}

interface HelpfulReviewResponse {
  readonly helpful: boolean;
  readonly helpfulCount: number;
}

export interface ReviewPage {
  readonly reviews: readonly ProductReview[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

const submitReviewCallable = callableFunction<
  SubmitReviewInput,
  ReviewMutationResponse
>("submitVerifiedReview");

const updateReviewCallable = callableFunction<
  UpdateReviewInput,
  ReviewMutationResponse
>("updateVerifiedReview");

const reportReviewCallable = callableFunction<
  ReportReviewInput,
  { readonly success: true }
>("reportProductReview");

const moderateReviewCallable = callableFunction<
  ModerateReviewInput,
  ReviewMutationResponse
>("moderateProductReview");

const deleteReviewCallable = callableFunction<
  DeleteReviewRequest,
  { readonly success: true }
>("deleteProductReview");

const toggleHelpfulCallable = callableFunction<
  HelpfulReviewRequest,
  HelpfulReviewResponse
>("toggleReviewHelpful");

export async function submitReview(
  input: SubmitReviewInput
): Promise<ProductReview> {
  const result =
    await submitReviewCallable(input);

  return result.data.review;
}

export async function updateReview(
  input: UpdateReviewInput
): Promise<ProductReview> {
  const result =
    await updateReviewCallable(input);

  return result.data.review;
}

export async function reportReview(
  input: ReportReviewInput
): Promise<void> {
  await reportReviewCallable(input);
}

export async function moderateReview(
  input: ModerateReviewInput
): Promise<ProductReview> {
  const result =
    await moderateReviewCallable(input);

  return result.data.review;
}

export async function deleteReview(
  reviewId: string
): Promise<void> {
  await deleteReviewCallable({
    reviewId,
  });
}

export async function toggleReviewHelpful(
  reviewId: string
): Promise<HelpfulReviewResponse> {
  const result =
    await toggleHelpfulCallable({
      reviewId,
    });

  return result.data;
}

export async function getPublishedProductReviews(input: {
  readonly productId: string;
  readonly pageSize?: number;
  readonly cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<ReviewPage> {
  const pageSize = Math.min(
    Math.max(input.pageSize ?? 10, 1),
    50
  );

  const constraints = [
    where(
      "productId",
      "==",
      input.productId
    ),
    where(
      "status",
      "==",
      "published"
    ),
    orderBy("createdAt", "desc"),
    ...(input.cursor
      ? [startAfter(input.cursor)]
      : []),
    limit(pageSize + 1),
  ];

  const snapshot = await getDocs(
    query(
      collection(db, "reviews"),
      ...constraints
    )
  );

  const documents =
    snapshot.docs.slice(
      0,
      pageSize
    );

  return {
    reviews: documents.map(
      (document) =>
        ({
          id: document.id,
          ...document.data(),
        }) as ProductReview
    ),
    cursor:
      documents.at(-1) ?? null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}
