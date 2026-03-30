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
import { useLanguage } from '@/lib/contexts/LanguageContext'

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
  0:{male:2865,female:2865}, 1:{male:2985,female:2985}, 2:{male:3105,female:3105}, 3:{male:3225,female:3225},
  4:{male:3350,female:3350}, 5:{male:3470,female:3470}, 6:{male:3590,female:3590}, 7:{male:3710,female:3710},
  8:{male:3830,female:3830}, 9:{male:3950,female:3950}, 10:{male:4070,female:4070}, 11:{male:4195,female:4195},
  12:{male:4315,female:4315}, 13:{male:4435,female:4435}, 14:{male:4555,female:4555}, 15:{male:4675,female:4675},
  16:{male:4795,female:4795}, 17:{male:4920,female:4920}, 18:{male:5040,female:5040}, 19:{male:5160,female:5160},
  20:{male:5280,female:5280},
  21:{male:5480,female:5480}, 22:{male:5685,female:5685}, 23:{male:5885,female:5885}, 24:{male:6090,female:6090},
  25:{male:6290,female:6290}, 26:{male:6490,female:6490}, 27:{male:6695,female:6695}, 28:{male:6895,female:6895},
  29:{male:7100,female:7100}, 30:{male:7300,female:7300}, 31:{male:7505,female:7505}, 32:{male:7710,female:7710},
  33:{male:7915,female:7915}, 34:{male:8120,female:8120}, 35:{male:8325,female:8325}, 36:{male:8530,female:8530},
  37:{male:8735,female:8735}, 38:{male:8940,female:8940}, 39:{male:9145,female:9145}, 40:{male:9350,female:9350},
  41:{male:9555,female:9555}, 42:{male:9760,female:9760}, 43:{male:9965,female:9965}, 44:{male:10170,female:10170},
  45:{male:10375,female:10375}, 46:{male:10580,female:10580}, 47:{male:10785,female:10785}, 48:{male:10990,female:10990},
  49:{male:11195,female:11195}, 50:{male:11400,female:11400},
  51:{male:12000,female:12000}, 52:{male:12000,female:12000}, 53:{male:12000,female:12000}, 54:{male:12000,female:12000},
  55:{male:12000,female:12000}, 56:{male:12000,female:12000}, 57:{male:12000,female:12000}, 58:{male:12000,female:12000},
  59:{male:12000,female:12000}, 60:{male:12000,female:12000},
  61:{male:16000,female:16000}, 62:{male:16000,female:16000}, 63:{male:16000,female:16000}, 64:{male:16000,female:16000},
  65:{male:16000,female:16000}, 66:{male:16000,female:16000}, 67:{male:16000,female:16000}, 68:{male:16000,female:16000},
  69:{male:16000,female:16000}, 70:{male:16000,female:16000}
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

// --- Component ---

export default function InsurancePremiumCalculator() {
  const { t, locale } = useLanguage();
  const [inputType, setInputType] = useState<'birthDate' | 'age'>('birthDate');
  const [directAge, setDirectAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState<string>('');
  
  const [cancerAmount, setCancerAmount] = useState<number>(5000);
  const [brainAmount, setBrainAmount] = useState<number>(2000);
  const [heartAmount, setHeartAmount] = useState<number>(2000);
  const [injurySurgeryAmount, setInjurySurgeryAmount] = useState<number>(1500);
  const [diseaseSurgeryAmount, setDiseaseSurgeryAmount] = useState<number>(2000);
  const [cancerTreatmentAmount, setCancerTreatmentAmount] = useState<number>(5000);
  
  const [isCalculated, setIsCalculated] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const insuranceAge = useMemo(() => {
    if (inputType === 'age') {
      const parsedAge = parseInt(directAge, 10);
      return isNaN(parsedAge) ? null : parsedAge;
    }
    return getInsuranceAge(birthDate);
  }, [inputType, directAge, birthDate]);

  const results = useMemo(() => {
    if (insuranceAge === null || insuranceAge < 0 || insuranceAge > 70) return null;

    const premiums = {
      cancer: calcPremium(cancerAmount, cancerRateTable[insuranceAge][gender]),
      brain: calcPremium(brainAmount, brainRateTable[insuranceAge][gender]),
      heart: calcPremium(heartAmount, heartRateTable[insuranceAge][gender]),
      injurySurgery: calcPremium(injurySurgeryAmount, injurySurgeryRateTable[insuranceAge][gender]),
      diseaseSurgery: calcPremium(diseaseSurgeryAmount, diseaseSurgeryRateTable[insuranceAge][gender]),
      cancerTreatment: calcPremium(cancerTreatmentAmount, cancerRateTable[insuranceAge][gender]),
    };

    const total = Object.values(premiums).reduce((acc, curr) => acc + curr, 0);

    return {
      premiums,
      total,
      age: insuranceAge,
      genderLabel: gender === 'male' ? t('male') : t('female')
    };
  }, [gender, insuranceAge, cancerAmount, brainAmount, heartAmount, injurySurgeryAmount, diseaseSurgeryAmount, cancerTreatmentAmount, t]);

  const formatMoney = (amount: number) => {
    if (amount <= 0) return `0 ${t('currencyUnit')}`
    return `${Math.round(amount).toLocaleString()} ${t('currencyUnit')}`;
  }

  const handleCalculate = () => {
    if (inputType === 'birthDate' && !birthDate) {
      alert(t('alertBirthDate'));
      return;
    }
    if (inputType === 'age' && !directAge) {
      alert(t('alertAgeEligible'));
      return;
    }
    if (insuranceAge === null || insuranceAge < 0 || insuranceAge > 70) {
      alert(t('alertAgeEligible'));
      return;
    }
    
    setIsCalculated(true);
    setShowResults(true);
    
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
              {t('inputInfo')}
            </h2>
            
            <div className="space-y-6">
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">{t('gender')}</label>
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
                    {t('male')}
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
                    {t('female')}
                  </button>
                </div>
              </div>

              {/* Input Type Toggle */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">{t('inputTypeTitle')}</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setInputType('birthDate')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all border-2 ${
                      inputType === 'birthDate' 
                        ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' 
                        : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5" />
                    {t('inputTypeBirthDate')}
                  </button>
                  <button
                    onClick={() => setInputType('age')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all border-2 ${
                      inputType === 'age' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                        : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    {t('inputTypeAge')}
                  </button>
                </div>

                {/* Age Input Dynamic Render */}
                {inputType === 'birthDate' ? (
                  <div>
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
                        {t('insuranceAge')}: {insuranceAge} {t('ageUnit')}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="directAge"
                        value={directAge}
                        onChange={(e) => setDirectAge(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl text-gray-900 font-medium transition-all outline-none"
                        placeholder={t('inputAgePlaceholder') || '0~70'}
                        min="0"
                        max="70"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 my-2" />

              {/* Coverage Amounts */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">{t('coverageSettings')}</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'cancer', label: t('cancerLabel'), value: cancerAmount, setter: setCancerAmount, icon: ShieldCheckIcon, color: 'text-amber-500' },
                    { id: 'brain', label: t('brainLabel'), value: brainAmount, setter: setBrainAmount, icon: BoltIcon, color: 'text-blue-500' },
                    { id: 'heart', label: t('heartLabel'), value: heartAmount, setter: setHeartAmount, icon: HeartIcon, color: 'text-rose-500' },
                    { id: 'injury', label: t('injurySurgery'), value: injurySurgeryAmount, setter: setInjurySurgeryAmount, icon: BoltIcon, color: 'text-green-500' },
                    { id: 'disease', label: t('diseaseSurgery'), value: diseaseSurgeryAmount, setter: setDiseaseSurgeryAmount, icon: ShieldCheckIcon, color: 'text-indigo-500' },
                    { id: 'cancerTreatment', label: t('cancerTreatmentLabel') || '비급여 암주요치료비', value: cancerTreatmentAmount, setter: setCancerTreatmentAmount, icon: ShieldCheckIcon, color: 'text-purple-500' },
                  ].map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label htmlFor={item.id} className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          {item.label}
                        </label>
                        <span className="text-xs font-bold text-gray-400">{item.value.toLocaleString()} {t('manwonUnit')}</span>
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
                {t('calculatePremium')}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('calcPlaceholderTitle')}
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                {t('calcPlaceholderDesc')}
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
                       {t('insuranceAge')} {results.age} {t('ageUnit')}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">{t('calcResults')}</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('totalMonthly')}</p>
                  <p className="text-3xl font-black text-primary-600 tracking-tight">{formatMoney(results.total)}</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { label: t('cancerLabel'), amount: cancerAmount, premium: results.premiums.cancer, icon: ShieldCheckIcon, bg: 'bg-amber-50', text: 'text-amber-700', iconColor: 'text-amber-500' },
                  { label: t('brainLabel'), amount: brainAmount, premium: results.premiums.brain, icon: BoltIcon, bg: 'bg-blue-50', text: 'text-blue-700', iconColor: 'text-blue-500' },
                  { label: t('heartLabel'), amount: heartAmount, premium: results.premiums.heart, icon: HeartIcon, bg: 'bg-rose-50', text: 'text-rose-700', iconColor: 'text-rose-500' },
                  { label: t('injurySurgery'), amount: injurySurgeryAmount, premium: results.premiums.injurySurgery, icon: BoltIcon, bg: 'bg-green-50', text: 'text-green-700', iconColor: 'text-green-500' },
                  { label: t('diseaseSurgery'), amount: diseaseSurgeryAmount, premium: results.premiums.diseaseSurgery, icon: ShieldCheckIcon, bg: 'bg-indigo-50', text: 'text-indigo-700', iconColor: 'text-indigo-500' },
                  { label: t('cancerTreatmentLabel') || '비급여 암주요치료비', amount: cancerTreatmentAmount, premium: results.premiums.cancerTreatment, icon: ShieldCheckIcon, bg: 'bg-purple-50', text: 'text-purple-700', iconColor: 'text-purple-500' },
                ].map((item, idx) => (
                  <div key={idx} className="group p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${item.bg} ${item.iconColor}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.label}</p>
                          <p className="text-[11px] font-bold text-gray-400">
                             {t('limitVal') || (locale === 'ko' ? '가입금액' : (locale === 'en' ? 'Limit' : '保额'))}: {item.amount.toLocaleString()} {t('manwonUnit')}
                          </p>
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
                    <h4 className="text-lg font-black mb-1">
                      {t('consultationTitle')}
                    </h4>
                    <p className="text-white/80 text-sm font-medium">
                       {t('consultationDesc')}
                    </p>
                  </div>
                  <a href="/#consultation" className="bg-white text-primary-600 px-6 py-3 rounded-xl font-black text-sm shadow-xl hover:shadow-white/20 transition-all whitespace-nowrap">
                    {t('requestConsultation')}
                  </a>
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="mt-6 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                {t('resetCalc')}
              </button>
            </div>
          )}
          
          <div className="mt-8 bg-amber-50/50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
            <InformationCircleIcon className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">{t('noticeTitle')}</h4>
              <p className="text-sm text-amber-800/80 leading-relaxed break-keep">
                {t('noticePremium')}
              </p>
              <ul className="mt-3 text-xs text-amber-800/70 space-y-1 list-disc list-inside">
                <li>본 계산 결과는 참고용입니다.</li>
                <li>상품 추천 또는 가입 권유 목적이 아닙니다.</li>
                <li>실제 보험료는 조건에 따라 달라질 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
