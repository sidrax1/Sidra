"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;

}

export default function ErrorPage({
  error,
  reset
}: Readonly<ErrorPageProps>): React.JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

 return (
  <main className="min-h-screen bg-background text-foreground">
    <section className="sidra-container flex min-h-screen flex-col items-center justify-center
gap-8 text-center">

      <span className="rounded-full border border-destructive/20 bg-destructive/5 px-5 py-2
text-xs font-semibold uppercase tracking-[0.35em] text-destructive">
       Unexpected Error
      </span>

     <div className="space-y-5">

      <h1 className="sidra-display">
       Something Went Wrong
      </h1>

      <p className="mx-auto max-w-2xl text-muted">
       An unexpected error occurred while loading this page.
       Please try again.
      </p>

     </div>

     <div className="flex flex-wrap items-center justify-center gap-4">

     <button
      type="button"
      onClick={reset}
      className="sidra-transition rounded-full bg-primary px-8 py-4 font-medium text-black
shadow-luxury hover:scale-[1.02]"
     >
      Try Again
     </button>

      <button
       type="button"
       onClick={() => window.location.assign("/")}
       className="sidra-transition rounded-full border border-primary/30 px-8 py-4
hover:bg-primary/10"
      >
       Go Home
      </button>

     </div>

    </section>
   </main>
 );
}
