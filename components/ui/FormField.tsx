import type {
  ReactNode,
} from "react";

import {
  cn,
} from "@/lib/utils";

interface FormFieldProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly description?: string;
  readonly error?: string;
  readonly label?: ReactNode;
  readonly labelFor?: string;
  readonly optional?: boolean;
  readonly required?: boolean;
}

export function FormField({
  children,
  className,
  description,
  error,
  label,
  labelFor,
  optional = false,
  required = false,
}: FormFieldProps): React.JSX.Element {
  const descriptionId =
    labelFor && description
      ? `${labelFor}-description`
      : undefined;

 const errorId =

 labelFor && error
   ? `${labelFor}-error`
   : undefined;

return (
 <div
   className={cn(
     "grid gap-2",
     className
   )}
 >
   {label ? (
     <label
      htmlFor={labelFor}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
     >
      <span>
        {label}
      </span>

     {required ? (
       <span
         aria-hidden="true"
         className="text-[var(--color-error)]"
       >
         *
       </span>
     ) : null}

      {optional ? (
        <span className="text-xs font-normal text-muted">
          Optional
        </span>
      ) : null}
    </label>
  ) : null}

  {children}

  {description && !error ? (
   <p
    id={descriptionId}
    className="text-sm leading-relaxed text-muted"
   >

          {description}
        </p>
      ) : null}

    {error ? (
      <p
        id={errorId}
        role="alert"
        className="text-sm leading-relaxed text-[var(--color-error)]"
      >
        {error}
      </p>
    ) : null}
   </div>
 );
}
