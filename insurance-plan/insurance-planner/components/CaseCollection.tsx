"use client";

import { useMemo, useState } from "react";
import { CASE_SOURCE_TEXT } from "@/lib/caseSource";
import { parseCases, type CaseItem } from "@/lib/caseParser";

export default function CaseCollection() {
    const cases = useMemo(() => parseCases(CASE_SOURCE_TEXT), []);
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() => {
        const query = q.trim();
        if (!query) return cases;
        return cases.filter((c) => c.quote.includes(query) || c.job.includes(query));
    }, [cases, q]);

    const shown = open ? filtered : filtered.slice(0, 12);

    return (
        <section className="py-12">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold">사례모음</h2>
                        <p className="mt-2 text-neutral-700">
                            상담 사례를 직업/상황별로 확인하실 수 있습니다.
                        </p>
                    </div>
                    <a href="#consult" className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white">
                        무료 상담 신청
                    </a>
                </div>

                <div className="mt-6">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="검색 (예: 세금, 실손, 노후, 청구, 공무원)"
                        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {shown.map((c, idx) => (
                        <CaseCard key={idx} c={c} />
                    ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                    {filtered.length > 12 && (
                        <button onClick={() => setOpen((p) => !p)} className="rounded-xl border px-5 py-3 text-sm">
                            {open ? "접기" : `더보기 (+${filtered.length - 12})`}
                        </button>
                    )}
                    <span className="text-sm text-neutral-600">총 {filtered.length}건</span>
                </div>
            </div>
        </section>
    );
}

function CaseCard({ c }: { c: CaseItem }) {
    return (
        <div className="rounded-2xl border p-6 flex flex-col h-full bg-white hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div className="flex gap-1 text-yellow-400">
                    {[...Array(c.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                    {c.location}
                </span>
            </div>
            <p className="mt-3 text-neutral-800 text-sm leading-relaxed flex-grow">“{c.quote}”</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="font-bold text-gray-900">{c.nameMasked} <span className="text-sm font-normal text-gray-500">고객님</span></span>
                <span className="text-xs font-medium text-neutral-500 bg-gray-100 px-2.5 py-1 rounded-full">{c.age}세 · {c.job}</span>
            </div>
        </div>
    );
}
