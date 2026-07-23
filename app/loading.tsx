export default function Loading(): React.JSX.Element {
  return (
   <main className="min-h-screen bg-background text-foreground">
     <section className="sidra-container flex min-h-screen flex-col items-center justify-center">

     <div className="flex flex-col items-center gap-8">

      <div
       className="h-20 w-20 animate-spin rounded-full border-[3px] border-primary/20
border-t-primary"
       aria-hidden="true"
      />

          <div className="space-y-3 text-center">

           <h2 className="text-2xl font-heading">
            Preparing Your Experience
           </h2>

           <p className="text-muted">
            Please wait while Sidra is loading...

           </p>

          </div>

      </div>

    </section>
   </main>
 );
}
