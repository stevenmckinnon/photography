"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import NextImage from "@/components/image";

interface ImageGridProps {
  photos?: {
    url: string;
    name: string;
  }[];
  sortOrder?: string[];
}

interface ImageWithDimensions {
  url: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: "landscape" | "portrait";
}

export default function ImageGrid({ photos, sortOrder }: ImageGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | undefined>(
    undefined
  );
  const [processedPhotos, setProcessedPhotos] = useState<ImageWithDimensions[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [bottomRowIndices, setBottomRowIndices] = useState<number[]>([]);

  useEffect(() => {
    const loadImageDimensions = async () => {
      if (!photos) return;

      const processed = await Promise.all(
        photos.map(
          (photo) =>
            new Promise<ImageWithDimensions>((resolve) => {
              const img = new Image();
              img.onload = () => {
                resolve({
                  ...photo,
                  width: img.width,
                  height: img.height,
                  aspectRatio:
                    img.width > img.height ? "landscape" : "portrait",
                });
              };
              img.src = photo.url;
            })
        )
      );

      // Sort the processed photos if sortOrder is provided
      const sortedPhotos = sortOrder
        ? [...processed].sort((a, b) => {
            const aIndex = sortOrder.indexOf(a.name);
            const bIndex = sortOrder.indexOf(b.name);

            // If both items are in sortOrder, sort by their position
            if (aIndex !== -1 && bIndex !== -1) {
              return aIndex - bIndex;
            }
            // If only a is in sortOrder, it comes first
            if (aIndex !== -1) return -1;
            // If only b is in sortOrder, it comes first
            if (bIndex !== -1) return 1;
            // If neither is in sortOrder, maintain original order
            return 0;
          })
        : processed;

      setProcessedPhotos(sortedPhotos);
      setIsLoading(false);
    };

    loadImageDimensions();
  }, [photos, sortOrder]);

  useEffect(() => {
    const detectBottomRow = () => {
      const container = document.querySelector("ul");
      if (!container) return;

      const items = container.querySelectorAll("li");
      const bottomIndices: number[] = [];

      let lastBottom = 0;
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom > lastBottom) {
          // Clear previous indices if we found a new bottom row
          bottomIndices.length = 0;
          lastBottom = rect.bottom;
        }
        if (Math.abs(rect.bottom - lastBottom) < 1) {
          bottomIndices.push(index);
        }
      });

      setBottomRowIndices(bottomIndices);
    };

    // Run initial detection
    detectBottomRow();

    // Add resize listener
    const handleResize = debounce(detectBottomRow, 100);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [processedPhotos]);

  function debounce(fn: Function, ms: number) {
    let timer: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  if (!photos?.length || isLoading) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPhoto(undefined);
    }
  };

  return (
    <>
      <ul className="flex flex-wrap gap-1">
        {processedPhotos.map((photo, index) => (
          <li
            key={photo.name}
            className={`grow w-full h-auto ${
              photo.aspectRatio === "landscape"
                ? "sm:h-[300px] sm:w-[400px]"
                : "sm:h-[300px] sm:w-[200px]"
            } ${bottomRowIndices.includes(index) ? "!grow-0" : ""}`}
          >
            <button
              onClick={() => setSelectedPhoto(index)}
              className="h-full w-full"
            >
              <NextImage
                src={photo.url}
                alt={photo.name}
                className="h-full w-full max-h-full min-w-full object-cover align-bottom hover:opacity-90 transition-opacity rounded-sm"
                width={photo.width}
                height={photo.height}
                priority
                placeholder="blur"
                blurDataURL="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPsqgcAAZkBC+sDr3AAAAAASUVORK5CYII=)"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={!!selectedPhoto} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-transparent border-none max-w-[90vw] max-h-[90vh]">
          <DialogTitle className="sr-only">Photo</DialogTitle>
          <Carousel scrollTo={selectedPhoto}>
            <CarouselContent>
              {processedPhotos.map((photo) => (
                <CarouselItem
                  key={photo.name}
                  className="flex items-center justify-center"
                >
                  <NextImage
                    src={photo.url}
                    alt={photo.name}
                    width={photo.width}
                    height={photo.height}
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
