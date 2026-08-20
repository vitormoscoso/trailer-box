"use client";

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
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isSearchOpen ? "w-[15vw] opacity-100" : "w-0 opacity-0"
        }`}
      >
        {isSearchOpen && (
          <Input
            autoFocus
            type="search"
            placeholder="Buscar filme"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className="w-[15vw] rounded-lg border border-brand-divider bg-brand-surface px-2 py-1 text-sm text-brand-text caret-brand-accent outline-none hover:border-brand-text/45 focus-visible:border-brand-accent"
          />
        )}
      </div>
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
