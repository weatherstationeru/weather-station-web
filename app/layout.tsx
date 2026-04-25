import "./globals.css";
import { LanguageProvider } from "./components/LanguageProvider";

export const metadata = {
  title: "ERU Weather Station",
  description: "Smart IoT Weather Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Outfit + DM Serif (existing) + Cairo (Arabic) */}
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Outfit:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}