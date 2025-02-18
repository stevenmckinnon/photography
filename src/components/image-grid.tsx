"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

interface ImageGridProps {
  photos?: {
    url: string;
    name: string;
  }[];
}

export default function ImageGrid({ photos }: ImageGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | undefined>(
    undefined
  );

  if (!photos?.length) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPhoto(undefined);
    }
  };

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mx-auto px-4 max-w-7xl">
        {photos.map((photo, index) => (
          <div key={photo.name} className="break-inside-avoid mb-4">
            <button onClick={() => setSelectedPhoto(index)}>
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-auto rounded-md"
                loading="lazy"
              />
            </button>
          </div>
        ))}
      </div>
      <Dialog open={!!selectedPhoto} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-transparent border-none w-[75%] sm:w-full">
          <DialogTitle className="sr-only">Photo</DialogTitle>
          <Carousel scrollTo={selectedPhoto}>
            <CarouselContent>
              {photos.map((photo) => (
                <CarouselItem key={photo.name} className="w-full h-full">
                  <img src={photo.url} alt={photo.name} />
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
