'use client'

import Link from 'next/link'
import { 
  CalculatorIcon, 
  AdjustmentsHorizontalIcon, 
  PhoneIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  MagnifyingGlassIcon,
  BanknotesIcon,
  GlobeAltIcon
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
            {t('professionalToolkit')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">{t('toolKitTitle')}</h2>
          <p className="text-gray-500 font-bold max-w-xl mx-auto leading-relaxed">
            {t('toolKitDesc')(plannerName)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-8">
          <Link 
            href={`/p/${id}/card/tools/premium`}
            className="group relative bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md md:shadow-xl border border-gray-100 hover:border-primary-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-primary-50 text-primary-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-md shadow-primary-100">
              <CalculatorIcon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xs md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight">{t('premiumCalc')}</h3>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 leading-relaxed hidden md:block">
               {t('premiumCalcDesc')}
            </p>
            <div className="mt-2 md:mt-8 text-primary-600 font-black text-xs hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 2: Silbi Calc */}
          <Link 
            href={`/p/${id}/card/tools/silbi`}
            className="group relative bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md md:shadow-xl border border-gray-100 hover:border-amber-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-amber-50 text-amber-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-md shadow-amber-100">
              <AdjustmentsHorizontalIcon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xs md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight">{t('silbiCalc')}</h3>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 leading-relaxed hidden md:block">
              {t('silbiCalcDesc')}
            </p>
            <div className="mt-2 md:mt-8 text-amber-600 font-black text-xs hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 3: Customer Center */}
          <Link 
            href={`/p/${id}/card/tools/customer-center`}
            className="group relative bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md md:shadow-xl border border-gray-100 hover:border-blue-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-blue-50 text-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md shadow-blue-100">
              <PhoneIcon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xs md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight">{t('customerCenter')}</h3>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 leading-relaxed hidden md:block">
              {t('customerCenterDesc')}
            </p>
            <div className="mt-2 md:mt-8 text-blue-600 font-black text-xs hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 4: 5th Gen Silbi */}
          <Link 
            href={`/p/${id}/card/tools/5th-gen`}
            className="group relative bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md md:shadow-xl border border-gray-100 hover:border-indigo-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-50 text-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-md shadow-indigo-100">
              <DocumentTextIcon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xs md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight">{t('fifthGenSilbi')}</h3>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 leading-relaxed hidden md:block">
              {t('fifthGenSilbiDesc')}
            </p>
            <div className="mt-2 md:mt-8 text-indigo-600 font-black text-xs hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 5: Cancer Treatment */}
          <Link 
            href={`/p/${id}/card/tools/cancer-treatment`}
            className="group relative bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md md:shadow-xl border border-gray-100 hover:border-rose-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-rose-50 text-rose-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-md shadow-rose-100">
              <SparklesIcon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xs md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight">{t('cancerTreatment')}</h3>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 leading-relaxed hidden md:block">
              {t('cancerTreatmentDesc')}
            </p>
            <div className="mt-2 md:mt-8 text-rose-600 font-black text-xs hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 6: Disease Code */}
          <Link 
            href={`/p/${id}/card/tools/disease-code`}
            className="group relative bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md md:shadow-xl border border-gray-100 hover:border-emerald-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-emerald-50 text-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-md shadow-emerald-100">
              <MagnifyingGlassIcon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xs md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight">{t('diseaseCode')}</h3>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 leading-relaxed hidden md:block">
              {t('diseaseCodeDesc')}
            </p>
            <div className="mt-2 md:mt-8 text-emerald-600 font-black text-xs hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 7: Pension Guide */}
          <Link 
            href="/guide/pension"
            className="group relative bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md md:shadow-xl border border-gray-100 hover:border-indigo-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-50 text-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-md shadow-indigo-100">
              <BanknotesIcon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xs md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight">{t('navPension')}</h3>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 leading-relaxed hidden md:block">
              {t('navPensionDesc')}
            </p>
            <div className="mt-2 md:mt-8 text-indigo-600 font-black text-xs hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>

          {/* Tool 8: Critical Illness Relief */}
          <Link 
            href="/guide/critical-illness-relief"
            className="group relative bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md md:shadow-xl border border-gray-100 hover:border-purple-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 bg-purple-50 text-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-md shadow-purple-100">
              <DocumentTextIcon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xs md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight">{t('navCriticalIllness')}</h3>
            <p className="text-[10px] md:text-sm font-bold text-gray-400 leading-relaxed hidden md:block">
               {t('navCriticalIllnessDesc')}
            </p>
            <div className="mt-2 md:mt-8 text-purple-600 font-black text-xs hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('execute')} →
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
