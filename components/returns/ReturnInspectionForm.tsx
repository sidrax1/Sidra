"use client";

import {
  ClipboardCheck,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { FormField } from "@/components/ui/FormField";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Price } from "@/components/ui/Price";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type {
  ReturnInspectionInput,
} from "@/lib/schemas/return";
import type {
  ReturnInspectionFinding,
  ReturnRequest,
} from "@/types/return";

interface EditableFinding {
  readonly id: string;
  readonly label: string;
  readonly passed: boolean;
  readonly note: string;
}

interface ReturnInspectionFormProps {
  readonly returnRequest: ReturnRequest;
  readonly evidencePaths?: readonly string[];
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (
    input: ReturnInspectionInput
  ) => void | Promise<void>;
}

function createFinding(
  index: number
): EditableFinding {
  return {
    id: `finding-${Date.now()}-${index}`,
    label: "",
    passed: true,
    note: "",
  };
}

export function ReturnInspectionForm({
  evidencePaths = [],
  loading = false,
  onFilesSelected,
  onSubmit,
  returnRequest,
}: ReturnInspectionFormProps): React.JSX.Element {
  const maximumQuantity =
    returnRequest.item
      .returnQuantity;

  const [
    acceptedQuantity,
    setAcceptedQuantity,
  ] = useState(
    maximumQuantity
  );

  const [
    rejectedQuantity,
    setRejectedQuantity,
  ] = useState(0);

  const [
    conditionScore,
    setConditionScore,
  ] = useState(100);

  const [
    shippingRefundPaise,
    setShippingRefundPaise,
  ] = useState(
    returnRequest
      .financialSummary
      .shippingRefundPaise
  );

  const [
    taxRefundPaise,
    setTaxRefundPaise,
  ] = useState(
    returnRequest
      .financialSummary
      .taxRefundPaise
  );

  const [
    restockingFeePaise,
    setRestockingFeePaise,
  ] = useState(0);

  const [
    deductionPaise,
    setDeductionPaise,
  ] = useState(0);

  const [
    internalNote,
    setInternalNote,
  ] = useState("");

  const [
    customerNote,
    setCustomerNote,
  ] = useState("");

  const [
    findings,
    setFindings,
  ] = useState<
    readonly EditableFinding[]
  >([
    {
      id: "condition",
      label:
        "Product condition matches the submitted return claim",
      passed: true,
      note: "",
    },
    {
      id: "accessories",
      label:
        "All included parts and accessories were returned",
      passed: true,
      note: "",
    },
    {
      id: "packaging",
      label:
        "Product packaging is complete and acceptable",
      passed: true,
      note: "",
    },
  ]);

  const finalRefundPaise =
    useMemo(() => {
      const acceptedItemValue =
        maximumQuantity > 0
          ? Math.round(
              (returnRequest
                .financialSummary
                .itemValuePaise /
                maximumQuantity) *
                acceptedQuantity
            )
          : 0;

      return Math.max(
        acceptedItemValue +
          shippingRefundPaise +
          taxRefundPaise -
          restockingFeePaise -
          deductionPaise,
        0
      );
    }, [
      acceptedQuantity,
      deductionPaise,
      maximumQuantity,
      restockingFeePaise,
      returnRequest
        .financialSummary
        .itemValuePaise,
      shippingRefundPaise,
      taxRefundPaise,
    ]);

  function updateFinding(
    findingId: string,
    updater: (
      current: EditableFinding
    ) => EditableFinding
  ): void {
    setFindings((current) =>
      current.map((finding) =>
        finding.id ===
        findingId
          ? updater(finding)
          : finding
      )
    );
  }

  function updateAcceptedQuantity(
    value: number
  ): void {
    const normalized = Math.min(
      Math.max(
        Number.isFinite(value)
          ? value
          : 0,
        0
      ),
      maximumQuantity
    );

    setAcceptedQuantity(
      normalized
    );

    setRejectedQuantity(
      maximumQuantity -
        normalized
    );
  }

  function updateRejectedQuantity(
    value: number
  ): void {
    const normalized = Math.min(
      Math.max(
        Number.isFinite(value)
          ? value
          : 0,
        0
      ),
      maximumQuantity
    );

    setRejectedQuantity(
      normalized
    );

    setAcceptedQuantity(
      maximumQuantity -
        normalized
    );
  }

  const valid =
    acceptedQuantity +
      rejectedQuantity ===
      maximumQuantity &&
    findings.length > 0 &&
    findings.every(
      (finding) =>
        finding.label.trim()
          .length >= 2
    ) &&
    conditionScore >= 0 &&
    conditionScore <= 100 &&
    shippingRefundPaise >=
      0 &&
    taxRefundPaise >= 0 &&
    restockingFeePaise >=
      0 &&
    deductionPaise >= 0;

  return (
    <Surface
      className="grid gap-7"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <ClipboardCheck
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Controlled Inspection
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Complete Return Inspection
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Record item condition, accepted quantities, financial
            deductions and inspection evidence.
          </p>
        </div>
      </header>

      <Alert
        variant="warning"
        title="Inspection results affect customer refunds"
        description="All accepted and rejected quantities must reconcile with the returned quantity before submission."
        icon={
          <ShieldCheck
            aria-hidden={true}
            className="size-5"
          />
        }
      />

      <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">
          Return #
          {
            returnRequest.returnNumber
          }
        </p>

        <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          {
            returnRequest.item
              .productTitle
          }
        </h3>

        <p className="mt-2 text-sm text-muted">
          Returned quantity:{" "}
          {
            maximumQuantity
          }
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <FormField
          label="Accepted Quantity"
          labelFor="inspection-accepted-quantity"
          required
        >
          <Input
            id="inspection-accepted-quantity"
            type="number"
            min={0}
            max={maximumQuantity}
            step={1}
            value={
              acceptedQuantity
            }
            disabled={loading}
            onChange={(event) =>
              updateAcceptedQuantity(
                Number(
                  event.target.value
                )
              )
            }
          />
        </FormField>

        <FormField
          label="Rejected Quantity"
          labelFor="inspection-rejected-quantity"
          required
        >
          <Input
            id="inspection-rejected-quantity"
            type="number"
            min={0}
            max={maximumQuantity}
            step={1}
            value={
              rejectedQuantity
            }
            disabled={loading}
            onChange={(event) =>
              updateRejectedQuantity(
                Number(
                  event.target.value
                )
              )
            }
          />
        </FormField>

        <FormField
          label="Condition Score"
          labelFor="inspection-condition-score"
          required
          description="0 to 100"
        >
          <Input
            id="inspection-condition-score"
            type="number"
            min={0}
            max={100}
            step={1}
            value={
              conditionScore
            }
            disabled={loading}
            onChange={(event) =>
              setConditionScore(
                Number(
                  event.target.value
                )
              )
            }
          />
        </FormField>
      </div>

      <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-600)]">
              Inspection Checklist
            </p>

            <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              Condition Findings
            </h3>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              loading ||
              findings.length >= 30
            }
            onClick={() =>
              setFindings(
                (current) => [
                  ...current,
                  createFinding(
                    current.length
                  ),
                ]
              )
            }
          >
            <Plus
              aria-hidden={true}
              className="size-4"
            />
            Add Finding
          </Button>
        </div>

        <div className="grid gap-4">
          {findings.map(
            (
              finding,
              index
            ) => (
              <article
                key={finding.id}
                className="grid gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4"
              >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_auto] md:items-end">
                  <FormField
                    label={`Finding ${index + 1}`}
                    labelFor={`inspection-finding-${finding.id}`}
                    required
                  >
                    <Input
                      id={`inspection-finding-${finding.id}`}
                      value={
                        finding.label
                      }
                      disabled={
                        loading
                      }
                      maxLength={200}
                      onChange={(
                        event
                      ) =>
                        updateFinding(
                          finding.id,
                          (
                            current
                          ) => ({
                            ...current,
                            label:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    />
                  </FormField>

                  <label className="flex h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card px-4 text-sm">
                    <input
                      type="checkbox"
                      checked={
                        finding.passed
                      }
                      disabled={
                        loading
                      }
                      onChange={(
                        event
                      ) =>
                        updateFinding(
                          finding.id,
                          (
                            current
                          ) => ({
                            ...current,
                            passed:
                              event
                                .target
                                .checked,
                          })
                        )
                      }
                      className="size-4 accent-[var(--color-gold-500)]"
                    />
                    Passed
                  </label>

                  <IconButton
                    label={`Remove finding ${index + 1}`}
                    icon={
                      <Trash2
                        aria-hidden={true}
                      />
                    }
                    appearance="ghost"
                    disabled={
                      loading ||
                      findings.length <=
                        1
                    }
                    className="text-[var(--color-error)]"
                    onClick={() =>
                      setFindings(
                        (
                          current
                        ) =>
                          current.filter(
                            (
                              item
                            ) =>
                              item.id !==
                              finding.id
                          )
                      )
                    }
                  />
                </div>

                <FormField
                  label="Finding Note"
                  labelFor={`inspection-finding-note-${finding.id}`}
                  optional
                >
                  <Textarea
                    id={`inspection-finding-note-${finding.id}`}
                    value={
                      finding.note
                    }
                    rows={3}
                    maxLength={1000}
                    disabled={
                      loading
                    }
                    onChange={(
                      event
                    ) =>
                      updateFinding(
                        finding.id,
                        (
                          current
                        ) => ({
                          ...current,
                          note:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />
                </FormField>
              </article>
            )
          )}
        </div>
      </section>

      <section className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-background p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-600)]">
            Financial Outcome
          </p>

          <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Refund Calculation
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <FormField
            label="Shipping Refund (Paise)"
            labelFor="inspection-shipping-refund"
            required
          >
            <Input
              id="inspection-shipping-refund"
              type="number"
              min={0}
              step={1}
              value={
                shippingRefundPaise
              }
              disabled={loading}
              onChange={(event) =>
                setShippingRefundPaise(
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </FormField>

          <FormField
            label="Tax Refund (Paise)"
            labelFor="inspection-tax-refund"
            required
          >
            <Input
              id="inspection-tax-refund"
              type="number"
              min={0}
              step={1}
              value={
                taxRefundPaise
              }
              disabled={loading}
              onChange={(event) =>
                setTaxRefundPaise(
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </FormField>

          <FormField
            label="Restocking Fee (Paise)"
            labelFor="inspection-restocking-fee"
            required
          >
            <Input
              id="inspection-restocking-fee"
              type="number"
              min={0}
              step={1}
              value={
                restockingFeePaise
              }
              disabled={loading}
              onChange={(event) =>
                setRestockingFeePaise(
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </FormField>

          <FormField
            label="Other Deduction (Paise)"
            labelFor="inspection-deduction"
            required
          >
            <Input
              id="inspection-deduction"
              type="number"
              min={0}
              step={1}
              value={
                deductionPaise
              }
              disabled={loading}
              onChange={(event) =>
                setDeductionPaise(
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </FormField>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)] p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            Estimated Final Refund
          </p>

          <Price
            amount={
              finalRefundPaise /
              100
            }
            size="xl"
            className="mt-2"
          />
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Customer Note"
          labelFor="inspection-customer-note"
          optional
          description={`${customerNote.length}/2500 characters`}
        >
          <Textarea
            id="inspection-customer-note"
            value={customerNote}
            rows={7}
            maxLength={2500}
            disabled={loading}
            onChange={(event) =>
              setCustomerNote(
                event.target.value
              )
            }
          />
        </FormField>

        <FormField
          label="Internal Note"
          labelFor="inspection-internal-note"
          optional
          description={`${internalNote.length}/2500 characters`}
        >
          <Textarea
            id="inspection-internal-note"
            value={internalNote}
            rows={7}
            maxLength={2500}
            disabled={loading}
            onChange={(event) =>
              setInternalNote(
                event.target.value
              )
            }
          />
        </FormField>
      </div>

      <FileDropzone
        accept={[
          "image/jpeg",
          "image/png",
          "image/webp",
          "video/mp4",
          "application/pdf",
        ]}
        maximumSizeBytes={
          20 * 1024 * 1024
        }
        multiple
        disabled={
          loading ||
          !onFilesSelected
        }
        label="Inspection Evidence"
        description="Upload received-product photographs, packaging evidence and inspection documents."
        onFilesSelected={(files) =>
          onFilesSelected?.(files)
        }
      />

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Saving Inspection"
          onClick={() => {
            const normalizedFindings: readonly ReturnInspectionFinding[] =
              findings.map(
                (finding) => ({
                  id: finding.id,
                  label:
                    finding.label.trim(),
                  passed:
                    finding.passed,
                  note:
                    finding.note.trim() ||
                    undefined,
                })
              );

            void onSubmit({
              returnId:
                returnRequest.id,
              acceptedQuantity,
              rejectedQuantity,
              conditionScore,
              findings: [
                ...normalizedFindings,
              ],
              internalNote:
                internalNote.trim() ||
                undefined,
              customerNote:
                customerNote.trim() ||
                undefined,
              evidencePaths: [
                ...evidencePaths,
              ],
              shippingRefundPaise,
              taxRefundPaise,
              restockingFeePaise,
              deductionPaise,
            });
          }}
        >
          <ClipboardCheck
            aria-hidden={true}
            className="size-4"
          />
          Complete Inspection
        </Button>
      </div>
    </Surface>
  );
}
