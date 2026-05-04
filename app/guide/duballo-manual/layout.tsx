import ClientAccessGuard from '@/components/ClientAccessGuard'

export default function DuballoManualLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientAccessGuard>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ClientAccessGuard>
  )
}
