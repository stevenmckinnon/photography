import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { promises as fs } from "fs";
import path from "path";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  let currentDate = new Date().getTime();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date).getTime();
  let timeDifference = Math.abs(currentDate - targetDate);
  let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  let fullDate = new Date(date).toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (daysAgo < 1) {
    return "Today";
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo}d ago)`;
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo}w ago)`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo}mo ago)`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${fullDate} (${yearsAgo}y ago)`;
  }
}

export function calculateYearsOfExperience(): number {
  const startDate = new Date("2014-06-01");
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - startDate.getTime();

  // Calculate the difference in years.  Note that this doesn't account for
  // whether the person has had their birthday yet this year.  See the more
  // robust version below for that.
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25)); // Accounts for leap years
}

export async function getImages() {
  try {
    const imagesDirectory = path.join(process.cwd(), "public/images");

    // Check if directory exists
    try {
      await fs.access(imagesDirectory);
    } catch {
      console.log("Images directory does not exist");
      return [];
    }

    const imageFiles = await fs.readdir(imagesDirectory);

    const images = imageFiles
      .filter((file) => {
        const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        return validExtensions.some((ext) => file.toLowerCase().endsWith(ext));
      })
      .map((file) => ({
        name: file,
        url: `/images/${file}`,
      }));

    return images;
  } catch (error) {
    console.error("Error reading images directory:", error);
    return [];
  }
}
