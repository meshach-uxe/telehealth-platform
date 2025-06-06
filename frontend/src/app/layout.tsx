'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import VoiceNavigationProvider from '../components/VoiceNavigationProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VoiceNavigationProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </VoiceNavigationProvider>
      </body>
    </html>
  )
}
