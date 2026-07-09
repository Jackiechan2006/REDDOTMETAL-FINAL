import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Red Dot Metals",
  description: "Singapore's trusted B2B scrap metal recycling and trading company.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className="antialiased">{children}</body>
    </html>
  )
}
