import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { PUBLIC_ROUTES } from "@/constants/routes";

const footerGroups = [
 {
   title: "Discover",
   links: [
     { label: "Studios", href: PUBLIC_ROUTES.STUDIOS },
     { label: "Collections", href: "/collections" },
     { label: "Journal", href: PUBLIC_ROUTES.JOURNAL },
   ],
 },
 {
   title: "Services",
   links: [
     { label: "Custom Orders", href: PUBLIC_ROUTES.CUSTOM_ORDERS },

      { label: "Corporate Orders", href: PUBLIC_ROUTES.CORPORATE },
      { label: "Support", href: PUBLIC_ROUTES.SUPPORT },
    ],
  },
  {
    title: "Sidra",
    links: [
      { label: "About", href: PUBLIC_ROUTES.ABOUT },
      { label: "Contact", href: PUBLIC_ROUTES.CONTACT },
      { label: "Enter as an Artist", href: PUBLIC_ROUTES.SELL_ON_SIDRA },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: PUBLIC_ROUTES.PRIVACY_POLICY },
      { label: "Terms", href: PUBLIC_ROUTES.TERMS_POLICY },
      { label: "Returns", href: PUBLIC_ROUTES.RETURNS_POLICY },
    ],
  },
] as const;

export function SiteFooter(): React.JSX.Element {
 return (
  <footer className="border-t border-[color:rgb(200_169_106_/_0.18)]
bg-[var(--color-black-950)] text-[var(--color-ivory-100)]">
    <Container spacing="xl">
     <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
      <div>
        <Link
          href="/"
          className="font-heading text-4xl font-semibold tracking-[-0.04em]"
        >
          Sidra
        </Link>

       <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
        A private luxury ecosystem for exceptional resin artists and
        handcrafted brands.
       </p>
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
       {footerGroups.map((group) => (

          <section key={group.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em]
text-[var(--color-gold-500)]">
             {group.title}
            </h2>

            <ul className="mt-5 grid gap-3">
             {group.links.map((link) => (
               <li key={link.href}>
                 <Link
                  href={link.href}
                  className="text-sm text-white/65 transition-colors hover:text-white"
                 >
                  {link.label}
                 </Link>
               </li>
             ))}
            </ul>
          </section>
        ))}
       </div>
      </div>

       <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs
text-white/45 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Sidra. All rights reserved.</p>
        <p>Crafted in India.</p>
       </div>
     </Container>
    </footer>
  );
}
