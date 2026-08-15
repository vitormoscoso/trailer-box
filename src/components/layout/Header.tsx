import Link from "next/link";
import { HeaderSearch } from "../HeaderSearch";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-[#131313]/80 text-white">
      <h1 className="text-xl font-bold text-[#ffd89c]">
        <Link href="/">My Movie App</Link>
      </h1>
      <nav>
        <HeaderSearch />
      </nav>
    </header>
  );
}
