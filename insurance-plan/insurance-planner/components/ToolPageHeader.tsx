'use client'

import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/contexts/LanguageContext'

interface ToolPageHeaderProps {
  id: string
  type: 'premium' | 'silbi' | 'customer' | 'fifthGen' | 'cancer' | 'disease'
}

export default function ToolPageHeader({ id, type }: ToolPageHeaderProps) {
  const { t } = useLanguage()

  const labels = {
    premium: {
      title: t('premiumCalculator'),
      desc: t('calculatorDesc')
    },
    silbi: {
      title: t('silbiCalculator'),
      desc: t('silbiDesc')
    },
    customer: {
      title: t('customerCenter'),
      desc: t('customerCenterDesc')
    },
    fifthGen: {
      title: t('fifthGenSilbi'),
      desc: t('fifthGenSilbiDesc')
    },
    cancer: {
      title: t('cancerTreatment'),
      desc: t('cancerTreatmentDesc')
    },
    disease: {
      title: t('diseaseCode'),
      desc: t('diseaseCodeDesc')
    }
  }

  const { title, desc } = labels[type]

  return (
    <>
      <Link href={`/p/${id}/card`} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
        <ArrowLeftIcon className="w-5 h-5" /> {t('backToCard')}
      </Link>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{title}</h1>
        <p className="text-sm font-bold text-gray-400">{desc}</p>
      </div>
    </>
  )
}
