'use client'

import { useState, useMemo } from 'react'
import { 
  CalculatorIcon, 
  InformationCircleIcon,
  SparklesIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

// Simplified 4th Gen Sil-bi Rates (Sample Data)
const silbiRates: Record<number, { male: number; female: number }> = {
  0: { male: 11000, female: 10500 },
  10: { male: 6000, female: 7000 },
  20: { male: 7500, female: 9500 },
  30: { male: 9000, female: 12000 },
  40: { male: 12000, female: 15500 },
  50: { male: 18000, female: 22000 },
  60: { male: 28000, female: 31000 },
  70: { male: 42000, female: 45000 },
};

export default function SilbiCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [showResult, setShowResult] = useState(false);

  const getAgeGroup = (birth: string) => {
    const today = new Date();
    const b = new Date(birth);
    if (isNaN(b.getTime())) return null;
    const age = today.getFullYear() - b.getFullYear();
    return Math.floor(age / 10) * 10;
  };

  const calculatedPremium = useMemo(() => {
    const ageGroup = getAgeGroup(birthDate);
    if (ageGroup === null) return null;
    const clampedAge = Math.min(Math.max(ageGroup, 0), 70);
    return silbiRates[clampedAge]?.[gender] || 0;
  }, [gender, birthDate]);

  const handleCalculate = () => {
    if (!birthDate) {
      alert('생년월일을 입력해주세요.');
      return;
    }
    setShowResult(true);
  };

  return (
    <div id="silbi-calc" className="scroll-mt-24 mb-16">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-amber-900/5 p-8 border border-amber-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-50" />
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
            <SparklesIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">실비 보험료 계산기</h3>
            <p className="text-xs font-bold text-amber-600/70">4세대 실손의료비 예상 견적</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGender('male')}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all border-2 ${
                gender === 'male' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-inner' : 'bg-gray-50 border-transparent text-gray-400'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              남성
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all border-2 ${
                gender === 'female' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-inner' : 'bg-gray-50 border-transparent text-gray-400'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              여성
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">생년월일</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 transition-all outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-amber-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all active:scale-[0.98]"
          >
            예상 보험료 알아보기
          </button>
        </div>

        {showResult && calculatedPremium && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100 text-center">
              <p className="text-xs font-bold text-amber-600 mb-1">월 예상 납입료</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-black text-amber-600 tracking-tighter">
                  {calculatedPremium.toLocaleString()}
                </span>
                <span className="text-lg font-bold text-amber-600 mt-2">원</span>
              </div>
              <p className="mt-4 text-[10px] text-amber-700/60 font-medium leading-relaxed">
                ※ 위 결과는 4세대 실손의료비 표준 요율을 기준으로 한 예시이며,<br/>
                가입 조건 및 보험사에 따라 실제 보험료와 차이가 날 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
