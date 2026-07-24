"use client";

import {
  Building2,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import {
  useMemo,
} from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Alert,
} from "@/components/ui/Alert";
import {
  Button,
} from "@/components/ui/Button";
import {
  FileDropzone,
} from "@/components/ui/FileDropzone";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Input,
} from "@/components/ui/Input";
import {
  Select,
} from "@/components/ui/Select";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  Textarea,
} from "@/components/ui/Textarea";
import {
  createServicePartnerApplicationSchema,
  type CreateServicePartnerApplicationInput,
} from "@/lib/schemas/service-partner";
import type { z } from "zod";
import type {
  ServicePartnerCapability,
} from "@/types/service-partner";

type ServicePartnerApplicationFormInput = z.input<
  typeof createServicePartnerApplicationSchema
>;

interface ServicePartnerApplicationFormProps {
  readonly documentPaths?: readonly string[];
  readonly stateOptions?: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (
    input: CreateServicePartnerApplicationInput
  ) => void | Promise<void>;
}

const partnerTypeOptions = [
  {
    value: "repairStudio",
    label: "Repair Studio",
  },
  {
    value: "inspectionCentre",
    label: "Inspection Centre",
  },
  {
    value: "logisticsPartner",
    label: "Logistics Partner",
  },
  {
    value: "installationPartner",
    label: "Installation Partner",
  },
  {
    value: "restorationSpecialist",
    label: "Restoration Specialist",
  },
  {
    value: "qualityAssuranceCentre",
    label: "Quality Assurance Centre",
  },
  {
    value: "multiServicePartner",
    label: "Multi-service Partner",
  },
] as const;

const capabilityOptions: readonly {
  readonly value: ServicePartnerCapability;
  readonly label: string;
  readonly description: string;
}[] = [
  {
    value: "productInspection",
    label: "Product Inspection",
    description:
      "Physical condition, authenticity and defect assessment.",
  },
  {
    value: "resinRepair",
    label: "Resin Repair",
    description:
      "Repair cracks, chips, bubbles and resin-product damage.",
  },
  {
    value: "surfaceRestoration",
    label: "Surface Restoration",
    description:
      "Polishing, refinishing and surface clarity restoration.",
  },
  {
    value: "structuralRepair",
    label: "Structural Repair",
    description:
      "Repair structural failure and reinforce damaged products.",
  },
  {
    value: "hardwareReplacement",
    label: "Hardware Replacement",
    description:
      "Replace hooks, fittings, stands, fasteners and accessories.",
  },
  {
    value: "electricalRepair",
    label: "Electrical Repair",
    description:
      "Repair lights, wiring and electronic resin-product elements.",
  },
  {
    value: "customisationCorrection",
    label: "Customisation Correction",
    description:
      "Correct names, images, text and customised design defects.",
  },
  {
    value: "pickup",
    label: "Pickup",
    description:
      "Collect customer products for service or inspection.",
  },
  {
    value: "reverseLogistics",
    label: "Reverse Logistics",
    description:
      "Manage return movement and reverse delivery operations.",
  },
  {
    value: "replacementDelivery",
    label: "Replacement Delivery",
    description:
      "Deliver replacement products securely to customers.",
  },
  {
    value: "onSiteService",
    label: "On-site Service",
    description:
      "Provide customer-location inspection or repair.",
  },
  {
    value: "remoteAssessment",
    label: "Remote Assessment",
    description:
      "Assess product issues through photographs or video calls.",
  },
  {
    value: "qualityCertification",
    label: "Quality Certification",
    description:
      "Provide verified post-service quality confirmation.",
  },
  {
    value: "securePackaging",
    label: "Secure Packaging",
    description:
      "Prepare premium protective packaging for product transport.",
  },
];

export function ServicePartnerApplicationForm({
  documentPaths = [],
  loading = false,
  onFilesSelected,
  onSubmit,
  stateOptions = [],
}: ServicePartnerApplicationFormProps): React.JSX.Element {
  const {
    control,
    formState: {
      errors,
      isValid,
    },
    handleSubmit,
    register,
    watch,
  } =
    useForm<ServicePartnerApplicationFormInput, unknown, CreateServicePartnerApplicationInput>(
      {
        resolver:
          zodResolver(
            createServicePartnerApplicationSchema
          ),
        mode: "onChange",
        defaultValues: {
          legalName: "",
          displayName: "",
          partnerType:
            "repairStudio",
          description: "",
          contact: {
            contactName: "",
            designation: "",
            email: "",
            phoneNumber: "",
            alternatePhoneNumber:
              "",
            websiteURL: "",
          },
          registeredAddress: {
            fullName: "",
            phoneNumber: "",
            addressLine1: "",
            addressLine2: "",
            landmark: "",
            city: "",
            district: "",
            state: "",
            postalCode: "",
            countryCode: "IN",
          },
          capabilities: [],
          coverageStates: [],
          documentPaths: [
            ...documentPaths,
          ],
        },
      }
    );

  const description =
    watch("description");

  const selectedCapabilities =
    watch("capabilities");

  const selectedStates =
    watch("coverageStates");

  const stateSelectionOptions =
    useMemo(
      () =>
        stateOptions.length > 0
          ? stateOptions
          : [
              {
                value:
                  "Karnataka",
                label:
                  "Karnataka",
              },
              {
                value:
                  "Maharashtra",
                label:
                  "Maharashtra",
              },
              {
                value:
                  "Telangana",
                label:
                  "Telangana",
              },
              {
                value:
                  "Andhra Pradesh",
                label:
                  "Andhra Pradesh",
              },
              {
                value:
                  "Tamil Nadu",
                label:
                  "Tamil Nadu",
              },
              {
                value:
                  "Kerala",
                label:
                  "Kerala",
              },
              {
                value:
                  "Delhi",
                label:
                  "Delhi",
              },
              {
                value:
                  "Gujarat",
                label:
                  "Gujarat",
              },
              {
                value:
                  "Rajasthan",
                label:
                  "Rajasthan",
              },
              {
                value:
                  "Uttar Pradesh",
                label:
                  "Uttar Pradesh",
              },
            ],
      [stateOptions]
    );

  return (
    <Surface
      className="grid gap-8"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Building2
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Sidra Service Network
          </p>

          <h1 className="mt-2 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
            Become a Service Partner
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            Join Sidra’s verified repair, inspection, logistics and
            restoration network. Every application is reviewed for
            service quality, legal verification and operational
            capability.
          </p>
        </div>
      </header>

      <Alert
        variant="warning"
        title="Verification documents are mandatory"
        description="Business identity, address, banking and service-capability documents are reviewed before activation."
        icon={
          <ShieldCheck
            aria-hidden={true}
            className="size-5"
          />
        }
      />

      <form
        noValidate
        className="grid gap-8"
        onSubmit={handleSubmit(
          async (input) => {
            await onSubmit({
              ...input,
              documentPaths: [
                ...documentPaths,
              ],
            });
          }
        )}
      >
        <section className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-background p-6">
          <div className="flex items-center gap-3">
            <Building2
              aria-hidden={true}
              className="size-5 text-[var(--color-gold-600)]"
            />

            <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              Business Information
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Legal Business Name"
              labelFor="service-partner-legal-name"
              required
              error={
                errors.legalName
                  ?.message
              }
            >
              <Input
                id="service-partner-legal-name"
                disabled={loading}
                placeholder="Registered business or proprietor name"
                {...register(
                  "legalName"
                )}
              />
            </FormField>

            <FormField
              label="Display Name"
              labelFor="service-partner-display-name"
              required
              error={
                errors.displayName
                  ?.message
              }
            >
              <Input
                id="service-partner-display-name"
                disabled={loading}
                placeholder="Customer-facing service brand"
                {...register(
                  "displayName"
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Partner Type"
            labelFor="service-partner-type"
            required
            error={
              errors.partnerType
                ?.message
            }
          >
            <Select
              id="service-partner-type"
              options={
                partnerTypeOptions
              }
              disabled={loading}
              {...register(
                "partnerType"
              )}
            />
          </FormField>

          <FormField
            label="Business Description"
            labelFor="service-partner-description"
            required
            error={
              errors.description
                ?.message
            }
            description={`${description.length}/5000 characters`}
          >
            <Textarea
              id="service-partner-description"
              rows={10}
              minLength={50}
              maxLength={5000}
              disabled={loading}
              placeholder="Describe your experience, team, equipment, specialisation, facilities, service standards and operational capacity."
              {...register(
                "description"
              )}
            />
          </FormField>
        </section>

        <section className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Wrench
              aria-hidden={true}
              className="size-5 text-[var(--color-gold-600)]"
            />

            <div>
              <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                Service Capabilities
              </h2>

              <p className="mt-1 text-sm text-muted">
                Select every service your business can reliably
                deliver.
              </p>
            </div>
          </div>

          <Controller
            control={control}
            name="capabilities"
            render={({
              field,
              fieldState,
            }) => (
              <div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {capabilityOptions.map(
                    (option) => {
                      const selected =
                        field.value.includes(
                          option.value
                        );

                      return (
                        <label
                          key={
                            option.value
                          }
                          className={[
                            "cursor-pointer rounded-[var(--radius-lg)] border p-5 transition-[border-color,background-color,box-shadow]",
                            selected
                              ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.08)] shadow-[var(--shadow-gold-glow)]"
                              : "border-border bg-background hover:border-[color:rgb(200_169_106_/_0.4)]",
                          ].join(
                            " "
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={
                                selected
                              }
                              disabled={
                                loading
                              }
                              onChange={(
                                event
                              ) => {
                                field.onChange(
                                  event
                                    .target
                                    .checked
                                    ? [
                                        ...field.value,
                                        option.value,
                                      ]
                                    : field.value.filter(
                                        (
                                          capability
                                        ) =>
                                          capability !==
                                          option.value
                                      )
                                );
                              }}
                              className="mt-1 size-4 accent-[var(--color-gold-500)]"
                            />

                            <span>
                              <span className="block text-sm font-medium text-foreground">
                                {
                                  option.label
                                }
                              </span>

                              <span className="mt-1 block text-xs leading-5 text-muted">
                                {
                                  option.description
                                }
                              </span>
                            </span>
                          </div>
                        </label>
                      );
                    }
                  )}
                </div>

                {fieldState.error ? (
                  <p className="mt-3 text-sm text-[var(--color-error)]">
                    {
                      fieldState.error
                        .message
                    }
                  </p>
                ) : null}
              </div>
            )}
          />

          <p className="text-xs text-muted">
            {
              selectedCapabilities.length
            }{" "}
            capability
            {selectedCapabilities.length ===
            1
              ? ""
              : "ies"}{" "}
            selected
          </p>
        </section>

        <section className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-background p-6">
          <div className="flex items-center gap-3">
            <MapPin
              aria-hidden={true}
              className="size-5 text-[var(--color-gold-600)]"
            />

            <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              Registered Address
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Contact Person"
              labelFor="service-partner-address-name"
              required
              error={
                errors.registeredAddress
                  ?.fullName
                  ?.message
              }
            >
              <Input
                id="service-partner-address-name"
                disabled={loading}
                {...register(
                  "registeredAddress.fullName"
                )}
              />
            </FormField>

            <FormField
              label="Address Phone"
              labelFor="service-partner-address-phone"
              required
              error={
                errors.registeredAddress
                  ?.phoneNumber
                  ?.message
              }
            >
              <Input
                id="service-partner-address-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                disabled={loading}
                {...register(
                  "registeredAddress.phoneNumber",
                  {
                    setValueAs: (
                      value: string
                    ) =>
                      value.replace(
                        /\D/g,
                        ""
                      ),
                  }
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Address Line 1"
            labelFor="service-partner-address-1"
            required
            error={
              errors.registeredAddress
                ?.addressLine1
                ?.message
            }
          >
            <Input
              id="service-partner-address-1"
              disabled={loading}
              {...register(
                "registeredAddress.addressLine1"
              )}
            />
          </FormField>

          <FormField
            label="Address Line 2"
            labelFor="service-partner-address-2"
            optional
            error={
              errors.registeredAddress
                ?.addressLine2
                ?.message
            }
          >
            <Input
              id="service-partner-address-2"
              disabled={loading}
              {...register(
                "registeredAddress.addressLine2"
              )}
            />
          </FormField>

          <FormField
            label="Landmark"
            labelFor="service-partner-landmark"
            optional
            error={
              errors.registeredAddress
                ?.landmark
                ?.message
            }
          >
            <Input
              id="service-partner-landmark"
              disabled={loading}
              {...register(
                "registeredAddress.landmark"
              )}
            />
          </FormField>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <FormField
              label="City"
              labelFor="service-partner-city"
              required
              error={
                errors.registeredAddress
                  ?.city?.message
              }
            >
              <Input
                id="service-partner-city"
                disabled={loading}
                {...register(
                  "registeredAddress.city"
                )}
              />
            </FormField>

            <FormField
              label="District"
              labelFor="service-partner-district"
              optional
              error={
                errors.registeredAddress
                  ?.district
                  ?.message
              }
            >
              <Input
                id="service-partner-district"
                disabled={loading}
                {...register(
                  "registeredAddress.district"
                )}
              />
            </FormField>

            <FormField
              label="State"
              labelFor="service-partner-state"
              required
              error={
                errors.registeredAddress
                  ?.state?.message
              }
            >
              <Input
                id="service-partner-state"
                disabled={loading}
                {...register(
                  "registeredAddress.state"
                )}
              />
            </FormField>

            <FormField
              label="Postal Code"
              labelFor="service-partner-postal-code"
              required
              error={
                errors.registeredAddress
                  ?.postalCode
                  ?.message
              }
            >
              <Input
                id="service-partner-postal-code"
                inputMode="numeric"
                maxLength={6}
                disabled={loading}
                {...register(
                  "registeredAddress.postalCode",
                  {
                    setValueAs: (
                      value: string
                    ) =>
                      value.replace(
                        /\D/g,
                        ""
                      ),
                  }
                )}
              />
            </FormField>
          </div>
        </section>

        <section className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-card p-6">
          <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Primary Contact
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Contact Name"
              labelFor="service-partner-contact-name"
              required
              error={
                errors.contact
                  ?.contactName
                  ?.message
              }
            >
              <Input
                id="service-partner-contact-name"
                disabled={loading}
                {...register(
                  "contact.contactName"
                )}
              />
            </FormField>

            <FormField
              label="Designation"
              labelFor="service-partner-designation"
              optional
              error={
                errors.contact
                  ?.designation
                  ?.message
              }
            >
              <Input
                id="service-partner-designation"
                disabled={loading}
                {...register(
                  "contact.designation"
                )}
              />
            </FormField>

            <FormField
              label="Email"
              labelFor="service-partner-email"
              required
              error={
                errors.contact?.email
                  ?.message
              }
            >
              <Input
                id="service-partner-email"
                type="email"
                disabled={loading}
                {...register(
                  "contact.email"
                )}
              />
            </FormField>

            <FormField
              label="Phone Number"
              labelFor="service-partner-phone"
              required
              error={
                errors.contact
                  ?.phoneNumber
                  ?.message
              }
            >
              <Input
                id="service-partner-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                disabled={loading}
                {...register(
                  "contact.phoneNumber",
                  {
                    setValueAs: (
                      value: string
                    ) =>
                      value.replace(
                        /\D/g,
                        ""
                      ),
                  }
                )}
              />
            </FormField>

            <FormField
              label="Alternate Phone"
              labelFor="service-partner-alternate-phone"
              optional
              error={
                errors.contact
                  ?.alternatePhoneNumber
                  ?.message
              }
            >
              <Input
                id="service-partner-alternate-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                disabled={loading}
                {...register(
                  "contact.alternatePhoneNumber",
                  {
                    setValueAs: (
                      value: string
                    ) => {
                      const normalized =
                        value.replace(
                          /\D/g,
                          ""
                        );

                      return normalized ||
                        undefined;
                    },
                  }
                )}
              />
            </FormField>

            <FormField
              label="Website"
              labelFor="service-partner-website"
              optional
              error={
                errors.contact
                  ?.websiteURL
                  ?.message
              }
            >
              <Input
                id="service-partner-website"
                type="url"
                disabled={loading}
                placeholder="https://example.com"
                {...register(
                  "contact.websiteURL",
                  {
                    setValueAs: (
                      value: string
                    ) =>
                      value.trim() ||
                      undefined,
                  }
                )}
              />
            </FormField>
          </div>
        </section>

        <section className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-background p-6">
          <div className="flex items-center gap-3">
            <MapPin
              aria-hidden={true}
              className="size-5 text-[var(--color-gold-600)]"
            />

            <div>
              <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                Coverage States
              </h2>

              <p className="mt-1 text-sm text-muted">
                Select states where your team can reliably accept
                assignments.
              </p>
            </div>
          </div>

          <Controller
            control={control}
            name="coverageStates"
            render={({
              field,
              fieldState,
            }) => (
              <div>
                <div className="flex flex-wrap gap-3">
                  {stateSelectionOptions.map(
                    (option) => {
                      const selected =
                        field.value.includes(
                          option.value
                        );

                      return (
                        <label
                          key={
                            option.value
                          }
                          className={[
                            "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-[border-color,background-color,box-shadow]",
                            selected
                              ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.08)] shadow-[var(--shadow-gold-glow)]"
                              : "border-border bg-card hover:border-[color:rgb(200_169_106_/_0.4)]",
                          ].join(
                            " "
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={
                              selected
                            }
                            disabled={
                              loading
                            }
                            onChange={(
                              event
                            ) =>
                              field.onChange(
                                event
                                  .target
                                  .checked
                                  ? [
                                      ...field.value,
                                      option.value,
                                    ]
                                  : field.value.filter(
                                      (
                                        state
                                      ) =>
                                        state !==
                                        option.value
                                    )
                              )
                            }
                            className="size-4 accent-[var(--color-gold-500)]"
                          />

                          {
                            option.label
                          }
                        </label>
                      );
                    }
                  )}
                </div>

                {fieldState.error ? (
                  <p className="mt-3 text-sm text-[var(--color-error)]">
                    {
                      fieldState.error
                        .message
                    }
                  </p>
                ) : null}
              </div>
            )}
          />

          <p className="text-xs text-muted">
            {
              selectedStates.length
            }{" "}
            state
            {selectedStates.length ===
            1
              ? ""
              : "s"}{" "}
            selected
          </p>
        </section>

        <section className="grid gap-6 rounded-[var(--radius-xl)] border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <FileCheck2
              aria-hidden={true}
              className="size-5 text-[var(--color-gold-600)]"
            />

            <div>
              <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                Verification Documents
              </h2>

              <p className="mt-1 text-sm text-muted">
                Upload business registration, tax, address, banking
                and service-quality documents.
              </p>
            </div>
          </div>

          <FileDropzone
            accept={[
              "image/jpeg",
              "image/png",
              "image/webp",
              "application/pdf",
            ]}
            maximumSizeBytes={
              15 * 1024 * 1024
            }
            multiple
            disabled={
              loading ||
              !onFilesSelected
            }
            label="Business Verification Files"
            description="Upload clear PDF or image files. Each file must be no larger than 15 MB."
            onFilesSelected={(
              files
            ) =>
              onFilesSelected?.(
                files
              )
            }
          />

          <p className="text-xs text-muted">
            {
              documentPaths.length
            }{" "}
            document
            {documentPaths.length ===
            1
              ? ""
              : "s"}{" "}
            uploaded
          </p>
        </section>

        <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-6 text-muted">
            By submitting this application, you confirm that all
            business, service, identity and coverage information is
            accurate and may be independently verified by Sidra.
          </p>

          <Button
            type="submit"
            disabled={
              !isValid ||
              documentPaths.length ===
                0
            }
            loading={loading}
            loadingLabel="Submitting Application"
            className="shrink-0"
          >
            <ShieldCheck
              aria-hidden={true}
              className="size-4"
            />
            Submit Application
          </Button>
        </div>
      </form>
    </Surface>
  );
}
