'use client'

import Link from 'next/link'
import { 
  CalculatorIcon, 
  AdjustmentsHorizontalIcon, 
  PhoneIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/lib/contexts/LanguageContext'

interface ToolkitMenuProps {
  id: string
  plannerName: string
}

export default function ToolkitMenu({ id, plannerName }: ToolkitMenuProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border-t border-gray-100 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">
            Professional Toolkit
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">{t('toolKitTitle')}</h2>
          <p className="text-gray-500 font-bold max-w-xl mx-auto leading-relaxed">
            {t('toolKitDesc')(plannerName)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tool 1: Premium Calc */}
          <Link 
            href={`/p/${id}/card/tools/premium`}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-primary-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-primary-100">
              <CalculatorIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{t('premiumCalc')}</h3>
            <p className="text-sm font-bold text-gray-400 leading-relaxed">
               {t('premiumCalcDesc')}
            </p>
            <div className="mt-8 text-primary-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 2: Silbi Calc */}
          <Link 
            href={`/p/${id}/card/tools/silbi`}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-amber-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-amber-100">
              <AdjustmentsHorizontalIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{t('silbiCalc')}</h3>
            <p className="text-sm font-bold text-gray-400 leading-relaxed">
              {t('silbiCalcDesc')}
            </p>
            <div className="mt-8 text-amber-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 3: Customer Center */}
          <Link 
            href={`/p/${id}/card/tools/customer-center`}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-100">
              <PhoneIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{t('customerCenter')}</h3>
            <p className="text-sm font-bold text-gray-400 leading-relaxed">
              {t('customerCenterDesc')}
            </p>
            <div className="mt-8 text-blue-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 4: 5th Gen Silbi */}
          <Link 
            href={`/p/${id}/card/tools/5th-gen`}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-indigo-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-indigo-100">
              <DocumentTextIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{t('fifthGenSilbi')}</h3>
            <p className="text-sm font-bold text-gray-400 leading-relaxed">
              {t('fifthGenSilbiDesc')}
            </p>
            <div className="mt-8 text-indigo-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 5: Cancer Treatment */}
          <Link 
            href={`/p/${id}/card/tools/cancer-treatment`}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-rose-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-rose-100">
              <SparklesIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{t('cancerTreatment')}</h3>
            <p className="text-sm font-bold text-gray-400 leading-relaxed">
              {t('cancerTreatmentDesc')}
            </p>
            <div className="mt-8 text-rose-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 6: Disease Code */}
          <Link 
            href={`/p/${id}/card/tools/disease-code`}
            className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-emerald-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-emerald-100">
              <MagnifyingGlassIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{t('diseaseCode')}</h3>
            <p className="text-sm font-bold text-gray-400 leading-relaxed">
              {t('diseaseCodeDesc')}
            </p>
            <div className="mt-8 text-emerald-600 font-black text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
