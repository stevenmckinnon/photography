"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

interface ImageWithDimensions {
  url: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: "landscape" | "portrait";
}

interface ImageProps {
  image: {
    imageUrl: string;
    url: string;
    name: string;
  };
  index: number;
  bottomRowIndices: number[];
  setSelectedPhoto: (index: number) => void;
  onImageLoaded?: () => void;
}

export default function Images({
  image,
  index,
  bottomRowIndices,
  setSelectedPhoto,
  onImageLoaded,
}: ImageProps) {
  const [processedImage, setProcessedImage] =
    useState<ImageWithDimensions | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(image.imageUrl || "");
  
  // Function to refresh the image URL if needed
  const refreshImageUrl = useCallback(async () => {
    // If the URL is a presigned URL and it's failing, get a new one
    if (imageUrl.includes('X-Amz-Expires') && !isLoaded) {
      try {
        // Extract the key from the URL or use the original key
        const key = image.url;
        // Use our API endpoint to get a fresh URL
        const response = await fetch(`/api/images/refresh?key=${encodeURIComponent(key)}`);
        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.url);
        }
      } catch (error) {
        console.error("Failed to refresh image URL:", error);
        // Fallback to our image processing API
        setImageUrl(getImageUrl(image.url));
      }
    }
  }, [image.url, imageUrl, isLoaded]);

  // Update the URL generation function to handle paths more robustly
  const getImageUrl = (url: string, width = 500) => {
    try {
      // If it's already a full URL, extract just the filename
      const filename = url.includes("/") ? url.split("/").pop() || url : url;
      const encodedPath = encodeURIComponent(filename);
      return `/api/images/${encodedPath}?width=${width}&quality=80`;
    } catch (e) {
      console.error("Error formatting image URL:", e);
      return url; // Fallback to original URL
    }
  };

  useEffect(() => {
    const loadImageDimensions = async () => {
      const loadImage = () =>
        new Promise<ImageWithDimensions>((resolve, reject) => {
          const img = new Image();
          
          img.onload = () => {
            resolve({
              url: imageUrl,
              name: image.name,
              width: img.width,
              height: img.height,
              aspectRatio: img.width > img.height ? "landscape" : "portrait",
            });
            setIsLoaded(true);
          };
          
          img.onerror = () => {
            // If image fails to load, try to refresh the URL
            refreshImageUrl();
            reject(new Error("Failed to load image"));
          };
          
          img.src = imageUrl;
        });

      try {
        const processedImage = await loadImage();
        setProcessedImage(processedImage);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    if (imageUrl) {
      loadImageDimensions();
    } else {
      // If no imageUrl is available, use our API
      setImageUrl(getImageUrl(image.url));
    }
  }, [imageUrl, refreshImageUrl, image.name, image.url]);

  // Add this to the onLoad handler
  const handleImageLoaded = () => {
    setIsLoaded(true);
    onImageLoaded?.();  // Call the callback when image loads
  };

  if (!processedImage) {
    return (
      <li className="grow w-full h-[300px] animate-pulse bg-gray-100/10 rounded-sm" />
    );
  }

  return (
    <li
      key={processedImage.name}
      className={`grow w-full h-auto ${
        processedImage.aspectRatio === "landscape"
          ? "sm:h-[300px] sm:w-[400px]"
          : "sm:h-[300px] sm:w-[200px]"
      } ${bottomRowIndices.includes(index) ? "!grow-0" : ""}`}
    >
      <button
        onClick={() => setSelectedPhoto(index)}
        className="h-full w-full"
        aria-label={`View ${processedImage.name}`}
        role="button"
      >
        <img
          src={processedImage.url}
          width={processedImage.width}
          height={processedImage.height}
          alt={processedImage.name}
          data-loaded={isLoaded}
          onLoad={handleImageLoaded}  // Updated handler
          onError={() => refreshImageUrl()}
          className={cn(
            "h-full w-full max-h-full min-w-full object-cover align-bottom hover:opacity-90 transition-opacity rounded-sm",
            "data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10"
          )}
        />
      </button>
    </li>
  );
}
