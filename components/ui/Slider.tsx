"use client";

import {
  useMemo,
} from "react";

import {
  cn,
} from "@/lib/utils";

interface SliderProps {
  readonly minimum: number;
  readonly maximum: number;

    readonly value: readonly [
      number,
      number,
    ];
    readonly step?: number;
    readonly disabled?: boolean;
    readonly className?: string;
    readonly onValueChange: (
      value: readonly [
        number,
        number,
      ]
    ) => void;
}

function clampValue(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

export function Slider({
  className,
  disabled = false,
  maximum,
  minimum,
  onValueChange,
  step = 1,
  value,
}: SliderProps): React.JSX.Element {
  if (maximum <= minimum) {
    throw new RangeError(
      "maximum must be greater than minimum."
    );
  }

    const [
     lowerValue,
     upperValue,

 ] = useMemo(
   () => [
     clampValue(
       value[0],
       minimum,
       maximum
     ),
     clampValue(
       value[1],
       minimum,
       maximum
     ),
   ],
   [
     maximum,
     minimum,
     value,
   ]
 );

 const lowerPercentage =
  ((lowerValue - minimum) /
    (maximum - minimum)) *
  100;

 const upperPercentage =
  ((upperValue - minimum) /
    (maximum - minimum)) *
  100;

 return (
  <div
    className={cn(
      "relative h-8 w-full",
      disabled &&
        "pointer-events-none opacity-45",
      className
    )}
  >
    <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full
bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)]" />

   <div
    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[var(--color-gold-500)]"

 style={{
   left: `${lowerPercentage}%`,
   right: `${
     100 - upperPercentage
   }%`,
 }}
/>

<input
 type="range"
 min={minimum}
 max={maximum}
 step={step}
 value={lowerValue}
 disabled={disabled}
 aria-label="Minimum value"
 onChange={(event) => {
   const nextValue =
    Math.min(
      Number(
        event.target.value
      ),
      upperValue
    );

   onValueChange([
     nextValue,
     upperValue,
   ]);
 }}
 className={cn(
   "pointer-events-none absolute inset-0 h-8 w-full appearance-none bg-transparent",
   "[&::-webkit-slider-thumb]:pointer-events-auto",
   "[&::-webkit-slider-thumb]:size-5",
   "[&::-webkit-slider-thumb]:appearance-none",
   "[&::-webkit-slider-thumb]:rounded-full",
   "[&::-webkit-slider-thumb]:border-2",
   "[&::-webkit-slider-thumb]:border-[var(--color-gold-500)]",
   "[&::-webkit-slider-thumb]:bg-[var(--color-ivory-50)]",
   "[&::-webkit-slider-thumb]:shadow-[var(--shadow-card)]",
   "[&::-moz-range-thumb]:pointer-events-auto",
   "[&::-moz-range-thumb]:size-5",
   "[&::-moz-range-thumb]:rounded-full",
   "[&::-moz-range-thumb]:border-2",

   "[&::-moz-range-thumb]:border-[var(--color-gold-500)]",
   "[&::-moz-range-thumb]:bg-[var(--color-ivory-50)]"
 )}
/>

<input
 type="range"
 min={minimum}
 max={maximum}
 step={step}
 value={upperValue}
 disabled={disabled}
 aria-label="Maximum value"
 onChange={(event) => {
   const nextValue =
    Math.max(
      Number(
        event.target.value
      ),
      lowerValue
    );

   onValueChange([
     lowerValue,
     nextValue,
   ]);
 }}
 className={cn(
   "pointer-events-none absolute inset-0 h-8 w-full appearance-none bg-transparent",
   "[&::-webkit-slider-thumb]:pointer-events-auto",
   "[&::-webkit-slider-thumb]:size-5",
   "[&::-webkit-slider-thumb]:appearance-none",
   "[&::-webkit-slider-thumb]:rounded-full",
   "[&::-webkit-slider-thumb]:border-2",
   "[&::-webkit-slider-thumb]:border-[var(--color-gold-500)]",
   "[&::-webkit-slider-thumb]:bg-[var(--color-ivory-50)]",
   "[&::-webkit-slider-thumb]:shadow-[var(--shadow-card)]",
   "[&::-moz-range-thumb]:pointer-events-auto",
   "[&::-moz-range-thumb]:size-5",
   "[&::-moz-range-thumb]:rounded-full",
   "[&::-moz-range-thumb]:border-2",
   "[&::-moz-range-thumb]:border-[var(--color-gold-500)]",
   "[&::-moz-range-thumb]:bg-[var(--color-ivory-50)]"
 )}

    />
   </div>
 );
}
