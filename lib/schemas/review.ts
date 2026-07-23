import { z } from "zod";

export const submitReviewSchema = z.object({
  productId: z.string().trim().min(1),
  orderId: z.string().trim().min(1),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5),
  title: z
    .string()
    .trim()
    .min(3)
    .max(100),
  review: z
    .string()
    .trim()
    .min(20)
    .max(2000),
  mediaPaths: z
    .array(z.string().trim().min(1))
    .max(8),
});

export const updateReviewSchema = z.object({
  reviewId: z.string().trim().min(1),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5),
  title: z
    .string()
    .trim()
    .min(3)
    .max(100),
  review: z
    .string()
    .trim()
    .min(20)
    .max(2000),
  mediaPaths: z
    .array(z.string().trim().min(1))
    .max(8),
});

export const reportReviewSchema = z.object({
  reviewId: z.string().trim().min(1),
  reason: z.enum([
    "spam",
    "abusive",
    "irrelevant",
    "personalInformation",
    "fraudulent",
    "other",
  ]),
  explanation: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export const moderateReviewSchema = z.object({
  reviewId: z.string().trim().min(1),
  decision: z.enum([
    "publish",
    "hide",
    "reject",
    "remove",
  ]),
  reason: z
    .string()
    .trim()
    .max(1500),
  notifyReviewer: z.boolean(),
});

export type SubmitReviewInput =
  z.infer<
    typeof submitReviewSchema
  >;

export type UpdateReviewInput =
  z.infer<
    typeof updateReviewSchema
  >;

export type ReportReviewInput =
  z.infer<
    typeof reportReviewSchema
  >;

export type ModerateReviewInput =
  z.infer<
    typeof moderateReviewSchema
  >;
