"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export default function PosterImage({
  src,
  alt,
  sizes,
  iconSize = 28,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  iconSize?: number;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return showImage ? (
    <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" onError={() => setFailed(true)} />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-brand-text/30">
      <ImageOff size={iconSize} />
    </div>
  );
}
