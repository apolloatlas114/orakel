import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Global Oracle Platform | Predict the Future",
  description: "The world's most advanced prediction platform. Harness collective intelligence through market, oracle, and crowd wisdom.",
  keywords: ["predictions", "oracle", "forecasting", "betting", "crypto", "market analysis"],
  authors: [{ name: "Global Oracle Platform" }],
  openGraph: {
    title: "Global Oracle Platform",
    description: "Predict the Future with Triple-Quote Intelligence",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        <div className="relative min-h-screen grid-pattern">
          <div className="noise-overlay" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
