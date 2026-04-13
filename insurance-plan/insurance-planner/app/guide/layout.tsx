import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import ClientAccessGuard from '@/components/ClientAccessGuard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientAccessGuard>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ClientAccessGuard>
  )
}
