import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "Helpana Admin Panel",
  description: "Admin panel for Helpana",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-full">
          <Sidebar />
          <main className="flex-1 bg-white min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}