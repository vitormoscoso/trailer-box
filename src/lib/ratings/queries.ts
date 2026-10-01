import "server-only";
import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type MovieRatingSummary = {
  average: number | null;
  count: number;
  userValue: number | null;
};

export const getMovieRatingSummary = cache(
  async (movieId: number): Promise<MovieRatingSummary> => {
    const [session, aggregate] = await Promise.all([
      auth(),
      prisma.rating.aggregate({
        where: { movieId },
        _avg: { value: true },
        _count: true,
      }),
    ]);

    const userId = session?.user?.id;
    const userRating = userId
      ? await prisma.rating.findUnique({
          where: { userId_movieId: { userId, movieId } },
        })
      : null;

    return {
      average: aggregate._avg.value,
      count: aggregate._count,
      userValue: userRating?.value ?? null,
    };
  }
);
