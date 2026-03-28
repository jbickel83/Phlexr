import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://phlexr.com"),
  title: "PHLEXR",
  description: "Flex. Verify. Expose.",
  verification: {
    google: "h9N7agUa5jYfJZlFXSktJin_dUCgnVy_pmoLPafuAb4",
  },
  openGraph: {
    title: "PHLEXR",
    description: "Flex. Verify. Expose.",
    url: "https://phlexr.com",
    siteName: "PHLEXR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PHLEXR luxury hero image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PHLEXR",
    description: "Flex. Verify. Expose.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
