import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { Toaster } from 'sonner'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ETrade',
  description: 'Modern e-ticaret platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${geist.className} bg-[#0a0a0a] text-white antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}