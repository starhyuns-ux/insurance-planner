import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PlannerBranding from '@/components/PlannerBranding'
import { PhoneIcon, BuildingOffice2Icon, BuildingLibraryIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
    title: '주요 보험사 및 기관 고객센터 연락처 | 보험다이어트',
    description: '국내 주요 손해보험사, 생명보험사 고객센터 번호와 국민건강보험공단 등 유용한 기관 연락처 모음입니다.',
    openGraph: {
        title: '보험사 고객센터 연락처 모음 | 보험다이어트',
        description: '급할 때 바로 찾아 전화할 수 있는 보험사 콜센터 연락처 모음',
        url: 'https://insurance-planner-eosin.vercel.app/contacts',
    }
}

type ContactInfo = {
    name: string
    phone: string
}

const nonLifeInsurances: ContactInfo[] = [
    { name: '삼성화재', phone: '1588-5114' },
    { name: '현대해상', phone: '1588-5656' },
    { name: 'KB손해보험', phone: '1544-0114' },
    { name: 'DB손해보험', phone: '1588-0100' },
    { name: '메리츠화재', phone: '1566-7711' },
    { name: '한화손해보험', phone: '1566-8000' },
    { name: '롯데손해보험', phone: '1588-3344' },
    { name: 'MG손해보험', phone: '1588-5959' },
    { name: '흥국화재', phone: '1688-1688' },
    { name: '하나손해보험', phone: '1566-3000' },
]

const lifeInsurances: ContactInfo[] = [
    { name: '삼성생명', phone: '1588-3114' },
    { name: '교보생명', phone: '1588-1001' },
    { name: '한화생명', phone: '1577-6301' },
    { name: '신한라이프', phone: '1588-5580' },
    { name: 'ABL생명', phone: '1588-6500' },
    { name: 'AIA생명', phone: '1588-9898' },
    { name: '동양생명', phone: '1577-1004' },
    { name: '메트라이프생명', phone: '1588-9600' },
]

const usefulContacts: ContactInfo[] = [
    { name: '손해보험협회', phone: '02-3702-8500' },
    { name: '국민건강보험공단', phone: '1577-1000' },
    { name: '국민연금공단', phone: '1355' },
    { name: '근로복지공단', phone: '1588-0075' },
    { name: '우체국보험', phone: '1599-0100' },
]

function ContactCard({ data, title, icon: Icon, colorClass }: { data: ContactInfo[], title: string, icon: any, colorClass: { bg: string, text: string, border: string, hover: string } }) {
    return (
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
            <div className={`px-6 md:px-8 py-5 flex items-center gap-3 border-b border-gray-100 bg-gray-50/50`}>
                <div className={`p-2 rounded-xl ${colorClass.bg} ${colorClass.text}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item, idx) => (
                    <a 
                        key={idx} 
                        href={`tel:${item.phone.replace(/-/g, '')}`}
                        className={`group flex items-center justify-between p-4 rounded-2xl border ${colorClass.border} hover:shadow-md transition-all duration-200 ${colorClass.hover}`}
                    >
                        <span className="font-semibold text-gray-800 text-lg group-hover:text-gray-900 transition-colors">
                            {item.name}
                        </span>
                        <div className={`flex items-center gap-2 font-bold ${colorClass.text} bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100`}>
                            <PhoneIcon className="w-4 h-4" />
                            {item.phone}
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}

export default function ContactsPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <NavBar />

            {/* Header Section */}
            <header className="bg-primary-900 text-white flex items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-800 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container max-w-5xl relative z-10 py-16 md:py-20">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-800/80 backdrop-blur-sm text-primary-200 text-sm font-bold tracking-wide mb-6 border border-primary-700/50">
                        빠른 연락망
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight break-keep">
                        급할 때 바로 찾는<br className="hidden md:block" />
                        <span className="text-primary-200">고객센터 연락처</span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 opacity-90 max-w-2xl leading-relaxed break-keep">
                        스마트폰에서 번호를 터치하시면 즉각 전화 통화로 연결됩니다. 궁금한 점이 있거나 청구가 필요할 때 쉽고 빠르게 연결하세요.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="container max-w-5xl -mt-8 px-4 mb-24 relative z-20">
                
                <ContactCard 
                    title="주요 손해보험사" 
                    data={nonLifeInsurances} 
                    icon={BriefcaseIcon}
                    colorClass={{ bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100/50', hover: 'hover:border-blue-300 hover:bg-blue-50/30' }}
                />

                <ContactCard 
                    title="주요 생명보험사" 
                    data={lifeInsurances} 
                    icon={BuildingOffice2Icon}
                    colorClass={{ bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100/50', hover: 'hover:border-emerald-300 hover:bg-emerald-50/30' }}
                />

                <ContactCard 
                    title="기타 유용한 관련 기관" 
                    data={usefulContacts} 
                    icon={BuildingLibraryIcon}
                    colorClass={{ bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100/50', hover: 'hover:border-purple-300 hover:bg-purple-50/30' }}
                />

            </div>

            <PlannerBranding />
            <Footer />
        </main>
    )
}
