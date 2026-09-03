import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GI MedPath Pocket Guide",
  description: "A clinician quick reference for advanced IBD therapies and hepatitis B and C management.",
  applicationName: "GI MedPath",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "GI MedPath",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#112f41",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
