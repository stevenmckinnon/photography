"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import useBreakpoint from "@/hooks/useBreakpoints";

type Image = {
  name: string;
  url: string;
  imageUrl: string;
  webpUrl?: string | null;
  hasWebP?: boolean;
};

export default function ImageGrid() {
  const [photos, setPhotos] = useState<Image[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number>(-1);
  const [bottomRowIndices, setBottomRowIndices] = useState<number[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const { isBelowMd } = useBreakpoint("md");

  // Increment loaded images counter
  const handleImageLoaded = useCallback(() => {
    setImagesLoaded(count => count + 1);
  }, []);

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
          // Find the first sortOrder entry that includes this image name
          const aIndex = imageSortOrder.findIndex(sortName => 
            a.name.includes(sortName) || sortName.includes(a.name)
          );
          const bIndex = imageSortOrder.findIndex(sortName => 
            b.name.includes(sortName) || sortName.includes(b.name)
          );

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

  const detectBottomRow = useCallback(() => {
    if (isBelowMd) return;
    
    const container = document.querySelector("ul");
    if (!container) return;

    const items = container.querySelectorAll("li");
    if (!items.length) return;

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
  }, [isBelowMd]);

  // Run on initial load
  useEffect(() => {
    const timeoutId = setTimeout(detectBottomRow, 1000);
    return () => clearTimeout(timeoutId);
  }, [detectBottomRow]);

  // Run when all images have loaded
  useEffect(() => {
    if (imagesLoaded > 0 && imagesLoaded >= sortedPhotos.length) {
      setTimeout(detectBottomRow, 300);
    }
  }, [imagesLoaded, sortedPhotos.length, detectBottomRow]);

  // Add resize listener
  useEffect(() => {
    const handleResize = debounce(detectBottomRow, 200);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [detectBottomRow]);

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

  const getImageUrl = (url: string, width = 800) => {
    try {
      // If it's already a full URL with http/https, use it directly
      if (url.startsWith('http')) {
        return url;
      }
      
      // Otherwise, extract just the filename and use our API
      const filename = url.includes("/") ? url.split("/").pop() || url : url;
      const encodedPath = encodeURIComponent(filename);
      return `/api/images/${encodedPath}?width=${width}&quality=85`;
    } catch (e) {
      console.error("Error formatting image URL:", e);
      return url; // Fallback to original URL
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
            onImageLoaded={handleImageLoaded}
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
                  <picture>
                    {photo.webpUrl && (
                      <source srcSet={photo.webpUrl} type="image/webp" />
                    )}
                    <img
                      src={photo.imageUrl || getImageUrl(photo.url)}
                      alt={photo.name}
                      className="max-w-full max-h-[85vh] object-contain"
                    />
                  </picture>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <DialogDescription className="sr-only">
            {sortedPhotos?.[selectedPhoto]?.name}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
