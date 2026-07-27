import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "格物学院 · 墨韵 | Gewu Academy",
  description: "一座现代数字书院 · A Modern Digital Academy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="antialiased">{children}</body>
    </html>
  );
}
