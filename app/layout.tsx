import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz do Invocador — League of Legends",
  description: "Joguinho de perguntas sobre League of Legends com ranking de 24h.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Spectral:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
