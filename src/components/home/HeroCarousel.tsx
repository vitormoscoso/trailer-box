"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { btnClass } from "@/lib/button-styles";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "../ui/button";

const AUTO_ADVANCE_MS = 5000;

export type HeroSlide = {
  id: number;
  title: string;
  year: string;
  genres: string;
  synopsis: string;
  backdrop: string | null;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || slides.length <= 1 || paused) return;
    const timer = setInterval(() => {
      api.scrollNext();
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [api, slides.length, paused]);

  if (slides.length === 0) return null;

  return (
    <section className="-mt-[73px]">
      <Carousel setApi={setApi} opts={{ loop: true }} className="h-[70vh]">
        <CarouselContent className="ml-0 h-[70vh]">
          {slides.map((slide, i) => (
            <CarouselItem
              key={slide.id}
              className="relative h-[70vh] basis-full pl-0"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="absolute inset-0">
                {slide.backdrop && (
                  <Image
                    src={slide.backdrop}
                    alt={slide.title}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#161826_0%,rgba(22,24,38,0.92)_34%,rgba(22,24,38,0.25)_68%,rgba(22,24,38,0.7)_100%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#161826_0%,rgba(22,24,38,0)_42%)]" />
              <div className="absolute bottom-[2em] left-[3em] max-w-[50vw]">
                <h1 className="mb-2 font-heading text-[3em] font-medium tracking-[-0.02em] [text-wrap:balance]">
                  {slide.title}
                </h1>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-brand-text/62">
                  <span>{slide.year}</span>
                  {slide.genres && (
                    <>
                      <span>·</span>
                      <span>{slide.genres}</span>
                    </>
                  )}
                </div>
                <p className="line-clamp-4 text-md text-brand-text/72 [text-wrap:pretty]">{slide.synopsis}</p>
                <div className="mt-4 flex gap-4">
                  <Link className={btnClass("primary")} href={`/movie/${slide.id}`}>
                    <Play fill="currentColor" size={16} />
                    Assistir trailer
                  </Link>
                  <Link className={btnClass("secondary")} href={`/movie/${slide.id}`}>
                    Sobre o filme
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute left-[3em] flex items-center gap-4">
        <div className="flex gap-1">
          {slides.map((slide, i) => {
            const on = i === active;
            return (
              <Button
                key={slide.id}
                aria-label={slide.title}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1.5 cursor-pointer rounded-sm border-0 p-0.5 hover:bg-brand-accent/50 transition-[width,background-color] duration-200 ease-in-out",
                  on ? "w-6 bg-brand-accent" : "w-3 bg-brand-neutral-700"
                )}
              />
            );
          })}
        </div>
        <div className="flex gap-1">
          <Button className={btnClass("secondary", { icon: true })} aria-label="Anterior" onClick={() => api?.scrollPrev()}>
            <ChevronLeft size={16} />
          </Button>
          <Button className={btnClass("secondary", { icon: true })} aria-label="Próximo" onClick={() => api?.scrollNext()}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
