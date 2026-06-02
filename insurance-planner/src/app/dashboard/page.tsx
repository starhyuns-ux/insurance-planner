"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  phone: string;
  gender: "male" | "female";
  birth_date: string;
  created_at: string;
}

function calcAge(birthDate: string) {
  if (!birthDate) return "-";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age + "세";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<"" | "male" | "female">("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (genderFilter) params.set("gender", genderFilter);

      const res = await fetch(`/api/customers?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "고객 목록을 불러오지 못했습니다.");
      setCustomers(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [search, genderFilter]);

  // 검색/필터 변경 시 디바운스
  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(), 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // 통계
  const totalCount = customers.length;
  const maleCount = customers.filter((c) => c.gender === "male").length;
  const femaleCount = customers.filter((c) => c.gender === "female").length;
  const todayCount = customers.filter((c) => isToday(c.created_at)).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── 네비게이션 ── */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-sm">IP</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Insurance Planner</span>
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300 font-semibold">대시보드</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            메인으로 돌아가기
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* ── 페이지 제목 ── */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">
            고객 관리
          </h1>
          <p className="text-zinc-500">등록된 고객 정보를 조회하고 관리합니다.</p>
        </div>

        {/* ── 통계 카드 ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "전체 고객",
              value: totalCount,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
              color: "blue",
              gradient: "from-blue-500/20 to-indigo-500/20",
              border: "border-blue-500/20",
              icon_color: "text-blue-400",
            },
            {
              label: "오늘 신규",
              value: todayCount,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
              ),
              color: "emerald",
              gradient: "from-emerald-500/20 to-teal-500/20",
              border: "border-emerald-500/20",
              icon_color: "text-emerald-400",
            },
            {
              label: "남성",
              value: maleCount,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="14" r="6" /><path d="M19 5l-5.5 5.5M19 5h-5M19 5v5" />
                </svg>
              ),
              color: "sky",
              gradient: "from-sky-500/20 to-blue-500/20",
              border: "border-sky-500/20",
              icon_color: "text-sky-400",
            },
            {
              label: "여성",
              value: femaleCount,
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" /><path d="M12 14v6M9 18h6" />
                </svg>
              ),
              color: "pink",
              gradient: "from-pink-500/20 to-rose-500/20",
              border: "border-pink-500/20",
              icon_color: "text-pink-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-2xl p-5 flex flex-col gap-3`}
            >
              <div className={`${stat.icon_color}`}>{stat.icon}</div>
              <div>
                <div className="text-3xl font-black text-white">
                  {loading ? (
                    <span className="inline-block w-8 h-7 bg-white/10 rounded animate-pulse" />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </div>
                <div className="text-zinc-500 text-sm mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 검색 / 필터 ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* 검색 */}
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="customer-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 연락처로 검색"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* 성별 필터 */}
          <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 gap-1">
            {[
              { value: "", label: "전체" },
              { value: "male", label: "남성" },
              { value: "female", label: "여성" },
            ].map((opt) => (
              <button
                key={opt.value}
                id={`filter-${opt.value || "all"}`}
                onClick={() => setGenderFilter(opt.value as "" | "male" | "female")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  genderFilter === opt.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 새로고침 */}
          <button
            id="refresh-btn"
            onClick={fetchCustomers}
            disabled={loading}
            className="px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-40"
          >
            <svg className={loading ? "animate-spin" : ""} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>

        {/* ── 고객 테이블 ── */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">
              {loading ? "불러오는 중..." : `총 ${totalCount.toLocaleString()}명`}
            </span>
            {search || genderFilter ? (
              <button
                onClick={() => { setSearch(""); setGenderFilter(""); }}
                className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                필터 초기화
              </button>
            ) : null}
          </div>

          {/* 로딩 */}
          {loading && (
            <div className="divide-y divide-white/5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded animate-pulse w-1/4" />
                    <div className="h-3 bg-white/5 rounded animate-pulse w-1/3" />
                  </div>
                  <div className="h-3 bg-white/5 rounded animate-pulse w-20" />
                </div>
              ))}
            </div>
          )}

          {/* 에러 */}
          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <p className="text-red-400 font-medium">{error}</p>
              <button onClick={fetchCustomers} className="text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-2">다시 시도</button>
            </div>
          )}

          {/* 빈 상태 */}
          {!loading && !error && customers.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p className="text-zinc-500">
                {search || genderFilter ? "검색 결과가 없습니다." : "등록된 고객이 없습니다."}
              </p>
            </div>
          )}

          {/* 고객 목록 */}
          {!loading && !error && customers.length > 0 && (
            <>
              {/* 컬럼 헤더 (md 이상) */}
              <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                <div className="w-9" />
                <div>이름</div>
                <div>연락처</div>
                <div>나이</div>
                <div>등록일시</div>
                <div className="w-16" />
              </div>

              <div className="divide-y divide-white/5">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="group px-6 py-4 flex flex-col md:grid md:grid-cols-[auto_1fr_1fr_auto_auto_auto] md:items-center gap-3 md:gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* 아바타 */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      customer.gender === "male"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-pink-500/20 text-pink-400"
                    }`}>
                      {customer.name?.charAt(0) || "?"}
                    </div>

                    {/* 이름 + 성별 */}
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        {customer.name}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          customer.gender === "male"
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-pink-500/15 text-pink-400"
                        }`}>
                          {customer.gender === "male" ? "남" : "여"}
                        </span>
                        {isToday(customer.created_at) && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">NEW</span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 md:hidden">
                        {customer.phone} · {calcAge(customer.birth_date)}
                      </div>
                    </div>

                    {/* 연락처 */}
                    <div className="hidden md:block text-zinc-300 text-sm">{customer.phone}</div>

                    {/* 나이 */}
                    <div className="hidden md:block text-zinc-400 text-sm text-right">
                      <div>{calcAge(customer.birth_date)}</div>
                      <div className="text-xs text-zinc-600">{formatDate(customer.birth_date)}</div>
                    </div>

                    {/* 등록일시 */}
                    <div className="hidden md:block text-zinc-600 text-xs text-right whitespace-nowrap">
                      {formatDateTime(customer.created_at)}
                    </div>

                    {/* 삭제 버튼 */}
                    <div className="flex justify-end">
                      {confirmDeleteId === customer.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">삭제할까요?</span>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            disabled={deletingId === customer.id}
                            className="text-xs px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50 font-medium"
                          >
                            {deletingId === customer.id ? "삭제 중..." : "확인"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 rounded-lg transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`delete-${customer.id}`}
                          onClick={() => setConfirmDeleteId(customer.id)}
                          className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="삭제"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
