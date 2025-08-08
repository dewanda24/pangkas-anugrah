import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pangkas Anugrah",
  description: "Aplikasi manajemen pelanggan Pangkas Anugrah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
