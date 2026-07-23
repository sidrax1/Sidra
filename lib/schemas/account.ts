import { z } from "zod";

const optionalTrimmedString = (
  maximumLength: number
) =>
  z
    .string()
    .trim()
    .max(maximumLength)
    .optional()
    .transform((value) =>
      value && value.length > 0
        ? value
        : undefined
    );

export const accountProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2)
    .max(100),
  firstName:
    optionalTrimmedString(50),
  lastName:
    optionalTrimmedString(50),
  phone: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Enter a valid Indian mobile number."
    )
    .optional()
    .or(z.literal(""))
    .transform((value) =>
      value || undefined
    ),
  photoURL: z
    .string()
    .url()
    .nullable()
    .optional(),
});

export const accountNotificationPreferencesSchema =
  z.object({
    orderUpdates: z.boolean(),
    customOrderUpdates: z.boolean(),
    studioUpdates: z.boolean(),
    reviewUpdates: z.boolean(),
    supportUpdates: z.boolean(),
    marketingEmail: z.boolean(),
    transactionalEmail:
      z.literal(true),
    inAppNotifications:
      z.boolean(),
  });

export const changePasswordSchema =
  z
    .object({
      currentPassword: z
        .string()
        .min(1),
      newPassword: z
        .string()
        .min(12)
        .max(128)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/)
        .regex(
          /[^A-Za-z0-9]/
        ),
      confirmPassword: z
        .string()
        .min(1),
    })
    .superRefine(
      (value, context) => {
        if (
          value.newPassword !==
          value.confirmPassword
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "confirmPassword",
            ],
            message:
              "Passwords do not match.",
          });
        }

        if (
          value.currentPassword ===
          value.newPassword
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode
                .custom,
            path: [
              "newPassword",
            ],
            message:
              "Choose a different password.",
          });
        }
      }
    );

export type AccountProfileInput =
  z.infer<
    typeof accountProfileSchema
  >;

export type AccountNotificationPreferencesInput =
  z.infer<
    typeof accountNotificationPreferencesSchema
  >;

export type ChangePasswordInput =
  z.infer<
    typeof changePasswordSchema
  >;
