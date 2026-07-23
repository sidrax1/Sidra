"use client";

import {
  BadgeIndianRupee,
  ClipboardCheck,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  Alert,
} from "@/components/ui/Alert";
import {
  Button,
} from "@/components/ui/Button";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Input,
} from "@/components/ui/Input";
import {
  Price,
} from "@/components/ui/Price";
import {
  Select,
} from "@/components/ui/Select";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  WarrantyClaimAssessmentInput,
} from "@/lib/schemas/warranty";
import type {
  ProductWarranty,
  WarrantyClaim,
} from "@/types/warranty";

interface WarrantyClaimAssessmentFormProps {
  readonly claim: WarrantyClaim;
  readonly warranty: ProductWarranty;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: WarrantyClaimAssessmentInput
  ) => void | Promise<void>;
}

export function WarrantyClaimAssessmentForm({
  claim,
  loading = false,
  onSubmit,
  warranty,
}: WarrantyClaimAssessmentFormProps): React.JSX.Element {
  const initialCoverageItem =
    claim.assessment
      ?.coverageItemId ??
    warranty.coverage.find(
      (coverage) =>
        coverage.active
    )?.id ??
    "";

  const [
    coverageItemId,
    setCoverageItemId,
  ] = useState(
    initialCoverageItem
  );

  const [covered, setCovered] =
    useState(
      claim.assessment
        ?.covered ?? true
    );

  const [reason, setReason] =
    useState(
      claim.assessment
        ?.reason ?? ""
    );

  const [
    estimatedServiceCostPaise,
    setEstimatedServiceCostPaise,
  ] = useState(
    claim.assessment
      ?.estimatedServiceCostPaise ??
      0
  );

  const [
    approvedCoveragePaise,
    setApprovedCoveragePaise,
  ] = useState(
    claim.assessment
      ?.approvedCoveragePaise ??
      0
  );

  const [
    deductiblePaise,
    setDeductiblePaise,
  ] = useState(
    claim.assessment
      ?.deductiblePaise ?? 0
  );

  const [
    customerPayablePaise,
    setCustomerPayablePaise,
  ] = useState(
    claim.assessment
      ?.customerPayablePaise ??
      0
  );

  const coverageOptions =
    useMemo(
      () => [
        {
          value: "",
          label:
            "No Specific Coverage Item",
        },
        ...warranty.coverage.map(
          (coverage) => ({
            value: coverage.id,
            label: `${coverage.title}${
              coverage.active
                ? ""
                : " — Inactive"
            }`,
          })
        ),
      ],
      [warranty.coverage]
    );

  const selectedCoverage =
    warranty.coverage.find(
      (coverage) =>
        coverage.id ===
        coverageItemId
    );

  const accountedValue =
    approvedCoveragePaise +
    customerPayablePaise;

  const shortfallPaise =
    Math.max(
      estimatedServiceCostPaise -
        accountedValue,
      0
    );

  const exceedsMaximum =
    typeof selectedCoverage
      ?.maximumCoveragePaise ===
      "number" &&
    approvedCoveragePaise >
      selectedCoverage.maximumCoveragePaise;

  const valid =
    reason.trim().length >= 20 &&
    estimatedServiceCostPaise >=
      0 &&
    approvedCoveragePaise >= 0 &&
    deductiblePaise >= 0 &&
    customerPayablePaise >= 0 &&
    shortfallPaise === 0 &&
    !exceedsMaximum &&
    (covered ||
      approvedCoveragePaise ===
        0);

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
            Coverage Assessment
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Assess Warranty Claim
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Evaluate claim coverage, expected service cost,
            deductible responsibility and approved warranty value.
          </p>
        </div>
      </header>

      <Alert
        variant="warning"
        title="Assessment controls the claim decision"
        description="Coverage values must follow the warranty terms and fully account for the estimated service cost."
        icon={
          <ShieldAlert
            aria-hidden={true}
            className="size-5"
          />
        }
      />

      <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">
          Claim #{claim.claimNumber}
        </p>

        <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          {claim.issueTitle}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted">
          {claim.issueDescription}
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Coverage Item"
          labelFor="warranty-assessment-coverage"
          optional
        >
          <Select
            id="warranty-assessment-coverage"
            value={coverageItemId}
            options={
              coverageOptions
            }
            disabled={loading}
            onChange={(event) =>
              setCoverageItemId(
                event.target.value
              )
            }
          />
        </FormField>

        <label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
          <input
            type="checkbox"
            checked={covered}
            disabled={loading}
            onChange={(event) => {
              const nextCovered =
                event.target.checked;

              setCovered(
                nextCovered
              );

              if (!nextCovered) {
                setApprovedCoveragePaise(
                  0
                );
              }
            }}
            className="mt-1 size-4 accent-[var(--color-gold-500)]"
          />

          <span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <ShieldCheck
                aria-hidden={true}
                className="size-4 text-[var(--color-success)]"
              />
              Claim is covered
            </span>

            <span className="mt-1 block text-xs leading-5 text-muted">
              Disable when the issue falls outside active warranty
              coverage or within an exclusion.
            </span>
          </span>
        </label>
      </div>

      {selectedCoverage ? (
        <section className="rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)] p-5">
          <h3 className="font-medium text-foreground">
            {selectedCoverage.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted">
            {
              selectedCoverage.description
            }
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
            {typeof selectedCoverage.maximumCoveragePaise ===
            "number" ? (
              <span>
                Maximum coverage:{" "}
                <strong className="font-medium text-foreground">
                  ₹
                  {(
                    selectedCoverage.maximumCoveragePaise /
                    100
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </span>
            ) : null}

            {typeof selectedCoverage.deductiblePaise ===
            "number" ? (
              <span>
                Standard deductible:{" "}
                <strong className="font-medium text-foreground">
                  ₹
                  {(
                    selectedCoverage.deductiblePaise /
                    100
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </span>
            ) : null}
          </div>
        </section>
      ) : null}

      <FormField
        label="Assessment Reason"
        labelFor="warranty-assessment-reason"
        required
        description={`${reason.length}/3000 characters`}
      >
        <Textarea
          id="warranty-assessment-reason"
          value={reason}
          rows={8}
          minLength={20}
          maxLength={3000}
          disabled={loading}
          placeholder="Document the product condition, evidence reviewed, applicable coverage terms and assessment basis."
          onChange={(event) =>
            setReason(
              event.target.value
            )
          }
        />
      </FormField>

      <section className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-600)]">
            Financial Assessment
          </p>

          <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Coverage Allocation
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <FormField
            label="Estimated Service Cost"
            labelFor="warranty-estimated-cost"
            required
            description="Amount in paise"
          >
            <Input
              id="warranty-estimated-cost"
              type="number"
              min={0}
              step={1}
              value={
                estimatedServiceCostPaise
              }
              disabled={loading}
              onChange={(event) =>
                setEstimatedServiceCostPaise(
                  Math.max(
                    Number(
                      event.target
                        .value
                    ) || 0,
                    0
                  )
                )
              }
            />
          </FormField>

          <FormField
            label="Approved Coverage"
            labelFor="warranty-approved-coverage"
            required
            error={
              exceedsMaximum
                ? "Approved coverage exceeds the selected coverage limit."
                : undefined
            }
            description="Amount in paise"
          >
            <Input
              id="warranty-approved-coverage"
              type="number"
              min={0}
              step={1}
              value={
                approvedCoveragePaise
              }
              disabled={
                loading ||
                !covered
              }
              invalid={
                exceedsMaximum
              }
              onChange={(event) =>
                setApprovedCoveragePaise(
                  Math.max(
                    Number(
                      event.target
                        .value
                    ) || 0,
                    0
                  )
                )
              }
            />
          </FormField>

          <FormField
            label="Deductible"
            labelFor="warranty-deductible"
            required
            description="Amount in paise"
          >
            <Input
              id="warranty-deductible"
              type="number"
              min={0}
              step={1}
              value={
                deductiblePaise
              }
              disabled={loading}
              onChange={(event) =>
                setDeductiblePaise(
                  Math.max(
                    Number(
                      event.target
                        .value
                    ) || 0,
                    0
                  )
                )
              }
            />
          </FormField>

          <FormField
            label="Customer Payable"
            labelFor="warranty-customer-payable"
            required
            description="Amount in paise"
          >
            <Input
              id="warranty-customer-payable"
              type="number"
              min={0}
              step={1}
              value={
                customerPayablePaise
              }
              disabled={loading}
              onChange={(event) =>
                setCustomerPayablePaise(
                  Math.max(
                    Number(
                      event.target
                        .value
                    ) || 0,
                    0
                  )
                )
              }
            />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Estimated Cost
            </p>

            <Price
              amount={
                estimatedServiceCostPaise /
                100
              }
              size="lg"
              className="mt-2"
            />
          </article>

          <article className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Accounted Value
            </p>

            <Price
              amount={
                accountedValue /
                100
              }
              size="lg"
              className="mt-2"
            />
          </article>

          <article
            className={[
              "rounded-[var(--radius-md)] border p-4",
              shortfallPaise > 0
                ? "border-[color:rgb(145_59_59_/_0.35)] bg-[color:rgb(145_59_59_/_0.06)]"
                : "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)]",
            ].join(" ")}
          >
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <BadgeIndianRupee
                aria-hidden={true}
                className="size-3.5"
              />
              Unallocated
            </p>

            <Price
              amount={
                shortfallPaise / 100
              }
              size="lg"
              className="mt-2"
            />
          </article>
        </div>
      </section>

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Saving Assessment"
          onClick={() => {
            void onSubmit({
              claimId: claim.id,
              coverageItemId:
                coverageItemId ||
                undefined,
              covered,
              reason:
                reason.trim(),
              estimatedServiceCostPaise,
              approvedCoveragePaise,
              deductiblePaise,
              customerPayablePaise,
            });
          }}
        >
          <ClipboardCheck
            aria-hidden={true}
            className="size-4"
          />
          Save Assessment
        </Button>
      </div>
    </Surface>
  );
}
