import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "b2bcorpcom admin",
  description: "Operator-only admin (per PLAN.md D15)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
