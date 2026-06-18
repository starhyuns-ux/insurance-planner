'use client'

import React from 'react'
import { INSURANCE_COMPANIES } from '@/lib/constants/insurance'
import { PhoneIcon, PrinterIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function ClaimFaxList() {
  const companies = Object.entries(INSURANCE_COMPANIES)
  const nonLife = companies.filter(([_, info]) => !_.includes('생명') && !_.includes('라이프'))
  const life = companies.filter(([_, info]) => _.includes('생명') || _.includes('라이프'))

  const CompanyCard = ([name, info]: [string, any]) => (
    <div key={name} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-gray-900 text-sm">{name}</h4>
        {info.callFirst && (
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ExclamationCircleIcon className="w-3 h-3" /> 콜센터 문의필요
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold">{info.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <PrinterIcon className="w-3.5 h-3.5 text-primary-500" />
          {info.fax ? (
            <span className="font-black text-gray-900">{info.fax}</span>
          ) : (
            <span className="text-gray-400 font-medium italic">가상팩스 발급필요</span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-8 px-4 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-gray-900">보험사별 보상청구 연락처</h2>
        <p className="text-gray-500 text-sm font-medium">팩스 접수 시 보험사별 번호를 확인해 주세요.</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <span className="w-2 h-4 rounded-full bg-blue-500" />
            <h3 className="font-black text-gray-900">손해보험사</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nonLife.map(CompanyCard)}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <span className="w-2 h-4 rounded-full bg-rose-500" />
            <h3 className="font-black text-gray-900">생명보험사</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {life.map(CompanyCard)}
          </div>
        </section>
      </div>

      <div className="bg-gray-100 p-5 rounded-2xl border border-gray-200">
        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
          <strong className="text-gray-700">※ 주의사항:</strong> 일부 보험사는 보안 정책상 고정 팩스번호를 운영하지 않으며, 콜센터에 전화하여 일회용 '가상 팩스번호'를 발급받아야 접수가 가능합니다. 팩스 전송 전 반드시 해당 보험사 고객센터를 통해 접수 가능 여부를 확인하시기 바랍니다.
        </p>
      </div>
    </div>
  )
}
