import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluent — Become fluent in AI",
  description: "5 minutes a day. Role-based. Habit-forming.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
