import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { EB_Garamond, Inter } from "next/font/google"
import { Providers } from "../components/providers"

import { AuthProvider } from "@/app/context/auth-context"
import ReactQueryProvider from "@/app/lib/react-query-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "jStack App",
  description: "Created using jStack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(inter.variable, eb_garamond.variable)}>
      <body className="min-h-[calc(100vh-1px)] flex flex-col font-sans bg-brand-50 text-brand-950 antialiased">
        <main className="relative flex-1 flex flex-col">
          <ReactQueryProvider>
            <AuthProvider>
              <Providers>{children}</Providers>
            </AuthProvider>
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  )
}
