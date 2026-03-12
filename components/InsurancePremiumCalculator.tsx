'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  UserIcon, 
  CalendarIcon, 
  BanknotesIcon, 
  CalculatorIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  HeartIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

// --- Rate Tables ---

const cancerRateTable: Record<number, { male: number; female: number }> = {
  0:{male:4500,female:4500},1:{male:4520,female:4520},2:{male:4540,female:4540},3:{male:4560,female:4560},
  4:{male:4580,female:4580},5:{male:4600,female:4600},6:{male:4620,female:4620},7:{male:4640,female:4640},
  8:{male:4660,female:4660},9:{male:4680,female:4680},10:{male:4700,female:4700},11:{male:4720,female:4720},
  12:{male:4740,female:4740},13:{male:4760,female:4760},14:{male:4780,female:4780},15:{male:4800,female:4800},
  16:{male:4820,female:4820},17:{male:4840,female:4840},18:{male:4860,female:4860},19:{male:4880,female:4880},
  20:{male:4900,female:5020},21:{male:6300,female:6370},22:{male:6420,female:6510},23:{male:6540,female:6650},
  24:{male:6660,female:6790},25:{male:6780,female:6930},26:{male:6900,female:7070},27:{male:7020,female:7210},
  28:{male:7140,female:7350},29:{male:7260,female:7490},30:{male:7380,female:7630},31:{male:7500,female:7770},
  32:{male:7620,female:7910},33:{male:7740,female:8050},34:{male:7860,female:8190},35:{male:7980,female:8330},
  36:{male:8100,female:8470},37:{male:8220,female:8610},38:{male:8340,female:8750},39:{male:8460,female:8890},
  40:{male:8580,female:9030},41:{male:8940,female:9170},42:{male:9300,female:9430},43:{male:9660,female:9750},
  44:{male:10020,female:10070},45:{male:10380,female:10390},46:{male:10740,female:10710},47:{male:11100,female:11030},
  48:{male:11460,female:11350},49:{male:11820,female:11670},50:{male:12180,female:11990},51:{male:12540,female:12310},
  52:{male:12900,female:12630},53:{male:13260,female:12950},54:{male:13620,female:13270},55:{male:13980,female:13590},
  56:{male:14340,female:13910},57:{male:14700,female:14230},58:{male:15060,female:14550},59:{male:15420,female:14870},
  60:{male:15780,female:15190},61:{male:16140,female:15510},62:{male:16500,female:15830},63:{male:16860,female:16150},
  64:{male:17220,female:16470},65:{male:17580,female:16790},66:{male:17940,female:17110},67:{male:18300,female:17430},
  68:{male:18660,female:17750},69:{male:19020,female:18070},70:{male:19380,female:18390}
};

const brainRateTable: Record<number, { male: number; female: number }> = {
  0:{male:3000,female:3200},1:{male:3000,female:3200},2:{male:3000,female:3200},3:{male:3000,female:3200},
  4:{male:3000,female:3200},5:{male:3000,female:3200},6:{male:3000,female:3200},7:{male:3000,female:3200},
  8:{male:3000,female:3200},9:{male:3000,female:3200},10:{male:3000,female:3200},11:{male:3560,female:3600},
  12:{male:3730,female:3770},13:{male:3900,female:3940},14:{male:4070,female:4110},15:{male:4240,female:4280},
  16:{male:4410,female:4450},17:{male:4580,female:4620},18:{male:4750,female:4790},19:{male:4920,female:4960},
  20:{male:5090,female:5130},21:{male:5700,female:5830},22:{male:5750,female:5900},23:{male:5800,female:5970},
  24:{male:5850,female:6040},25:{male:5900,female:6110},26:{male:5950,female:6180},27:{male:6000,female:6250},
  28:{male:6050,female:6320},29:{male:6100,female:6390},30:{male:6150,female:6460},31:{male:6200,female:6530},
  32:{male:6250,female:6600},33:{male:6300,female:6670},34:{male:6350,female:6740},35:{male:6400,female:6810},
  36:{male:6450,female:6880},37:{male:6500,female:6950},38:{male:6550,female:7020},39:{male:6600,female:7090},
  40:{male:6650,female:7160},41:{male:6700,female:7230},42:{male:6900,female:7300},43:{male:7100,female:7370},
  44:{male:7300,female:7440},45:{male:7500,female:7600},46:{male:7700,female:7810},47:{male:7900,female:8020},
  48:{male:8100,female:8230},49:{male:8300,female:8440},50:{male:8500,female:8650},51:{male:8700,female:8860},
  52:{male:8900,female:9070},53:{male:9100,female:9280},54:{male:9300,female:9490},55:{male:9500,female:9700},
  56:{male:9700,female:9910},57:{male:9900,female:10120},58:{male:10100,female:10330},59:{male:10300,female:10540},
  60:{male:10500,female:10750},61:{male:10700,female:10960},62:{male:10900,female:11170},63:{male:11100,female:11380},
  64:{male:11300,female:11590},65:{male:11500,female:11800},66:{male:11700,female:12010},67:{male:11900,female:12220},
  68:{male:12100,female:12430},69:{male:12300,female:12640},70:{male:12500,female:12850}
};

const heartRateTable: Record<number, { male: number; female: number }> = {
  0:{male:1400,female:1600},1:{male:1400,female:1600},2:{male:1400,female:1600},3:{male:1400,female:1600},
  4:{male:1400,female:1600},5:{male:1400,female:1600},6:{male:1400,female:1600},7:{male:1400,female:1600},
  8:{male:1400,female:1600},9:{male:1400,female:1600},10:{male:1400,female:1600},11:{male:1400,female:1600},
  12:{male:1400,female:1600},13:{male:1400,female:1600},14:{male:1600,female:1800},15:{male:1600,female:1800},
  16:{male:1600,female:1800},17:{male:1600,female:1800},18:{male:1600,female:1800},19:{male:1600,female:1800},
  20:{male:1600,female:1800},21:{male:1640,female:1850},22:{male:1680,female:1900},23:{male:1720,female:1950},
  24:{male:1760,female:2000},25:{male:1800,female:2050},26:{male:1840,female:2100},27:{male:1880,female:2150},
  28:{male:1920,female:2200},29:{male:1960,female:2250},30:{male:2000,female:2300},31:{male:2040,female:2350},
  32:{male:2080,female:2400},33:{male:2120,female:2450},34:{male:2160,female:2500},35:{male:2200,female:2550},
  36:{male:2240,female:2600},37:{male:2280,female:2650},38:{male:2320,female:2700},39:{male:2360,female:2750},
  40:{male:2400,female:2800},41:{male:2440,female:2850},42:{male:2480,female:2900},43:{male:2520,female:2950},
  44:{male:2560,female:3000},45:{male:2600,female:3050},46:{male:2640,female:3100},47:{male:2680,female:3150},
  48:{male:2720,female:3200},49:{male:2760,female:3250},50:{male:2800,female:3300},51:{male:2840,female:3350},
  52:{male:2880,female:3400},53:{male:2920,female:3450},54:{male:2960,female:3500},55:{male:3000,female:3550},
  56:{male:3040,female:3600},57:{male:3080,female:3650},58:{male:3120,female:3700},59:{male:3160,female:3750},
  60:{male:3200,female:3800},61:{male:3240,female:3850},62:{male:3280,female:3900},63:{male:3320,female:3950},
  64:{male:3360,female:4000},65:{male:3400,female:4050},66:{male:3440,female:4100},67:{male:3480,female:4150},
  68:{male:3520,female:4200},69:{male:3560,female:4250},70:{male:3600,female:4300}
};

const injurySurgeryRateTable: Record<number, { male: number; female: number }> = {
  0:{male:2200,female:2300}, 1:{male:2230,female:2330}, 2:{male:2260,female:2360}, 3:{male:2280,female:2390},
  4:{male:2310,female:2420}, 5:{male:2340,female:2450}, 6:{male:2370,female:2480}, 7:{male:2390,female:2510},
  8:{male:2420,female:2540}, 9:{male:2450,female:2570}, 10:{male:2480,female:2600}, 11:{male:2500,female:2620},
  12:{male:2530,female:2650}, 13:{male:2560,female:2680}, 14:{male:2590,female:2710}, 15:{male:2610,female:2720},
  16:{male:2640,female:2730}, 17:{male:2670,female:2740}, 18:{male:2700,female:2745}, 19:{male:2720,female:2748},
  20:{male:2750,female:2750},
  21:{male:3400,female:3500}, 22:{male:3540,female:3630}, 23:{male:3680,female:3760}, 24:{male:3820,female:3890},
  25:{male:3960,female:4020}, 26:{male:4100,female:4150}, 27:{male:4240,female:4280}, 28:{male:4380,female:4410},
  29:{male:4540,female:4550}, 30:{male:4700,female:4700},
  31:{male:4750,female:4800}, 32:{male:4800,female:4850}, 33:{male:4850,female:4900}, 34:{male:4900,female:4950},
  35:{male:4950,female:5000}, 36:{male:5000,female:5050}, 37:{male:5050,female:5100}, 38:{male:5150,female:5170},
  39:{male:5220,female:5230}, 40:{male:5300,female:5300},
  41:{male:5300,female:5380}, 42:{male:5380,female:5460}, 43:{male:5460,female:5540}, 44:{male:5540,female:5620},
  45:{male:5620,female:5700}, 46:{male:5700,female:5780}, 47:{male:5780,female:5860}, 48:{male:5860,female:5940},
  49:{male:5980,female:6020}, 50:{male:6100,female:6100},
  51:{male:6100,female:6190}, 52:{male:6190,female:6280}, 53:{male:6280,female:6370}, 54:{male:6370,female:6460},
  55:{male:6460,female:6550}, 56:{male:6550,female:6640}, 57:{male:6640,female:6730}, 58:{male:6760,female:6820},
  59:{male:6880,female:6910}, 60:{male:7000,female:7000},
  61:{male:7500,female:7500}, 62:{male:7500,female:7500}, 63:{male:7500,female:7500}, 64:{male:7500,female:7500},
  65:{male:7500,female:7500}, 66:{male:7500,female:7500}, 67:{male:7500,female:7500}, 68:{male:7500,female:7500},
  69:{male:7500,female:7500}, 70:{male:7500,female:7500}
};

const diseaseSurgeryRateTable: Record<number, { male: number; female: number }> = {
  0:{male:5730,female:5730}, 1:{male:5970,female:5970}, 2:{male:6210,female:6210}, 3:{male:6450,female:6450},
  4:{male:6700,female:6700}, 5:{male:6940,female:6940}, 6:{male:7180,female:7180}, 7:{male:7420,female:7420},
  8:{male:7660,female:7660}, 9:{male:7900,female:7900}, 10:{male:8140,female:8140}, 11:{male:8390,female:8390},
  12:{male:8630,female:8630}, 13:{male:8870,female:8870}, 14:{male:9110,female:9110}, 15:{male:9350,female:9350},
  16:{male:9590,female:9590}, 17:{male:9840,female:9840}, 18:{male:10080,female:10080}, 19:{male:10320,female:10320},
  20:{male:10560,female:10560},
  21:{male:10960,female:10960}, 22:{male:11370,female:11370}, 23:{male:11770,female:11770}, 24:{male:12180,female:12180},
  25:{male:12580,female:12580}, 26:{male:12980,female:12980}, 27:{male:13390,female:13390}, 28:{male:13790,female:13790},
  29:{male:14200,female:14200}, 30:{male:14600,female:14600}, 31:{male:15010,female:15010}, 32:{male:15420,female:15420},
  33:{male:15830,female:15830}, 34:{male:16240,female:16240}, 35:{male:16650,female:16650}, 36:{male:17060,female:17060},
  37:{male:17470,female:17470}, 38:{male:17880,female:17880}, 39:{male:18290,female:18290}, 40:{male:18700,female:18700},
  41:{male:19110,female:19110}, 42:{male:19520,female:19520}, 43:{male:19930,female:19930}, 44:{male:20340,female:20340},
  45:{male:20750,female:20750}, 46:{male:21160,female:21160}, 47:{male:21570,female:21570}, 48:{male:21980,female:21980},
  49:{male:22390,female:22390}, 50:{male:22800,female:22800},
  51:{male:24000,female:24000}, 52:{male:24000,female:24000}, 53:{male:24000,female:24000}, 54:{male:24000,female:24000},
  55:{male:24000,female:24000}, 56:{male:24000,female:24000}, 57:{male:24000,female:24000}, 58:{male:24000,female:24000},
  59:{male:24000,female:24000}, 60:{male:24000,female:24000},
  61:{male:32000,female:32000}, 62:{male:32000,female:32000}, 63:{male:32000,female:32000}, 64:{male:32000,female:32000},
  65:{male:32000,female:32000}, 66:{male:32000,female:32000}, 67:{male:32000,female:32000}, 68:{male:32000,female:32000},
  69:{male:32000,female:32000}, 70:{male:32000,female:32000}
};

const BASE_AMOUNT_MANWON = 1000;

// --- Helper Functions ---

function getInsuranceAge(birthDateStr: string): number | null {
  const today = new Date();
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return null;

  let age = today.getFullYear() - birth.getFullYear();
  const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

  if (today < thisYearBirthday) age--;

  const halfBirthday = new Date(thisYearBirthday);
  halfBirthday.setMonth(halfBirthday.getMonth() + 6);

  return today >= halfBirthday ? age + 1 : age;
}

function calcPremium(amountManwon: number, premiumPer1000: number): number {
  return (amountManwon / BASE_AMOUNT_MANWON) * premiumPer1000;
}

function formatMoney(value: number): string {
  return Math.round(value).toLocaleString('ko-KR') + '원';
}

// --- Component ---

export default function InsurancePremiumCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState<string>('');
  const [cancerAmount, setCancerAmount] = useState<number>(5000);
  const [brainAmount, setBrainAmount] = useState<number>(2000);
  const [heartAmount, setHeartAmount] = useState<number>(2000);
  const [injurySurgeryAmount, setInjurySurgeryAmount] = useState<number>(1500);
  const [diseaseSurgeryAmount, setDiseaseSurgeryAmount] = useState<number>(2000);
  
  const [isCalculated, setIsCalculated] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const insuranceAge = useMemo(() => getInsuranceAge(birthDate), [birthDate]);

  const results = useMemo(() => {
    if (insuranceAge === null || insuranceAge < 0 || insuranceAge > 70) return null;

    const premiums = {
      cancer: calcPremium(cancerAmount, cancerRateTable[insuranceAge][gender]),
      brain: calcPremium(brainAmount, brainRateTable[insuranceAge][gender]),
      heart: calcPremium(heartAmount, heartRateTable[insuranceAge][gender]),
      injurySurgery: calcPremium(injurySurgeryAmount, injurySurgeryRateTable[insuranceAge][gender]),
      diseaseSurgery: calcPremium(diseaseSurgeryAmount, diseaseSurgeryRateTable[insuranceAge][gender]),
    };

    const total = Object.values(premiums).reduce((acc, curr) => acc + curr, 0);

    return {
      premiums,
      total,
      age: insuranceAge,
      genderLabel: gender === 'male' ? '남성' : '여성'
    };
  }, [gender, insuranceAge, cancerAmount, brainAmount, heartAmount, injurySurgeryAmount, diseaseSurgeryAmount]);

  const handleCalculate = () => {
    if (!birthDate) {
      alert('생년월일을 입력해 주세요.');
      return;
    }
    if (insuranceAge === null || insuranceAge < 0 || insuranceAge > 70) {
      alert('보험 가능 연령(0~70세)이 아닙니다.');
      return;
    }
    
    setIsCalculated(true);
    setShowResults(true);
    
    // Scroll to results
    setTimeout(() => {
      const element = document.getElementById('calculation-results');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleReset = () => {
    setShowResults(false);
    setIsCalculated(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Inputs */}
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CalculatorIcon className="w-6 h-6 text-primary-600" />
              가입 정보 입력
            </h2>
            
            <div className="space-y-6">
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">성별</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all border-2 ${
                      gender === 'male' 
                        ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' 
                        : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    남성
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all border-2 ${
                      gender === 'female' 
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm' 
                        : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    여성
                  </button>
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  생년월일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl text-gray-900 font-medium transition-all outline-none"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                {insuranceAge !== null && insuranceAge >= 0 && (
                  <p className="mt-2 text-sm font-medium text-primary-600 ml-1">
                    보험나이: {insuranceAge}세
                  </p>
                )}
              </div>

              <div className="h-px bg-gray-100 my-2" />

              {/* Coverage Amounts */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">보장 금액 설정 (만원)</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'cancer', label: '암진단금', value: cancerAmount, setter: setCancerAmount, icon: ShieldCheckIcon, color: 'text-amber-500' },
                    { id: 'brain', label: '뇌혈관진단금', value: brainAmount, setter: setBrainAmount, icon: BoltIcon, color: 'text-blue-500' },
                    { id: 'heart', label: '허혈성심장진단비', value: heartAmount, setter: setHeartAmount, icon: HeartIcon, color: 'text-rose-500' },
                    { id: 'injury', label: '상해 1~5종 수술비', value: injurySurgeryAmount, setter: setInjurySurgeryAmount, icon: BoltIcon, color: 'text-green-500' },
                    { id: 'disease', label: '질병 1~5종 수술비', value: diseaseSurgeryAmount, setter: setDiseaseSurgeryAmount, icon: ShieldCheckIcon, color: 'text-indigo-500' },
                  ].map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label htmlFor={item.id} className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          {item.label}
                        </label>
                        <span className="text-xs font-bold text-gray-400">{item.value.toLocaleString()}만원</span>
                      </div>
                      <input
                        type="number"
                        id={item.id}
                        value={item.value}
                        onChange={(e) => item.setter(Number(e.target.value))}
                        className="block w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl text-gray-900 font-bold transition-all outline-none text-right"
                        step="100"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                보험료 계산하기
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div id="calculation-results" className="w-full lg:w-7/12 flex flex-col">
          {!showResults || !results ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
              <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <CalculatorIcon className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">계산 결과가 여기에 표시됩니다</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                가입 정보를 입력하고 '보험료 계산하기' 버튼을 눌러주세요.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl shadow-primary-100/30 p-8 md:p-10 border border-primary-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      gender === 'male' ? 'bg-primary-50 text-primary-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {results.genderLabel}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                      보험나이 {results.age}세
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">보험료 산출 결과</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">총 월 보험료</p>
                  <p className="text-3xl font-black text-primary-600 tracking-tight">{formatMoney(results.total)}</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { label: '암진단비', amount: cancerAmount, premium: results.premiums.cancer, icon: ShieldCheckIcon, bg: 'bg-amber-50', text: 'text-amber-700', iconColor: 'text-amber-500' },
                  { label: '뇌혈관질환 진단비', amount: brainAmount, premium: results.premiums.brain, icon: BoltIcon, bg: 'bg-blue-50', text: 'text-blue-700', iconColor: 'text-blue-500' },
                  { label: '허혈성심장질환 진단비', amount: heartAmount, premium: results.premiums.heart, icon: HeartIcon, bg: 'bg-rose-50', text: 'text-rose-700', iconColor: 'text-rose-500' },
                  { label: '상해 1~5종 수술비', amount: injurySurgeryAmount, premium: results.premiums.injurySurgery, icon: BoltIcon, bg: 'bg-green-50', text: 'text-green-700', iconColor: 'text-green-500' },
                  { label: '질병 1~5종 수술비', amount: diseaseSurgeryAmount, premium: results.premiums.diseaseSurgery, icon: ShieldCheckIcon, bg: 'bg-indigo-50', text: 'text-indigo-700', iconColor: 'text-indigo-500' },
                ].map((item, idx) => (
                  <div key={idx} className="group p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${item.bg} ${item.iconColor}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.label}</p>
                          <p className="text-[11px] font-bold text-gray-400">가입금액: {item.amount.toLocaleString()}만원</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">{formatMoney(item.premium)}</p>
                      </div>
                    </div>
                    {/* Progress Bar for Visual Weight */}
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${item.iconColor.replace('text-', 'bg-')}`}
                        style={{ width: `${(item.premium / results.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-primary-600 rounded-3xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-lg font-black mb-1">나에게 딱 맞는 보험료인가요?</h4>
                    <p className="text-white/80 text-sm font-medium">
                      고객님만을 위한 보험 다이어트 전문가가<br className="hidden md:block" /> 1:1 맞춤형 보장 분석을 도와드립니다.
                    </p>
                  </div>
                  <a href="/#consultation" className="bg-white text-primary-600 px-6 py-3 rounded-xl font-black text-sm shadow-xl hover:shadow-white/20 transition-all whitespace-nowrap">
                    전문가 상담 신청
                  </a>
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="mt-6 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                다시 계산하기
              </button>
            </div>
          )}
          
          <div className="mt-8 bg-amber-50/50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
            <InformationCircleIcon className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">안내드립니다</h4>
              <ul className="text-sm text-amber-800/80 space-y-1.5 list-disc list-inside break-keep">
                <li>본 계산기는 요율표를 기반으로 한 <strong>단순 예상치</strong>이며, 실제 보험료는 가입 연령, 직업, 건강 상태, 회사별 할인 혜택 등에 따라 달라질 수 있습니다.</li>
                <li>암진단금 등 각 보장 항목의 가입 금액은 가입하시는 목적에 따라 조절이 필요합니다.</li>
                <li>보험나이는 만나이와는 다르며, 실제 생일에서 6개월을 기준으로 산출됩니다.</li>
                <li>더 정확한 보험료와 보장 범위는 <strong>보험 다이어트 상담</strong>을 통해 확인해 보시기 바랍니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
