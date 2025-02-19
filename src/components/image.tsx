import { cn } from "@/lib/utils";
import Image, { ImageProps as NextImageProps } from "next/image";

export default function Images({ className, ...props }: NextImageProps) {
  return (
    <Image
      {...props}
      data-loaded="false"
      onLoad={(event) => {
        event.currentTarget.setAttribute("data-loaded", "true");
      }}
      className={cn(
        className,
        "data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10"
      )}
    />
  );
}
