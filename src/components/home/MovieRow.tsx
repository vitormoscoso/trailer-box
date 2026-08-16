"use client";

import { btnClass } from "@/lib/button-styles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";

export type MovieCard = {
  id: number;
  title: string;
  year: string;
  genres: string;
  poster: string | null;
};

export default function MovieRow({
  id,
  title,
  note,
  items,
}: {
  id: string;
  title: string;
  note: string;
  items: MovieCard[];
}) {
  const [api, setApi] = useState<CarouselApi>();

  if (items.length === 0) return null;

  return (
    <section id={id} className="pt-20">
      <div className="flex items-end px-12 pb-5">
        <div>
          <h4 className="font-heading text-xl font-medium leading-tight">
            {title}
          </h4>
          <span className="text-xs text-brand-text/50">{note}</span>
        </div>
        <div className="flex-1" />
        <div className="flex gap-1">
          <Button
            className={btnClass("secondary", { icon: true })}
            aria-label="Anterior"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            className={btnClass("secondary", { icon: true })}
            aria-label="Próximo"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="px-12"
      >
        <CarouselContent className="ml-2">
          {items.map((film) => (
            <CarouselItem
              key={film.id}
              className="pl-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/9"
            >
              <Link
                href={`/movie/${film.id}`}
                className="group flex flex-none flex-col gap-2 text-brand-text no-underline"
              >
                <div className="relative h-[30vh] w-[9vw] overflow-hidden rounded-lg bg-brand-surface shadow-sm transition-shadow duration-150 ease-in-out group-hover:shadow-md">
                  {film.poster && (
                    <Image
                      src={film.poster}
                      alt={film.title}
                      fill
                      sizes="196px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-heading text-sm font-medium leading-tight">
                    {film.title}
                  </div>
                  <div className="mt-1 text-xs text-brand-text/50">
                    {film.year}
                    {film.genres ? ` · ${film.genres}` : ""}
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
