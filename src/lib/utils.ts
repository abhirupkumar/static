import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function constructMetadata({
  title = "Plura - run your workspace",
  description = "Plura - run your workspace in just aone place",
  image = "/assets/preview.png",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@abhirupkumar",
    },
    metadataBase: new URL("https://zyper.tech"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}