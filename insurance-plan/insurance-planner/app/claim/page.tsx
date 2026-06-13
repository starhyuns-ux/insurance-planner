import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import DetailedClaimForm from '@/components/DetailedClaimForm'
import ClientAccessGuard from '@/components/ClientAccessGuard'
import ClaimFaxList from '@/components/ClaimFaxList'

export const metadata: Metadata = {
    title: '보험 보상청구 신청 | 인슈닷',
    description: '간편하고 안전하게 보험 보상청구 서류를 접수하세요. 담당 설계사가 확인 후 즉시 처리해 드립니다.',
    robots: {
        index: false,
        follow: false,
    }
}

export default function ClaimPage() {
    return (
        <ClientAccessGuard>
            <main className="min-h-screen bg-gray-50 flex flex-col pt-16">
                <NavBar />
                <div className="flex-1 container mx-auto px-4 py-8 lg:py-12">
                    <DetailedClaimForm />
                    <ClaimFaxList />
                </div>
                <Footer />
            </main>
        </ClientAccessGuard>
    )
}
