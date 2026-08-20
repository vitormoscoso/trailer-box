"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TrailerLanguage, TrailerOption } from "@/lib/tmdb";
import { Button } from "../ui/button";

export const TRAILER_LANGUAGE_COOKIE = "trailer-lang";

function setTrailerLanguageCookie(key: TrailerLanguage) {
  document.cookie = `${TRAILER_LANGUAGE_COOKIE}=${key}; path=/; samesite=lax`;
}

export default function TrailerPlayer({
  options,
  initialKey,
}: {
  options: TrailerOption[];
  initialKey: TrailerLanguage;
}) {
  const [activeKey, setActiveKey] = useState<TrailerLanguage>(initialKey);

  if (options.length === 0) return null;

  const active =
    options.find((option) => option.key === activeKey) ?? options[0];

  const select = (key: TrailerLanguage) => {
    setActiveKey(key);
    setTrailerLanguageCookie(key);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {options.length > 1 && (
          <div className="flex gap-1">
            {options.map((option) => (
              <Button
                key={option.key}
                onClick={() => select(option.key)}
                className={cn(
                  "cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors bg-brand-surface hover:bg-brand-surface/70",
                  option.key === active.key
                    ? "border-brand-accent text-brand-accent"
                    : "border-brand-divider text-brand-text/70 hover:bg-brand-text/7",
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
        <div className="flex-1" />
        <a
          href={`https://www.youtube.com/watch?v=${active.video.key}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-brand-text/60 hover:text-brand-text"
        >
          <ExternalLink size={14} />
          Abrir no YouTube
        </a>
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-brand-surface">
        <iframe
          key={active.video.id}
          src={`https://www.youtube.com/embed/${active.video.key}`}
          title={active.video.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
