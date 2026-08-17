"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { btnClass } from "@/lib/button-styles";
import { Button } from "@/components/ui/button";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import PersonCard, { type PersonCardMember } from "./PersonCard";

export default function PersonRow({ title, members }: { title: string; members: PersonCardMember[] }) {
  const [api, setApi] = useState<CarouselApi>();

  if (members.length === 0) return null;

  return (
    <section className="px-12 pt-10">
      <div className="flex items-end pb-4">
        <h2 className="font-heading text-lg font-medium leading-tight">{title}</h2>
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
      <Carousel setApi={setApi} opts={{ loop: false, align: "start" }}>
        <CarouselContent className="ml-2">
          {members.map((member, index) => (
            <CarouselItem
              key={`${member.id}-${index}`}
              className="basis-1/4 pl-0 sm:basis-1/6 md:basis-1/8 lg:basis-1/10 xl:basis-1/12"
            >
              <PersonCard member={member} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
