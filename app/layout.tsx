import Sidebar from "@/components/Sidebar";
import "../styles/globals.css"; // pastikan ada file ini

export const metadata = {
  title: "Pangkas Anugrah",
  description: "Dashboard pencatatan pelanggan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </body>
    </html>
  );
}
