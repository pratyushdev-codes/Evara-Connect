import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "Golden Park Residences",
  description:
    "Resident super-app for Golden Park Residences — services, gate passes, complaints, market and community announcements.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F5EE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream-deep font-sans text-ink antialiased">
        <div className="relative mx-auto min-h-dvh max-w-md bg-cream shadow-[0_0_90px_rgba(34,27,16,0.12)] sm:border-x sm:border-line">
          <main className="pb-32">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
