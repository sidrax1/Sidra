"use client";

export default function GlobalError(): React.JSX.Element {
 return (
  <html lang="en">
    <body className="bg-background text-foreground">

      <main className="flex min-h-screen items-center justify-center">

          <section className="sidra-container text-center space-y-6">

           <h1 className="sidra-display">
            Critical Error
           </h1>

           <p className="text-muted">
            Sidra encountered a critical application error.
           </p>

           <button
            className="sidra-transition rounded-full bg-primary px-8 py-4 text-black"
            onClick={() => window.location.reload()}
           >

            Reload Application
           </button>

          </section>

      </main>

    </body>
   </html>
 );
}
