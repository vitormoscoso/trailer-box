"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ratingSchema = z.object({
  movieId: z.number().int().positive(),
  value: z.number().int().min(1).max(5),
});

export type SubmitRatingResult =
  | { ok: true; average: number | null; count: number; userValue: number }
  | { ok: false; error: string };

export async function submitRating(
  movieId: number,
  value: number
): Promise<SubmitRatingResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Você precisa entrar para avaliar." };

  const parsed = ratingSchema.safeParse({ movieId, value });
  if (!parsed.success) return { ok: false, error: "Avaliação inválida." };

  await prisma.rating.upsert({
    where: { userId_movieId: { userId, movieId } },
    update: { value: parsed.data.value },
    create: { userId, movieId, value: parsed.data.value },
  });

  const aggregate = await prisma.rating.aggregate({
    where: { movieId },
    _avg: { value: true },
    _count: true,
  });

  revalidatePath(`/movie/${movieId}`);

  return {
    ok: true,
    average: aggregate._avg.value,
    count: aggregate._count,
    userValue: parsed.data.value,
  };
}
