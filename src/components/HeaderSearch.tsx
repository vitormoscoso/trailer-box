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
          isSearchOpen ? "w-[42vw] opacity-100 sm:w-56 md:w-[15vw]" : "w-0 opacity-0"
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
            className="w-[42vw] rounded-lg border border-brand-divider bg-brand-surface px-2 py-1 text-sm text-brand-text caret-brand-accent outline-none hover:border-brand-text/45 focus-visible:border-brand-accent sm:w-56 md:w-[15vw]"
          />
        )}
      </div>
      <Button
        className="flex h-9 w-9 cursor-pointer flex-none items-center justify-center rounded-lg border border-brand-divider bg-brand-surface p-0 text-brand-text hover:bg-brand-surface/80"
        aria-label="Buscar"
        onClick={handleToggle}
      >
        <Search size={18} />
      </Button>
    </div>
  );
}
