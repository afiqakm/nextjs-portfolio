import cn from "@/src/Utils/TailwindMerge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Afiq Akmal's Playground",
  description: "My playground for things that I am learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        'bg-slate-800 text-white',
      )}>{children}</body>
    </html >
  );
}
