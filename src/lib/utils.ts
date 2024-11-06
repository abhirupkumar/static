import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function constructMetadata({
  title = "Static - No Code Website Builder",
  description = "Static - Create Stunning Websites Without Writing Code",
  image = "/assets/logo.png",
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    icons: {
      icon: [
        {
          url: image,
          href: image,
        },
      ],
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          href: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    metadataBase: new URL("https://static.tech"),
  };
}