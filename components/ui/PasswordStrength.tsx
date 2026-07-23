import {
  cn,
} from "@/lib/utils";

interface PasswordStrengthProps {
  readonly password: string;
  readonly className?: string;
}

interface PasswordStrengthResult {
  readonly score: number;
  readonly label: string;
  readonly feedback: readonly string[];
}

function calculateStrength(
  password: string
): PasswordStrengthResult {
  let score = 0;

 const feedback: string[] = [];

 if (password.length >= 8) {
   score += 1;
 } else {
   feedback.push(
     "Use at least 8 characters."
   );
 }

 if (
   /[a-z]/.test(password) &&
   /[A-Z]/.test(password)
 ){
   score += 1;
 } else {
   feedback.push(
      "Mix uppercase and lowercase letters."
   );
 }

 if (/\d/.test(password)) {
   score += 1;
 } else {

        feedback.push(
          "Add at least one number."
        );
    }

    if (
      /[^A-Za-z0-9]/.test(password)
    ){
      score += 1;
    } else {
      feedback.push(
         "Add at least one symbol."
      );
    }

    if (password.length >= 12) {
      score += 1;
    }

    const labels = [
      "Very weak",
      "Weak",
      "Fair",
      "Strong",
      "Excellent",
      "Exceptional",
    ];

    return {
      score,
      label: labels[score] ?? "Very weak",
      feedback,
    };
}

export function PasswordStrength({
  className,
  password,
}: PasswordStrengthProps): React.JSX.Element {
  const result =
   calculateStrength(password);

    return (
     <div

       className={cn(
         "grid gap-3",
         className
       )}
      >
       <div className="grid grid-cols-5 gap-2">
         {Array.from(
           {
             length: 5,
           },
           (_, index) => (
             <span
               key={index}
               className={cn(
                 "h-1.5 rounded-full",
                 index < result.score
                   ? result.score <= 2
                     ? "bg-[var(--color-error)]"
                     : result.score <= 3
                       ? "bg-[var(--color-warning)]"
                       : "bg-[var(--color-success)]"
                   : "bg-[var(--color-gray-100)] dark:bg-[var(--color-gray-700)]"
               )}
             />
           )
         )}
       </div>

       <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-medium text-foreground">
         {result.label}
        </span>

     {result.feedback.length > 0 ? (
       <span className="max-w-xs text-right text-xs leading-5 text-muted">
         {result.feedback[0]}
       </span>
     ) : null}
    </div>
   </div>
 );
}
