"use client";

import React, { useState } from "react";

// Rate tables from user provided code
const cancerRateTable: Record<number, { male: number; female: number }> = {
  0: { male: 4500, female: 4500 }, 1: { male: 4520, female: 4520 }, 2: { male: 4540, female: 4540 }, 3: { male: 4560, female: 4560 },
  4: { male: 4580, female: 4580 }, 5: { male: 4600, female: 4600 }, 6: { male: 4620, female: 4620 }, 7: { male: 4640, female: 4640 },
  8: { male: 4660, female: 4660 }, 9: { male: 4680, female: 4680 }, 10: { male: 4700, female: 4700 }, 11: { male: 4720, female: 4720 },
  12: { male: 4740, female: 4740 }, 13: { male: 4760, female: 4760 }, 14: { male: 4780, female: 4780 }, 15: { male: 4800, female: 4800 },
  16: { male: 4820, female: 4820 }, 17: { male: 4840, female: 4840 }, 18: { male: 4860, female: 4860 }, 19: { male: 4880, female: 4880 },
  20: { male: 4900, female: 5020 }, 21: { male: 6300, female: 6370 }, 22: { male: 6420, female: 6510 }, 23: { male: 6540, female: 6650 },
  24: { male: 6660, female: 6790 }, 25: { male: 6780, female: 6930 }, 26: { male: 6900, female: 7070 }, 27: { male: 7020, female: 7210 },
  28: { male: 7140, female: 7350 }, 29: { male: 7260, female: 7490 }, 30: { male: 7380, female: 7630 }, 31: { male: 7500, female: 7770 },
  32: { male: 7620, female: 7910 }, 33: { male: 7740, female: 8050 }, 34: { male: 7860, female: 8190 }, 35: { male: 7980, female: 8330 },
  36: { male: 8100, female: 8470 }, 37: { male: 8220, female: 8610 }, 38: { male: 8340, female: 8750 }, 39: { male: 8460, female: 8890 },
  40: { male: 8580, female: 9030 }, 41: { male: 8940, female: 9170 }, 42: { male: 9300, female: 9430 }, 43: { male: 9660, female: 9750 },
  44: { male: 10020, female: 10070 }, 45: { male: 10380, female: 10390 }, 46: { male: 10740, female: 10710 }, 47: { male: 11100, female: 11030 },
  48: { male: 11460, female: 11350 }, 49: { male: 11820, female: 11670 }, 50: { male: 12180, female: 11990 }, 51: { male: 12540, female: 12310 },
  52: { male: 12900, female: 12630 }, 53: { male: 13260, female: 12950 }, 54: { male: 13620, female: 13270 }, 55: { male: 13980, female: 13590 },
  56: { male: 14340, female: 13910 }, 57: { male: 14700, female: 14230 }, 58: { male: 15060, female: 14550 }, 59: { male: 15420, female: 14870 },
  60: { male: 15780, female: 15190 }, 61: { male: 16140, female: 15510 }, 62: { male: 16500, female: 15830 }, 63: { male: 16860, female: 16150 },
  64: { male: 17220, female: 16470 }, 65: { male: 17580, female: 16790 }, 66: { male: 17940, female: 17110 }, 67: { male: 18300, female: 17430 },
  68: { male: 18660, female: 17750 }, 69: { male: 19020, female: 18070 }, 70: { male: 19380, female: 18390 }
};

const brainRateTable: Record<number, { male: number; female: number }> = {
  0: { male: 3000, female: 3200 }, 1: { male: 3000, female: 3200 }, 2: { male: 3000, female: 3200 }, 3: { male: 3000, female: 3200 },
  4: { male: 3000, female: 3200 }, 5: { male: 3000, female: 3200 }, 6: { male: 3000, female: 3200 }, 7: { male: 3000, female: 3200 },
  8: { male: 3000, female: 3200 }, 9: { male: 3000, female: 3200 }, 10: { male: 3000, female: 3200 }, 11: { male: 3560, female: 3600 },
  12: { male: 3730, female: 3770 }, 13: { male: 3900, female: 3940 }, 14: { male: 4070, female: 4110 }, 15: { male: 4240, female: 4280 },
  16: { male: 4410, female: 4450 }, 17: { male: 4580, female: 4620 }, 18: { male: 4750, female: 4790 }, 19: { male: 4920, female: 4960 },
  20: { male: 5090, female: 5130 }, 21: { male: 5700, female: 5830 }, 22: { male: 5750, female: 5900 }, 23: { male: 5800, female: 5970 },
  24: { male: 5850, female: 6040 }, 25: { male: 5900, female: 6110 }, 26: { male: 5950, female: 6180 }, 27: { male: 6000, female: 6250 },
  28: { male: 6050, female: 6320 }, 29: { male: 6100, female: 6390 }, 30: { male: 6150, female: 6460 }, 31: { male: 6200, female: 6530 },
  32: { male: 6250, female: 6600 }, 33: { male: 6300, female: 6670 }, 34: { male: 6350, female: 6740 }, 35: { male: 6400, female: 6810 },
  36: { male: 6450, female: 6880 }, 37: { male: 6500, female: 6950 }, 38: { male: 6550, female: 7020 }, 39: { male: 6600, female: 7090 },
  40: { male: 6650, female: 7160 }, 41: { male: 6700, female: 7230 }, 42: { male: 6900, female: 7300 }, 43: { male: 7100, female: 7370 },
  44: { male: 7300, female: 7440 }, 45: { male: 7500, female: 7600 }, 46: { male: 7700, female: 7810 }, 47: { male: 7900, female: 8020 },
  48: { male: 8100, female: 8230 }, 49: { male: 8300, female: 8440 }, 50: { male: 8500, female: 8650 }, 51: { male: 8700, female: 8860 },
  52: { male: 8900, female: 9070 }, 53: { male: 9100, female: 9280 }, 54: { male: 9300, female: 9490 }, 55: { male: 9500, female: 9700 },
  56: { male: 9700, female: 9910 }, 57: { male: 9900, female: 10120 }, 58: { male: 10100, female: 10330 }, 59: { male: 10300, female: 10540 },
  60: { male: 10500, female: 10750 }, 61: { male: 10700, female: 10960 }, 62: { male: 10900, female: 11170 }, 63: { male: 11100, female: 11380 },
  64: { male: 11300, female: 11590 }, 65: { male: 11500, female: 11800 }, 66: { male: 11700, female: 12010 }, 67: { male: 11900, female: 12220 },
  68: { male: 12100, female: 12430 }, 69: { male: 12300, female: 12640 }, 70: { male: 12500, female: 12850 }
};

const heartRateTable: Record<number, { male: number; female: number }> = {
  0: { male: 1400, female: 1600 }, 1: { male: 1400, female: 1600 }, 2: { male: 1400, female: 1600 }, 3: { male: 1400, female: 1600 },
  4: { male: 1400, female: 1600 }, 5: { male: 1400, female: 1600 }, 6: { male: 1400, female: 1600 }, 7: { male: 1400, female: 1600 },
  8: { male: 1400, female: 1600 }, 9: { male: 1400, female: 1600 }, 10: { male: 1400, female: 1600 }, 11: { male: 1400, female: 1600 },
  12: { male: 1400, female: 1600 }, 13: { male: 1400, female: 1600 }, 14: { male: 1600, female: 1800 }, 15: { male: 1600, female: 1800 },
  16: { male: 1600, female: 1800 }, 17: { male: 1600, female: 1800 }, 18: { male: 1600, female: 1800 }, 19: { male: 1600, female: 1800 },
  20: { male: 1600, female: 1800 }, 21: { male: 1640, female: 1850 }, 22: { male: 1680, female: 1900 }, 23: { male: 1720, female: 1950 },
  24: { male: 1760, female: 2000 }, 25: { male: 1800, female: 2050 }, 26: { male: 1840, female: 2100 }, 27: { male: 1880, female: 2150 },
  28: { male: 1920, female: 2200 }, 29: { male: 1960, female: 2250 }, 30: { male: 2000, female: 2300 }, 31: { male: 2040, female: 2350 },
  32: { male: 2080, female: 2400 }, 33: { male: 2120, female: 2450 }, 34: { male: 2160, female: 2500 }, 35: { male: 2200, female: 2550 },
  36: { male: 2240, female: 2600 }, 37: { male: 2280, female: 2650 }, 38: { male: 2320, female: 2700 }, 39: { male: 2360, female: 2750 },
  40: { male: 2400, female: 2800 }, 41: { male: 2440, female: 2850 }, 42: { male: 2480, female: 2900 }, 43: { male: 2520, female: 2950 },
  44: { male: 2560, female: 3000 }, 45: { male: 2600, female: 3050 }, 46: { male: 2640, female: 3100 }, 47: { male: 2680, female: 3150 },
  48: { male: 2720, female: 3200 }, 49: { male: 2760, female: 3250 }, 50: { male: 2800, female: 3300 }, 51: { male: 2840, female: 3350 },
  52: { male: 2880, female: 3400 }, 53: { male: 2920, female: 3450 }, 54: { male: 2960, female: 3500 }, 55: { male: 3000, female: 3550 },
  56: { male: 3040, female: 3600 }, 57: { male: 3080, female: 3650 }, 58: { male: 3120, female: 3700 }, 59: { male: 3160, female: 3750 },
  60: { male: 3200, female: 3800 }, 61: { male: 3240, female: 3850 }, 62: { male: 3280, female: 3900 }, 63: { male: 3320, female: 3950 },
  64: { male: 3360, female: 4000 }, 65: { male: 3400, female: 4050 }, 66: { male: 3440, female: 4100 }, 67: { male: 3480, female: 4150 },
  68: { male: 3520, female: 4200 }, 69: { male: 3560, female: 4250 }, 70: { male: 3600, female: 4300 }
};

const BASE_AMOUNT_MANWON = 1000;

function getInsuranceAge(birthDateStr: string) {
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

function calcPremium(amountManwon: number, premiumPer1000: number) {
  return (amountManwon / BASE_AMOUNT_MANWON) * premiumPer1000;
}

function formatWon(value: number) {
  return Math.round(value).toLocaleString("ko-KR") + "원";
}

// 연락처 자동 하이픈 포맷
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function InsuranceCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [birthDate, setBirthDate] = useState("");
  const [cancerAmount, setCancerAmount] = useState(5000);
  const [brainAmount, setBrainAmount] = useState(2000);
  const [heartAmount, setHeartAmount] = useState(2000);
  const [results, setResults] = useState<{
    insuranceAge: number;
    cancerPremium: number;
    brainPremium: number;
    heartPremium: number;
    totalPremium: number;
  } | null>(null);

  // 고객 등록 폼 상태
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleCalculate = () => {
    const insuranceAge = getInsuranceAge(birthDate);

    if (!birthDate || insuranceAge === null || insuranceAge < 0) {
      alert("생년월일을 정확히 입력해 주세요.");
      return;
    }

    if (!(insuranceAge in cancerRateTable) || !(insuranceAge in brainRateTable) || !(insuranceAge in heartRateTable)) {
      alert("해당 보험나이에 대한 요율표가 없습니다. (0세~70세까지 지원)");
      return;
    }

    const cancerPremium = calcPremium(cancerAmount, cancerRateTable[insuranceAge][gender]);
    const brainPremium = calcPremium(brainAmount, brainRateTable[insuranceAge][gender]);
    const heartPremium = calcPremium(heartAmount, heartRateTable[insuranceAge][gender]);
    const totalPremium = cancerPremium + brainPremium + heartPremium;

    setResults({ insuranceAge, cancerPremium, brainPremium, heartPremium, totalPremium });

    // 계산 새로 하면 등록 상태 초기화
    setSubmitStatus("idle");
    setSubmitMessage("");
  };

  const handleRegisterCustomer = async () => {
    if (!customerName.trim()) {
      setSubmitStatus("error");
      setSubmitMessage("이름을 입력해 주세요.");
      return;
    }
    const rawPhone = customerPhone.replace(/\D/g, "");
    if (rawPhone.length < 10) {
      setSubmitStatus("error");
      setSubmitMessage("올바른 연락처를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // 서버사이드 API Route로 전송 → auth lock 오류 완전 차단
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName.trim(),
          phone: customerPhone,
          gender,
          birth_date: birthDate,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "고객 등록에 실패했습니다.");
      }

      setSubmitStatus("success");
      setSubmitMessage("고객 정보가 성공적으로 등록되었습니다! 📋");
      setCustomerName("");
      setCustomerPhone("");
    } catch (err) {
      setSubmitStatus("error");
      setSubmitMessage(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* ── 보험료 계산기 카드 ── */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              예상 보험료 계산기
            </h2>
            <p className="text-zinc-400 text-sm">
              간단한 정보 입력으로 나의 예상 보험료를 확인해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 block ml-1">성별</label>
              <div className="flex bg-zinc-900/50 rounded-xl p-1 border border-zinc-800">
                <button
                  id="gender-male"
                  onClick={() => setGender("male")}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    gender === "male"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  남성
                </button>
                <button
                  id="gender-female"
                  onClick={() => setGender("female")}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    gender === "female"
                      ? "bg-pink-600 text-white shadow-lg shadow-pink-900/40"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  여성
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="birthDate" className="text-sm font-medium text-zinc-300 block ml-1">생년월일</label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              />
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-zinc-300">암진단금</label>
                <span className="text-blue-400 font-bold text-lg">{cancerAmount.toLocaleString()}만원</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={cancerAmount}
                onChange={(e) => setCancerAmount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-zinc-300">뇌혈관진단금</label>
                <span className="text-indigo-400 font-bold text-lg">{brainAmount.toLocaleString()}만원</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={brainAmount}
                onChange={(e) => setBrainAmount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-zinc-300">허혈성심장진단비</label>
                <span className="text-purple-400 font-bold text-lg">{heartAmount.toLocaleString()}만원</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={heartAmount}
                onChange={(e) => setHeartAmount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          <button
            id="calculate-btn"
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transform transition-all active:scale-[0.98] mb-8"
          >
            보험료 계산하기
          </button>

          {results && (
            <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-6 transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-zinc-800 pb-2 flex justify-between">
                <span>계산 결과</span>
                <span className="text-sm text-zinc-500 font-normal">보험나이 {results.insuranceAge}세 ({gender === "male" ? "남성" : "여성"})</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">암진단금 ({cancerAmount.toLocaleString()}만원)</span>
                  <span className="text-white font-medium">{formatWon(results.cancerPremium)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">뇌혈관진단금 ({brainAmount.toLocaleString()}만원)</span>
                  <span className="text-white font-medium">{formatWon(results.brainPremium)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">허혈성심장진단비 ({heartAmount.toLocaleString()}만원)</span>
                  <span className="text-white font-medium">{formatWon(results.heartPremium)}</span>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-white font-bold text-lg">총 예상 보험료</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {formatWon(results.totalPremium)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-[11px] text-zinc-500 leading-relaxed px-2">
            ※ 본 계산기는 예시용 예상 보험료입니다. 실제 보험료는 상품, 보험나이, 성별, 납기, 만기, 가입조건 및 회사 기준에 따라 달라질 수 있습니다.
          </div>
        </div>
      </div>

      {/* ── 고객 정보 등록 카드 (계산 결과가 있을 때만 표시) ── */}
      {results && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6M22 11h-6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">고객 정보 등록</h3>
                <p className="text-zinc-500 text-xs">결과를 저장하고 맞춤 상담을 받아보세요</p>
              </div>
            </div>

            {/* 성공 메시지 */}
            {submitStatus === "success" ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-emerald-400 font-semibold text-center">{submitMessage}</p>
                <button
                  onClick={() => { setSubmitStatus("idle"); setSubmitMessage(""); }}
                  className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors underline underline-offset-2"
                >
                  다른 고객 등록하기
                </button>
              </div>
            ) : (
              <>
                {/* 확인 정보 (이미 입력된 값) */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">성별</span>
                    <span className="text-white text-sm font-medium">{gender === "male" ? "👨 남성" : "👩 여성"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">생년월일</span>
                    <span className="text-white text-sm font-medium">{birthDate}</span>
                  </div>
                </div>

                {/* 이름 입력 */}
                <div className="space-y-2 mb-4">
                  <label htmlFor="customerName" className="text-sm font-medium text-zinc-300 block ml-1">이름</label>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>

                {/* 연락처 입력 */}
                <div className="space-y-2 mb-6">
                  <label htmlFor="customerPhone" className="text-sm font-medium text-zinc-300 block ml-1">연락처</label>
                  <input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                    placeholder="010-0000-0000"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>

                {/* 에러 메시지 */}
                {submitStatus === "error" && (
                  <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {submitMessage}
                  </div>
                )}

                {/* 등록 버튼 */}
                <button
                  id="register-customer-btn"
                  onClick={handleRegisterCustomer}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      등록 중...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      고객 등록하기
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
