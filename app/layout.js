import "./globals.css";

export const metadata = {
  title: "PHLEXR | Post it. Prove it. Get rated.",
  description:
    "PHLEXR is a premium social landing page for a black-and-gold app concept built around posting flexes, proving credibility, and getting rated.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
