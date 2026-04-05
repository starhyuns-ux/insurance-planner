'use client'

import React from 'react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function DisclosurePage() {
  const lifeInsurers = [
    { name: '교보생명', url: 'https://www.kyobo.com/dgt/web/product-official/all-product/search' },
    { name: '동양생명', url: 'https://pbano.myangel.co.kr/paging/WE_AC_WEPAAP020100L' },
    { name: '라이나생명', url: 'https://www.lina.co.kr/disclosure/product-public-announcement/product-on-sales?key=0' },
    { name: '메트라이프생명', url: 'https://brand.metlife.co.kr/pn/paReal/insuProductDisclMain.do' },
    { name: '미래에셋생명', url: 'https://life.miraeasset.com/micro/disclosure/product/PC-HO-080301-000000.do' },
    { name: '삼성생명', url: 'https://www.samsunglife.com/individual/products/disclosure/main/PDO-PRPRC010100M' },
    { name: '신한라이프', url: 'https://www.shinhanlife.co.kr/hp/cdhi0030.do' },
    { name: '하나생명', url: 'https://hanalife.co.kr/anm/product/allProduct.do?status=on' },
    { name: '한화생명', url: 'https://www.hanwhalife.com/main/disclosure/goods/disclosurenotice/DF_GDDN000_P10000.do?MENU_ID1=DF_GDGL000' },
    { name: '흥국생명', url: 'https://www.heungkuklife.co.kr/front/public/saleProduct.do?searchFlgSale=Y' },
    { name: '푸본현대생명', url: 'https://www.fubonhyundai.com/#CUSI150102010101' },
    { name: '처브생명', url: 'https://www.chubblife.co.kr/front/official/sale/list.do' },
    { name: 'ABL생명', url: 'https://www.abllife.co.kr/st/pban/prdtPban/whlPrdt/whlPrdt1/whlPrdt11?page=index' },
    { name: 'BNP파리바카디프생명', url: 'https://www.cardif.co.kr/disclosure/papag101.do' },
    { name: 'DB생명', url: 'https://www.idblife.com/notice/product/sale' },
    { name: 'IBK연금보험', url: 'https://www.ibki.co.kr/process/HP_PBANO_PDT_SP_INDV' },
    { name: 'iM생명', url: 'https://www.imlifeins.co.kr/BA/BA_A020.do' },
    { name: 'KB라이프', url: 'https://www.kblife.co.kr/customer-common/productList.do' },
    { name: '농협생명', url: 'https://www.nhlife.co.kr/ho/on/HOON0004M00.nhl' },
    { name: 'KDB생명', url: 'https://www.kdblife.co.kr/ajax.do?scrId=HDLMA002M02P' }
  ]

  const nonLifeInsurers = [
    { name: '삼성화재', url: 'https://www.samsungfire.com/disclosure/product/GD000101.html' },
    { name: 'DB손해보험', url: 'https://www.idb.co.kr/mall/disclosure/product/GD10100M.do' },
    { name: '현대해상', url: 'https://www.hi.co.kr/service/gd/onSaleInsuList.do' },
    { name: 'KB손해보험', url: 'https://www.kbinsure.co.kr/G601010001.ec' },
    { name: '메리츠화재', url: 'https://www.meritzfire.com/front/disclosure/product/PA_PD_01_01_01.do' },
    { name: '한화손해보험', url: 'https://www.hwfire.co.kr/v-disclosure/prod/list.do' },
    { name: '흥국화재', url: 'https://www.heungkukfire.co.kr/front/disclosure/product/PA_DCP010_01_L.do' },
    { name: 'MG손해보험', url: 'https://www.mghfire.co.kr/official/product/onSaleInsuList.do' },
    { name: '롯데손해보험', url: 'https://www.lotteins.co.kr/disclosure/product/announcement/onSale' },
    { name: 'AIG손해보험', url: 'https://www.aig.co.kr/disclosure/on-sale-product' },
    { name: 'AXA손해보험', url: 'https://www.axa.co.kr/m-disclosure/m-product/m-on-sale-product-list' },
    { name: 'NH농협손해보험', url: 'https://www.nhfire.co.kr/disclosure/product/onSaleInsuList.do' }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">상품공시실 (약관 보기)</h3>
            <p className="text-sm font-bold text-gray-500">각 보험사의 상품공시실로 이동하여 쉽게 전체 상품의 상세 약관을 확인하실 수 있습니다.</p>
          </div>
        </div>

        <div className="space-y-12">
          {/* 생명보험 */}
          <div>
            <h4 className="text-lg font-black text-rose-600 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block"></span>
              생명보험
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {lifeInsurers.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm rounded-2xl transition-all group"
                >
                  <span className="font-bold text-gray-700 group-hover:text-rose-700 text-sm whitespace-nowrap">{item.name}</span>
                  <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 group-hover:text-rose-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* 손해보험 */}
          <div>
            <h4 className="text-lg font-black text-blue-600 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
              손해보험
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {nonLifeInsurers.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm rounded-2xl transition-all group"
                >
                  <span className="font-bold text-gray-700 group-hover:text-blue-700 text-sm whitespace-nowrap">{item.name}</span>
                  <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
