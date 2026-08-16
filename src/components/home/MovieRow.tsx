"use client";

import { btnClass } from "@/lib/button-styles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import PosterCard, { type MovieCard } from "./PosterCard";

export type { MovieCard };

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
              <PosterCard movie={film} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
