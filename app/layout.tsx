import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ESPE Campus",
  description: "Sistema ESPE",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
