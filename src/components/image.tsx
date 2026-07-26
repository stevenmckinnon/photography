"use client";
import { useState } from "react";
import { motion } from "motion/react";

import { closeSpring, openSpring } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/gallery";

interface ImageProps {
  image: GalleryImage;
  index: number;
  setSelectedPhoto: (index: number) => void;
  /** Rendered CSS width, used to pick the right srcset candidate. */
  sizes?: string;
  /** Skip lazy-loading for the first screenful so the grid paints immediately. */
  priority?: boolean;
  style?: React.CSSProperties;
  isSelected?: boolean;
}

export default function Images({
  image,
  index,
  setSelectedPhoto,
  sizes,
  priority = false,
  style,
  isSelected = false,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      onClick={() => setSelectedPhoto(index)}
      className="w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label={`View ${image.alt}`}
    >
      <motion.img
        initial={false}
        layoutId={`photo-${index}`}
        layout
        src={image.imageUrl}
        srcSet={image.srcSet}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        data-loaded={isLoaded}
        onLoad={() => setIsLoaded(true)}
        style={{ ...style, willChange: "transform" }}
        className={cn(
          "w-full h-auto object-cover rounded-sm",
          // Keeps white-background studio shots from bleeding into the page.
          "outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10",
          "opacity-0 transition-opacity duration-500 data-[loaded=true]:opacity-100",
        )}
        transition={{
          layout: isSelected ? openSpring : closeSpring,
        }}
      />
    </button>
  );
}
