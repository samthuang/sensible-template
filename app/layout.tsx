import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs'
import { Provider as JotaiProvider } from 'jotai'
import { AuthProvider } from '@/app/lib/auth/client'
import { fetchCurrentUser } from './lib/auth/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'A Sensible Template',
  description: 'Generated by from a Sensible Template',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await fetchCurrentUser()

  return (
    <ClerkProvider dynamic afterSignOutUrl="/">
      <JotaiProvider>
        <AuthProvider user={user} />
        <html lang="en">
          <body className={inter.className}>
            <header>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </body>
        </html>
      </JotaiProvider>
    </ClerkProvider>
  )
}
