import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover extraordinary craftsmanship through India's premium luxury handcrafted marketplace."
};

export default function HomePage(): React.JSX.Element {
 return (
  <main className="min-h-screen bg-background text-foreground">
    <section className="sidra-container flex min-h-screen flex-col items-center justify-center
gap-8 py-20">
     <div className="space-y-6 text-center">
      <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4
py-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">
        Welcome to Sidra
      </span>

      <h1 className="sidra-display max-w-5xl">
       Extraordinary
       <br />
       Craftsmanship
      </h1>

      <p className="mx-auto max-w-2xl text-lg text-muted">
       A premium digital destination built exclusively for luxury resin
       artists, handcrafted brands and collectors.
      </p>
     </div>

    <div className="flex flex-wrap items-center justify-center gap-4">
     <button
      type="button"
      className="sidra-transition rounded-full bg-primary px-8 py-4 font-medium text-black
shadow-luxury hover:scale-[1.02]"
     >
      Explore Collections
     </button>

      <button
       type="button"
       className="sidra-transition rounded-full border border-primary/30 px-8 py-4
font-medium hover:bg-primary/10"
      >

        Become a Seller
      </button>
     </div>
    </section>
   </main>
 );
}
