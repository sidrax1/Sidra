import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
  description: "The requested page could not be found."
};

export default function NotFound(): React.JSX.Element {
 return (
  <main className="min-h-screen bg-background text-foreground">
    <section className="sidra-container flex min-h-screen flex-col items-center justify-center
gap-8 text-center">

     <span className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs
font-semibold uppercase tracking-[0.35em] text-primary">
      Error 404
     </span>

     <div className="space-y-5">

          <h1 className="sidra-display">
           Page Not Found
          </h1>

          <p className="mx-auto max-w-xl text-muted">
           The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

     </div>

     <div className="flex flex-wrap items-center justify-center gap-4">

     <Link
      href="/"
      className="sidra-transition rounded-full bg-primary px-8 py-4 font-medium text-black
shadow-luxury hover:scale-[1.02]"
     >
      Back to Home
     </Link>

      <button
       type="button"
       onClick={() => history.back()}
       className="sidra-transition rounded-full border border-primary/30 px-8 py-4
hover:bg-primary/10"
      >
       Go Back
      </button>

     </div>

    </section>
   </main>
 );
}
