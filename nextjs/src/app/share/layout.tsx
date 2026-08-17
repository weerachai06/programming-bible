import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Demo — Programming Bible",
  description: "ลองใช้ System Share ของเบราว์เซอร์/OS เพื่อแชร์หน้านี้",
  openGraph: {
    title: "Share Demo — Programming Bible",
    description: "ลองใช้ System Share ของเบราว์เซอร์/OS เพื่อแชร์หน้านี้",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Programming Bible — Share Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Share Demo — Programming Bible",
    description: "ลองใช้ System Share ของเบราว์เซอร์/OS เพื่อแชร์หน้านี้",
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    ],
  },
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
