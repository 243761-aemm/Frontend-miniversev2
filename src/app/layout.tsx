import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SeriesFlix - Descubre y reseña tus series favoritas',
  description: 'Comparte tu opinión y descubre qué piensan otros sobre las mejores series del momento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans bg-background text-text-primary`}>
        {children}
      </body>
    </html>
  )
}
