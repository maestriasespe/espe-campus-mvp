import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESPE",
  description: "Escuela Superior de Procesos Electorales",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-espe-bg text-espe-text">
        {children}
      </body>
    </html>
  );
}