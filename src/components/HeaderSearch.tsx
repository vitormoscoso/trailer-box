"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function HeaderSearch() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submit = () => {
    if (query.trim() !== "") {
      router.push(`/busca/${encodeURIComponent(query.trim())}`);
    }
  };

  const handleToggle = () => {
    if (isSearchOpen && query.trim() !== "") {
      submit();
      return;
    }
    setIsSearchOpen((open) => !open);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="search"
        placeholder="Buscar filme"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className={cn(
          "min-w-0 flex-none rounded-lg bg-brand-surface text-sm text-brand-text caret-brand-accent outline-none transition-all duration-200 ease-in-out hover:border-brand-text/45 focus-visible:border-brand-accent",
          isSearchOpen
            ? "visible w-[15vw] border border-brand-divider px-2 py-1 opacity-100"
            : "invisible w-0 border-0 py-1 opacity-0",
        )}
      />
      <Button
        className="cursor-pointer flex-none rounded-lg border border-brand-divider bg-brand-surface p-2 text-brand-text hover:bg-brand-surface/80"
        aria-label="Buscar"
        onClick={handleToggle}
      >
        <Search />
      </Button>
    </div>
  );
}
