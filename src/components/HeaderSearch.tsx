"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ButtonGroup } from "./ui/button-group";
import { Field } from "./ui/field";

export function HeaderSearch() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenSearch = () => {
    if (isSearchOpen && searchQuery.trim() !== "") {
      router.push(`/busca/${encodeURIComponent(searchQuery)}`);
      return;
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="flex items-center gap-2">
      <Field>
        <ButtonGroup>
          {isSearchOpen && (
            <Input
              id="input-button-group"
              placeholder="Digite sua pesquisa..."
              className="border border-white/5 bg-[#2a2a2a] placeholder:text-white/70 text-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  searchQuery.trim() !== "" &&
                  isSearchOpen
                ) {
                  router.push(`/busca/${encodeURIComponent(searchQuery)}`);
                }
              }}
            />
          )}
          <Button
            variant="outline"
            size="icon"
            className="border border-white/5 bg-[#131313]/20 text-[#ffd89c]/80 hover:text-[#ffd89c] hover:bg-[#131313]/20 cursor-pointer"
            onClick={handleOpenSearch}
          >
            <Search />
          </Button>
        </ButtonGroup>
      </Field>
    </div>
  );
}
