import "./globals.css";
import type { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "Chat | Sultonoir",
  description: "Chat for everyone",
  generator: "chat,chatting,chatting online,react,nextjs,trpc,mongodb,mysql",
  metadataBase: new URL("https://sultonoir-chat.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },
  openGraph: {
    title: "Chat | Sultonoir",
    description: "Chat for everyone",
    url: "https://sultonoir-chat.vercel.app/",
    siteName: "sultonoir-chat",
    images: [
      {
        url: "https://utfs.io/f/dc1b6057-b75a-4753-b02a-a9dcdec61fd4-8iebad.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://utfs.io/f/dc1b6057-b75a-4753-b02a-a9dcdec61fd4-8iebad.png",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    site: "https://sultonoir-chat.vercel.app/",
    title: "Chat | Sultonoir",
    description: "Chat for everyone",
    images: [
      {
        url: "https://utfs.io/f/dc1b6057-b75a-4753-b02a-a9dcdec61fd4-8iebad.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://utfs.io/f/dc1b6057-b75a-4753-b02a-a9dcdec61fd4-8iebad.png",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
    >
      <body>{children}</body>
    </html>
  );
}
