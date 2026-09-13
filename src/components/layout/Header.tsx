import Link from "next/link";
import { HeaderSearch } from "../HeaderSearch";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/#lancamentos", label: "Lançamentos" },
  { href: "/#em-cartaz", label: "Em cartaz" },
  // { href: "/#generos", label: "Gêneros" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 bg-[linear-gradient(to_bottom,#161826_62%,rgba(22,24,38,0))] px-4 py-4 font-body text-brand-text sm:px-6 md:gap-6 md:px-12 md:py-6">
      <Link href="/" className="flex items-center gap-2 text-brand-text no-underline">
        <span className="font-heading text-base font-medium tracking-[0.06em] uppercase">
          TrailerBox
        </span>
      </Link>
      <nav className="hidden gap-6 text-sm md:flex">
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className={i === 0 ? "text-brand-text no-underline" : "text-brand-text/55 no-underline"}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1" />
      <div className="flex items-center gap-2 md:gap-4">
        <HeaderSearch />
      </div>
    </header>
  );
}
