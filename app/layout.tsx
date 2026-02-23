import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-espe-bg text-espe-text">
        {children}
      </body>
    </html>
  );
}
