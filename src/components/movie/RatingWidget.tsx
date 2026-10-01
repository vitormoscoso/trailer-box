"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitRating, type SubmitRatingResult } from "@/lib/ratings/actions";
import type { MovieRatingSummary } from "@/lib/ratings/queries";
import { SignInDialog } from "@/components/auth/SignInDialog";

export function RatingWidget({
  movieId,
  initialSummary,
}: {
  movieId: number;
  initialSummary: MovieRatingSummary;
}) {
  const { status } = useSession();
  const [summary, setSummary] = useState(initialSummary);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const isAuthenticated = status === "authenticated";
  const activeValue = hovered ?? summary.userValue ?? 0;

  function handleRate(value: number) {
    startTransition(async () => {
      const result: SubmitRatingResult = await submitRating(movieId, value);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSummary({ average: result.average, count: result.count, userValue: result.userValue });
      toast.success("Avaliação salva!");
    });
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-brand-text/70">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = value <= activeValue;
          const star = (
            <Star
              key={value}
              className={cn(
                "size-5 transition-colors",
                filled ? "fill-current text-yellow-400" : "text-brand-text/30"
              )}
            />
          );

          if (!isAuthenticated) {
            return (
              <SignInDialog key={value}>
                <button
                  type="button"
                  aria-label={`Avaliar com ${value} estrela(s)`}
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  {star}
                </button>
              </SignInDialog>
            );
          }

          return (
            <button
              key={value}
              type="button"
              aria-label={`Avaliar com ${value} estrela(s)`}
              disabled={isPending}
              onMouseEnter={() => setHovered(value)}
              onClick={() => handleRate(value)}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              {star}
            </button>
          );
        })}
      </div>
      {summary.average != null ? (
        <span>
          {summary.average.toFixed(1)} ({summary.count}{" "}
          {summary.count === 1 ? "avaliação" : "avaliações"})
        </span>
      ) : (
        <span className="text-brand-text/50">Sem avaliações ainda</span>
      )}
    </div>
  );
}
