"use client";

import { useEffect } from "react";
import { btnClass } from "@/lib/button-styles";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-bg px-6 text-center font-body text-brand-text">
      <h1 className="font-heading text-2xl font-medium">Algo deu errado ao carregar os dados</h1>
      <button className={btnClass("secondary")} onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
