import Link from "next/link";
import { btnClass } from "@/lib/button-styles";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-bg px-6 text-center font-body text-brand-text">
      <h1 className="font-heading text-2xl font-medium">Não encontramos essa página</h1>
      <p className="max-w-md text-sm text-brand-text/60">O filme ou a página que você procura não existe.</p>
      <Link href="/" className={btnClass("primary")}>
        Voltar para a Home
      </Link>
    </div>
  );
}
