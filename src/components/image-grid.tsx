"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";

import NextImage from "@/components/image";
import { imageSortOrder } from "@/data/sortOrder";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import useBreakpoint from "@/hooks/useBreakpoints";

type Image = {
  name: string;
  url: string;
};

export default function ImageGrid() {
  const [photos, setPhotos] = useState<Image[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number>(-1);
  const [bottomRowIndices, setBottomRowIndices] = useState<number[]>([]);
  const { isBelowMd } = useBreakpoint("md");

  useEffect(() => {
    const fetchPhotos = async () => {
      const response = await fetch(`/api/images`);
      const data = await response?.json();
      const photos: Image[] = data.images;

      setPhotos(photos);
    };

    fetchPhotos();
  }, []);

  const sortedPhotos = useMemo(() => {
    return imageSortOrder
      ? [...photos].sort((a, b) => {
          const aIndex = imageSortOrder.indexOf(a.name);
          const bIndex = imageSortOrder.indexOf(b.name);

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
      : photos;
  }, [photos]);

  useEffect(() => {
    const detectBottomRow = () => {
      if (isBelowMd) return;
      const container = document.querySelector("ul");
      if (!container) return;

      const items = container.querySelectorAll("li");
      const bottomIndices: number[] = [];
      let lastBottom = 0;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom > lastBottom) {
          bottomIndices.length = 0;
          lastBottom = rect.bottom;
        }
        if (Math.abs(rect.bottom - lastBottom) < 1) {
          bottomIndices.push(index);
        }
      });

      setBottomRowIndices(bottomIndices);
    };

    // Add a small delay to ensure images have had a chance to layout
    const timeoutId = setTimeout(detectBottomRow, 500);

    // Add resize listener
    const handleResize = debounce(detectBottomRow, 100);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [sortedPhotos, isBelowMd]);

  function debounce(fn: Function, ms: number) {
    let timer: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  if (!photos?.length)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPhoto(-1);
    }
  };

  return (
    <>
      <ul className="flex flex-wrap gap-1">
        {sortedPhotos.map((photo, index) => (
          <NextImage
            key={photo.name}
            image={photo}
            index={index}
            bottomRowIndices={bottomRowIndices}
            setSelectedPhoto={setSelectedPhoto}
          />
        ))}
      </ul>

      <Dialog open={selectedPhoto > -1} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-transparent border-none max-w-[90vw] max-h-[90vh]">
          <DialogTitle className="sr-only">Photo</DialogTitle>
          <Carousel scrollTo={selectedPhoto}>
            <CarouselContent>
              {sortedPhotos.map((photo) => (
                <CarouselItem
                  key={photo.name}
                  className="flex items-center justify-center"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
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
