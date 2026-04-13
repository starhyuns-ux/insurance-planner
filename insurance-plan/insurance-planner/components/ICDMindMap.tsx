'use client'

import React, { useMemo, useState } from "react";
import { Search, Brain, Shield, HeartPulse, Bone, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const organicTransition = {
  type: "spring",
  stiffness: 180,
  damping: 18,
  mass: 1.1,
};

type TreeNode = {
  id: string;
  label: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string; x?: number; y?: number; width?: number; height?: number; style?: React.CSSProperties }>;
  detail?: string;
  children?: TreeNode[];
};

const groupStyles = {
  C: { line: "#e11d48", fill: "#fff1f2", accent: "#f43f5e", text: "#881337" },
  I: { line: "#dc2626", fill: "#fef2f2", accent: "#ef4444", text: "#7f1d1d" },
  S: { line: "#d97706", fill: "#fffbeb", accent: "#f59e0b", text: "#78350f" },
  M: { line: "#0284c7", fill: "#f0f9ff", accent: "#0ea5e9", text: "#0c4a6e" },
  K: { line: "#059669", fill: "#ecfdf5", accent: "#10b981", text: "#064e3b" },
  R: { line: "#7c3aed", fill: "#f5f3ff", accent: "#8b5cf6", text: "#4c1d95" },
  D: { line: "#94a3b8", fill: "#f8fafc", accent: "#cbd5e1", text: "#475569" },
  default: { line: "#64748b", fill: "#f8fafc", accent: "#94a3b8", text: "#334155" },
} as const;

const icdTree: TreeNode[] = [
  {
    id: "C",
    label: "C코드",
    subtitle: "암 / 악성신생물",
    icon: Brain,
    children: [
      {
        id: "C15-C26",
        label: "소화기암",
        children: [
          { id: "C15", label: "식도암" },
          { id: "C16", label: "위암", detail: "위 점막에서 발생하는 대표적인 소화기계 악성신생물입니다." },
          { id: "C18", label: "대장암" },
          { id: "C20", label: "직장암" },
          { id: "C22", label: "간암" },
          { id: "C25", label: "췌장암" },
        ],
      },
      {
        id: "C30-C39",
        label: "호흡기계 암",
        children: [
          { id: "C32", label: "후두암" },
          { id: "C33", label: "기관암" },
          { id: "C34", label: "폐암" },
        ],
      },
      {
        id: "C50-C58",
        label: "유방/생식기 암",
        children: [
          { id: "C50", label: "유방암" },
          { id: "C53", label: "자궁경부암" },
          { id: "C54", label: "자궁체부암" },
          { id: "C56", label: "난소암" },
        ],
      },
      {
        id: "C60-C80",
        label: "기타 주요 암",
        children: [
          { id: "C61", label: "전립선암" },
          { id: "C67", label: "방광암" },
          { id: "C71", label: "뇌암" },
          { id: "C73", label: "갑상선암" },
          { id: "C77", label: "림프절 전이암" },
          { id: "C78.7", label: "간 전이암" },
          { id: "C79.3", label: "뇌 전이암" },
          { id: "C79.5", label: "골 전이암" },
          { id: "C80", label: "원발부위 불명 악성신생물" },
        ],
      },
    ],
  },
  {
    id: "I",
    label: "I코드",
    subtitle: "순환계 질환",
    icon: HeartPulse,
    children: [
      {
        id: "I10-I15",
        label: "고혈압 질환",
        children: [
          { id: "I10", label: "본태성 고혈압" },
          { id: "I11", label: "고혈압성 심질환" },
          { id: "I12", label: "고혈압성 신질환" },
        ],
      },
      {
        id: "I20-I25",
        label: "허혈성 심질환",
        children: [
          { id: "I20", label: "협심증" },
          { id: "I21", label: "급성 심근경색" },
          { id: "I22", label: "재발된 심근경색" },
          { id: "I23", label: "심근경색 후 합병증" },
          { id: "I24", label: "기타 급성 허혈성 심장질환" },
          { id: "I25", label: "만성 허혈성 심질환" },
        ],
      },
      {
        id: "I60-I69",
        label: "뇌혈관 질환",
        children: [
          { id: "I60", label: "지주막하출혈" },
          { id: "I61", label: "뇌내출혈" },
          { id: "I63", label: "뇌경색", detail: "뇌혈관이 막혀 허혈성 손상이 발생한 상태입니다." },
          { id: "I64", label: "상세불명 뇌졸중" },
          { id: "I69", label: "뇌혈관질환 후유증" },
        ],
      },
      {
        id: "I70-I89",
        label: "기타 혈관 질환",
        children: [
          { id: "I70", label: "동맥경화증" },
          { id: "I71", label: "대동맥류" },
          { id: "I80", label: "정맥염 및 혈전정맥염" },
          { id: "I84", label: "치핵" },
        ],
      },
    ],
  },
  {
    id: "S",
    label: "S코드",
    subtitle: "손상 / 외상",
    icon: Shield,
    children: [
      {
        id: "S00-S09",
        label: "머리 손상",
        children: [
          { id: "S02", label: "두개골 및 안면골 골절" },
          { id: "S05", label: "눈 및 안와 손상" },
          { id: "S06", label: "두개내 손상" },
        ],
      },
      {
        id: "S10-S39",
        label: "목/흉부/복부 손상",
        children: [
          { id: "S12", label: "경추 골절" },
          { id: "S22", label: "늑골·흉골·흉추 골절" },
          { id: "S32", label: "요추 및 골반 골절" },
          { id: "S36", label: "복부 장기 손상" },
        ],
      },
      {
        id: "S40-S69",
        label: "상지 손상",
        children: [
          { id: "S42", label: "어깨 및 위팔 골절" },
          { id: "S52", label: "요골·척골 골절" },
          { id: "S62", label: "손목 및 손 골절" },
        ],
      },
      {
        id: "S70-S99",
        label: "하지 손상",
        children: [
          { id: "S72", label: "대퇴골 골절", detail: "대퇴골에 발생한 골절로 수술이나 장기 재활이 필요한 경우가 많습니다." },
          { id: "S82", label: "경골·비골 골절" },
          { id: "S92", label: "발목 및 발 골절" },
        ],
      },
    ],
  },
  {
    id: "M",
    label: "M코드",
    subtitle: "근골격계 질환",
    icon: Bone,
    children: [
      {
        id: "M15-M19",
        label: "관절증",
        children: [
          { id: "M16", label: "고관절 관절증" },
          { id: "M17", label: "무릎 관절증" },
          { id: "M19", label: "기타 관절증" },
        ],
      },
      {
        id: "M40-M54",
        label: "척추/디스크 질환",
        children: [
          { id: "M47", label: "척추증" },
          { id: "M48", label: "기타 척추병증" },
          { id: "M50", label: "경추 추간판 장애" },
          { id: "M51", label: "기타 추간판 장애", detail: "허리디스크를 포함한 기타 추간판 질환군입니다." },
          { id: "M54", label: "등통증" },
        ],
      },
      {
        id: "M65-M79",
        label: "힘줄/연부조직",
        children: [
          { id: "M65", label: "활막염 및 건초염" },
          { id: "M75", label: "어깨 병변" },
          { id: "M77", label: "기타 힘줄병증" },
          { id: "M79", label: "기타 연부조직 장애" },
        ],
      },
    ],
  },
  {
    id: "K",
    label: "K코드",
    subtitle: "소화기계 질환",
    icon: Stethoscope,
    children: [
      {
        id: "K20-K31",
        label: "식도/위/십이지장",
        children: [
          { id: "K21", label: "위식도 역류질환" },
          { id: "K25", label: "위궤양" },
          { id: "K29", label: "위염 및 십이지장염" },
          { id: "K30", label: "기능성 소화불량" },
        ],
      },
      {
        id: "K35-K46",
        label: "충수/탈장",
        children: [
          { id: "K35", label: "급성 충수염", detail: "맹장염으로 불리는 급성 충수의 염증입니다." },
          { id: "K40", label: "서혜부 탈장" },
          { id: "K42", label: "배꼽 탈장" },
        ],
      },
      {
        id: "K50-K59",
        label: "장 질환",
        children: [
          { id: "K50", label: "크론병" },
          { id: "K51", label: "궤양성 대장염" },
          { id: "K57", label: "게실 질환" },
          { id: "K58", label: "과민성 대장증후군" },
        ],
      },
      {
        id: "K70-K87",
        label: "간/담낭/췌장",
        children: [
          { id: "K74", label: "간 섬유증 및 간경변" },
          { id: "K80", label: "담석증" },
          { id: "K81", label: "담낭염" },
          { id: "K85", label: "급성 췌장염" },
        ],
      },
    ],
  },
  {
    id: "R",
    label: "R코드",
    subtitle: "증상 / 징후 / 검사이상",
    icon: Search,
    children: [
      {
        id: "R00-R09",
        label: "순환/호흡 증상",
        children: [{ id: "R07", label: "흉통" }],
      },
      {
        id: "R10-R19",
        label: "소화기 증상",
        children: [{ id: "R10", label: "복통" }],
      },
      {
        id: "R40-R69",
        label: "의식/전신 증상",
        children: [
          { id: "R42", label: "어지럼증", detail: "원인질환이 확정되기 전 사용하는 대표적인 증상 코드입니다." },
          { id: "R50", label: "발열" },
          { id: "R51", label: "두통" },
        ],
      },
    ],
  },
];

function normalize(text: string) {
  return String(text || "").toLowerCase().replace(/\s+/g, "");
}

function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query) return nodes;
  const q = normalize(query);
  return nodes
    .map((node) => {
      const selfMatch = normalize(`${node.id} ${node.label} ${node.subtitle || ""}`).includes(q);
      const children = node.children ? filterTree(node.children, query) : [];
      if (selfMatch || children.length > 0) return { ...node, children };
      return null;
    })
    .filter(Boolean) as TreeNode[];
}

function findPath(nodes: TreeNode[], query: string, trail: TreeNode[] = []): TreeNode[] {
  const q = normalize(query);
  for (const node of nodes) {
    const currentTrail = [...trail, node];
    const selfMatch = normalize(`${node.id} ${node.label} ${node.subtitle || ""}`).includes(q);
    if (selfMatch) return currentTrail;
    if (node.children?.length) {
      const found = findPath(node.children, query, currentTrail);
      if (found.length) return found;
    }
  }
  return [];
}

function getGroupKey(node: TreeNode) {
  const id = String(node.id || "");
  if (["C", "I", "S", "M", "K", "R", "D"].includes(id)) return id as keyof typeof groupStyles;
  return (id.charAt(0) || "default") as keyof typeof groupStyles;
}

function polarPosition(index: number, total: number, radius: number, center: number) {
  const start = -Math.PI / 2;
  const angle = start + (index / Math.max(total, 1)) * Math.PI * 2;
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

function getChildPositions(parentX: number, parentY: number, childCount: number, radius: number, parentAngle: number, spread = Math.PI * 0.7) {
  if (childCount === 1) {
    return [{ x: parentX + Math.cos(parentAngle) * radius, y: parentY + Math.sin(parentAngle) * radius, angle: parentAngle }];
  }
  const start = parentAngle - spread / 2;
  return Array.from({ length: childCount }, (_, idx) => {
    const angle = start + (idx / Math.max(childCount - 1, 1)) * spread;
    return {
      x: parentX + Math.cos(angle) * radius,
      y: parentY + Math.sin(angle) * radius,
      angle,
    };
  });
}

function collectDescendants(node: TreeNode | null): string[] {
  if (!node) return [];
  const ids = [node.id];
  for (const child of node.children || []) {
    ids.push(...collectDescendants(child));
  }
  return ids;
}

type BubbleProps = {
  node: TreeNode;
  x: number;
  y: number;
  size: number;
  active?: boolean;
  dimmed?: boolean;
  hovered?: boolean;
  selected?: boolean;
  onClick?: (node: TreeNode) => void;
  onHover?: (id: string) => void;
  onLeave?: () => void;
  showLabel?: boolean;
};

function Bubble({ node, x, y, size, active, dimmed, hovered, selected, onClick, onHover, onLeave, showLabel = true }: BubbleProps) {
  const style = (groupStyles[getGroupKey(node)] || groupStyles.default) as { line: string, fill: string, accent: string, text: string };
  const Icon = node.icon;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.45, x: 0, y: 0 }}
      animate={{
        opacity: dimmed ? 0.18 : 1,
        scale: active || hovered ? 1.1 : [0.96, 1.02, 1],
        x: hovered ? [0, -1.5, 1.5, 0] : 0,
        y: hovered ? [0, 1.5, -1.5, 0] : 0,
      }}
      exit={{ opacity: 0, scale: 0.35 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: hovered || active ? { duration: 0.22 } : { duration: 0.9, times: [0, 0.55, 1] },
        x: { duration: 1.6, repeat: hovered ? Infinity : 0, ease: "easeInOut" },
        y: { duration: 1.4, repeat: hovered ? Infinity : 0, ease: "easeInOut" },
      }}
      onClick={() => onClick?.(node)}
      onMouseEnter={() => onHover?.(node.id)}
      onMouseLeave={() => onLeave?.()}
      className="cursor-pointer"
    >
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill={style.fill}
        stroke={active || hovered || selected ? style.line : style.accent}
        strokeWidth={active || hovered || selected ? 4 : 2.5}
        animate={{
          r: active || selected ? [size, size + 2.5, size] : hovered ? [size, size + 1.5, size] : size,
        }}
        transition={{ duration: active ? 1.1 : 1.4, repeat: active || hovered ? Infinity : 0, ease: "easeInOut" }}
        style={{ filter: active || hovered ? `drop-shadow(0 10px 24px ${style.accent}55)` : "drop-shadow(0 6px 18px rgba(15,23,42,0.08))" }}
      />
      <motion.circle
        cx={x}
        cy={y}
        r={size - 8}
        fill="white"
        opacity={0.9}
        animate={{ r: active ? [size - 8, size - 10, size - 8] : size - 8 }}
        transition={{ duration: 1.15, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      />
      <motion.circle
        cx={x}
        cy={y}
        r={size - 12}
        fill={style.fill}
        opacity={0.9}
        animate={{ r: hovered ? [size - 12, size - 14, size - 12] : size - 12 }}
        transition={{ duration: 1.2, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
      />
      {Icon ? <Icon x={x - 10} y={y - 12} width={20} height={20} style={{ color: style.text }} /> : null}
      <text x={x} y={y + (Icon ? 20 : 4)} textAnchor="middle" style={{ fill: style.text, fontSize: 11, fontWeight: 700 }}>
        {node.id.length > 11 ? `${node.id.slice(0, 11)}` : node.id}
      </text>
      {showLabel ? (
        <motion.text
          x={x}
          y={y + size + 18}
          textAnchor="middle"
          style={{ fill: style.text, fontSize: 11 }}
          animate={{ opacity: hovered || active ? 1 : 0.92, y: y + size + 18 }}
          transition={{ duration: 0.2 }}
        >
          {node.label.length > 12 ? `${node.label.slice(0, 12)}…` : node.label}
        </motion.text>
      ) : null}
    </motion.g>
  );
}

type MapProps = {
  roots: TreeNode[];
  openRootIds: string[];
  openMiddleIds: Record<string, string[]>;
  hoveredId: string;
  selectedNodeId: string | null;
  setHoveredId: (id: string) => void;
  onRootClick: (id: string) => void;
  onMiddleClick: (rootId: string, id: string) => void;
  onSelectNode: (node: TreeNode) => void;
};

function CellDivisionMindMap({ roots, openRootIds, openMiddleIds, hoveredId, selectedNodeId, setHoveredId, onRootClick, onMiddleClick, onSelectNode }: MapProps) {
  const size = 1080;
  const center = size / 2;
  const rootRadius = 310;
  const rootPositions = roots.map((_, idx) => {
    const angle = -Math.PI / 2 + (idx / Math.max(roots.length, 1)) * Math.PI * 2;
    return { ...polarPosition(idx, roots.length, rootRadius, center), angle };
  });

  const detailEntries: Array<{ key: string; node: TreeNode; x: number; y: number; parentX: number; parentY: number }> = [];

  return (
    <div className="flex items-center justify-center overflow-auto rounded-[2rem] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-inner border border-gray-100">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-[900px] w-full max-w-[1080px]">
        <motion.circle cx={center} cy={center} r={390} fill="none" stroke="#cbd5e1" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="4 10" animate={{ scale: [1, 1.02, 1], opacity: [0.25, 0.4, 0.25] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx={center} cy={center} r={190} fill="none" stroke="#e2e8f0" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="3 8" animate={{ scale: [1, 1.03, 1], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx={center} cy={center} r={62} fill="#0f172a" opacity="0.96" animate={{ r: [62, 65, 62], opacity: [0.96, 1, 0.96] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx={center} cy={center} r={49} fill="#ffffff" opacity="0.12" animate={{ r: [49, 45, 49], opacity: [0.12, 0.18, 0.12] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
        <text x={center} y={center - 4} textAnchor="middle" style={{ fill: "white", fontSize: 18, fontWeight: 700 }}>ICD</text>
        <text x={center} y={center + 18} textAnchor="middle" style={{ fill: "rgba(255,255,255,0.8)", fontSize: 11 }}>질병코드</text>

        {roots.map((root, idx) => {
          const rootPos = rootPositions[idx];
          const rootOpen = openRootIds.includes(root.id);
          const rootStyle = groupStyles[getGroupKey(root)] || groupStyles.default;
          const middleNodes = root.children || [];
          const middlePositions = getChildPositions(rootPos.x, rootPos.y, middleNodes.length, 205, rootPos.angle, Math.min(Math.PI * 0.62, 0.22 * Math.max(middleNodes.length - 1, 1)));

          return (
            <React.Fragment key={root.id}>
              <motion.path d={`M ${center} ${center} Q ${(center + rootPos.x) / 2} ${(center + rootPos.y) / 2 - 40} ${rootPos.x} ${rootPos.y}`} fill="none" stroke={rootOpen || hoveredId === root.id ? rootStyle.line : rootStyle.accent} strokeWidth={rootOpen || hoveredId === root.id ? 4 : 2.5} opacity={0.9} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...organicTransition, pathLength: { duration: 0.6 } } as any} />
              <Bubble node={root} x={rootPos.x} y={rootPos.y} size={60} active={rootOpen} hovered={hoveredId === root.id} selected={selectedNodeId === root.id} onHover={setHoveredId} onLeave={() => setHoveredId("")} onClick={(node) => { onRootClick(node.id); onSelectNode(node); }} />

              <AnimatePresence mode="popLayout">
                {rootOpen && middleNodes.map((middle, middleIdx) => {
                  const middlePos = middlePositions[middleIdx];
                  const middleOpen = (openMiddleIds[root.id] || []).includes(middle.id);
                  const smallNodes = middle.children || [];
                  const smallPositions = getChildPositions(middlePos.x, middlePos.y, smallNodes.length, 150, middlePos.angle, Math.min(Math.PI * 0.52, 0.18 * Math.max(smallNodes.length - 1, 1)));

                  return (
                    <React.Fragment key={middle.id}>
                      <motion.path d={`M ${rootPos.x} ${rootPos.y} Q ${(rootPos.x + middlePos.x) / 2} ${(rootPos.y + middlePos.y) / 2 - 20} ${middlePos.x} ${middlePos.y}`} fill="none" stroke={middleOpen || hoveredId === middle.id ? rootStyle.line : rootStyle.accent} strokeWidth={middleOpen || hoveredId === middle.id ? 3.6 : 2.4} opacity={0.85} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.85 }} exit={{ pathLength: 0, opacity: 0 }} transition={{ ...organicTransition, pathLength: { duration: 0.5 } } as any} />
                      <motion.g initial={{ opacity: 0, scale: 0.2, x: rootPos.x - middlePos.x, y: rootPos.y - middlePos.y }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} exit={{ opacity: 0, scale: 0.2, x: rootPos.x - middlePos.x, y: rootPos.y - middlePos.y }} transition={organicTransition as any}>
                        <Bubble node={middle} x={middlePos.x} y={middlePos.y} size={46} active={middleOpen} hovered={hoveredId === middle.id} selected={selectedNodeId === middle.id} onHover={setHoveredId} onLeave={() => setHoveredId("")} onClick={(node) => { onMiddleClick(root.id, node.id); onSelectNode(node); }} />
                      </motion.g>

                      <AnimatePresence mode="popLayout">
                        {middleOpen && smallNodes.map((small, smallIdx) => {
                          const smallPos = smallPositions[smallIdx];
                          const isSelected = selectedNodeId === small.id;
                          if (isSelected) detailEntries.push({ key: `${root.id}-${middle.id}-${small.id}`, node: small, x: smallPos.x, y: smallPos.y + 50, parentX: smallPos.x, parentY: smallPos.y });
                          return (
                            <React.Fragment key={small.id}>
                              <motion.path d={`M ${middlePos.x} ${middlePos.y} Q ${(middlePos.x + smallPos.x) / 2} ${(middlePos.y + smallPos.y) / 2 - 12} ${smallPos.x} ${smallPos.y}`} fill="none" stroke={hoveredId === small.id || isSelected ? rootStyle.line : rootStyle.accent} strokeWidth={hoveredId === small.id || isSelected ? 3 : 2} opacity={0.8} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }} exit={{ pathLength: 0, opacity: 0 }} transition={{ ...organicTransition, pathLength: { duration: 0.45 } } as any} />
                              <motion.g initial={{ opacity: 0, scale: 0.15, x: middlePos.x - smallPos.x, y: middlePos.y - smallPos.y }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} exit={{ opacity: 0, scale: 0.15, x: middlePos.x - smallPos.x, y: middlePos.y - smallPos.y }} transition={{ ...organicTransition, stiffness: 210, damping: 16 } as any}>
                                <Bubble node={small} x={smallPos.x} y={smallPos.y} size={34} hovered={hoveredId === small.id} selected={isSelected} onHover={setHoveredId} onLeave={() => setHoveredId("")} onClick={(node) => onSelectNode(node)} />
                              </motion.g>
                            </React.Fragment>
                          );
                        })}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </React.Fragment>
          );
        })}

        <AnimatePresence>
          {detailEntries.map(({ key, node, x, y, parentX, parentY }) => {
            const style = (groupStyles[getGroupKey(node)] || groupStyles.default) as { line: string, fill: string, accent: string, text: string };
            const detailWidth = 160;
            const detailHeight = 62;
            const left = Math.max(16, Math.min(x - detailWidth / 2, size - detailWidth - 16));
            const top = Math.min(y, size - detailHeight - 16);
            return (
              <g key={key}>
                <motion.line x1={parentX} y1={parentY + 34} x2={x} y2={top - 6} stroke={style.accent} strokeWidth={1.8} strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }} exit={{ pathLength: 0, opacity: 0 }} transition={{ duration: 0.25 }} />
                <motion.foreignObject x={left} y={top} width={detailWidth} height={detailHeight} initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.2 }}>
                  <div className="h-full w-full rounded-xl border bg-white/95 px-3 py-2 shadow-lg backdrop-blur" style={{ borderColor: `${style.accent}66` }}>
                    <div className="text-[11px] font-bold" style={{ color: style.text }}>{node.id} · {node.label}</div>
                    <div className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-600">{node.detail || node.subtitle || `${node.label}에 대한 상세 항목입니다.`}</div>
                  </div>
                </motion.foreignObject>
              </g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
}

function DetailCard({ root, middle, selectedNode, hoveredId }: { root: TreeNode | null; middle: TreeNode | null; selectedNode: TreeNode | null; hoveredId: string }) {
  const style = (root ? groupStyles[getGroupKey(root)] || groupStyles.default : groupStyles.default) as { line: string, fill: string, accent: string, text: string };
  const smallCount = middle?.children?.length || 0;
  const focusNode = selectedNode || middle || root;

  return (
    <div className="bg-white rounded-[2rem] border-0 shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-black text-gray-900">현재 분열 상태</h3>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="rounded-2xl p-4" style={{ background: style.fill, border: `1px solid ${style.accent}55` }}>
          <div className="text-xs" style={{ color: style.text }}>대분류</div>
          <div className="mt-1 font-semibold" style={{ color: style.text }}>{root ? `${root.id} ${root.label}` : "선택 전"}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
          <div className="text-xs text-slate-500">중분류</div>
          <div className="mt-1 font-semibold text-slate-900">{middle ? `${middle.id} ${middle.label}` : "숨김 상태"}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
          <div className="text-xs text-slate-500">소분류</div>
          <div className="mt-1 font-semibold text-slate-900">{middle ? `${smallCount}개 표시 가능` : "중분류를 클릭하면 나타남"}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
          <div className="text-xs text-slate-500">선택된 코드 상세</div>
          <div className="mt-1 font-semibold text-slate-900">{focusNode ? `${focusNode.id} ${focusNode.label}` : "선택된 코드 없음"}</div>
          <div className="mt-1 text-xs leading-5 text-slate-600">{focusNode?.detail || focusNode?.subtitle || "노드를 클릭하면 상세 내용이 표시됩니다."}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
          <div className="text-xs text-slate-500">마우스 반응</div>
          <div className="mt-1 font-medium text-slate-900">{hoveredId || "노드에 마우스를 올려보세요"}</div>
        </div>
      </div>
    </div>
  );
}

export default function ICDMindMap() {
  const [query, setQuery] = useState("");
  const [selectedQuick, setSelectedQuick] = useState("");
  const [hoveredId, setHoveredId] = useState("");
  const [openRootIds, setOpenRootIds] = useState<string[]>([]);
  const [openMiddleIds, setOpenMiddleIds] = useState<Record<string, string[]>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const effectiveQuery = query || selectedQuick;
  const filteredRoots = useMemo(() => (effectiveQuery ? filterTree(icdTree, effectiveQuery) : icdTree), [effectiveQuery]);
  const matchedPath = useMemo(() => (effectiveQuery ? findPath(icdTree, effectiveQuery) : []), [effectiveQuery]);

  const displayRoots = filteredRoots.length ? filteredRoots : icdTree;
  const derivedRootId = matchedPath[0]?.id || null;
  const derivedMiddleId = matchedPath[1]?.id || null;
  const activeRoot = displayRoots.find((item) => item.id === derivedRootId) || displayRoots.find((item) => openRootIds.includes(item.id)) || null;
  const activeMiddle = activeRoot?.children?.find((item) => item.id === derivedMiddleId) || activeRoot?.children?.find((item) => (openMiddleIds[activeRoot.id] || []).includes(item.id)) || null;

  const selectedNode = useMemo(() => {
    const searchIn = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === selectedNodeId) return node;
        if (node.children?.length) {
          const found = searchIn(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return selectedNodeId ? searchIn(displayRoots) : null;
  }, [displayRoots, selectedNodeId]);

  const quickKeywords = ["C16", "I63", "S72", "M51", "K35", "갑상선암", "뇌경색", "골절"];

  const handleRootClick = (id: string) => {
    if (effectiveQuery) return;
    setOpenRootIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleMiddleClick = (rootId: string, id: string) => {
    if (effectiveQuery) return;
    setOpenMiddleIds((prev) => {
      const current = prev[rootId] || [];
      return {
        ...prev,
        [rootId]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
      };
    });
  };

  return (
    <div className="w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <Brain className="h-7 w-7 text-primary-600" />
              질병코드 시각적 탐색
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              분류 체계를 시각적으로 탐색해보세요. 각 분류를 클릭하면 세포가 분열하듯 상세 항목이 펼쳐집니다.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedQuick("");
                  }}
                  placeholder="예: C16, I63, S72, M51, K35, 갑상선암, 뇌경색"
                  className="w-full h-12 bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-4 text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button
                className="h-12 px-6 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all"
                onClick={() => {
                  setQuery("");
                  setSelectedQuick("");
                  setHoveredId("");
                  setOpenRootIds([]);
                  setOpenMiddleIds({});
                  setSelectedNodeId(null);
                }}
              >
                초기화
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickKeywords.map((item) => (
                <button
                  key={item}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-black transition-all ${selectedQuick === item ? "bg-primary-600 text-white shadow-md scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  onClick={() => {
                    setSelectedQuick(item);
                    setQuery("");
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900">시각적 마인드맵</h3>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
              {effectiveQuery ? `검색: ${effectiveQuery}` : '탐색 모드'}
            </div>
          </div>
          <CellDivisionMindMap
            roots={displayRoots}
            openRootIds={effectiveQuery && derivedRootId ? [derivedRootId] : openRootIds}
            openMiddleIds={effectiveQuery && derivedRootId && derivedMiddleId ? { [derivedRootId]: [derivedMiddleId] } : openMiddleIds}
            hoveredId={hoveredId}
            selectedNodeId={selectedNodeId || matchedPath[2]?.id || matchedPath[1]?.id || matchedPath[0]?.id || null}
            setHoveredId={setHoveredId}
            onRootClick={handleRootClick}
            onMiddleClick={handleMiddleClick}
            onSelectNode={(node) => setSelectedNodeId(node.id)}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-black text-gray-900">색상 범례</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["C코드", groupStyles.C],
                ["I코드", groupStyles.I],
                ["S코드", groupStyles.S],
                ["M코드", groupStyles.M],
                ["K코드", groupStyles.K],
                ["R코드", groupStyles.R],
              ].map(([name, style]) => {
                const s = style as { line: string, fill: string, accent: string, text: string };
                return (
                  <div key={name as string} className="flex items-center gap-2 rounded-xl border p-3" style={{ borderColor: `${s.accent}33`, backgroundColor: `${s.fill}CC` }}>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.accent }} />
                    <span className="font-bold" style={{ color: s.text }}>{name as string}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <DetailCard root={activeRoot} middle={activeMiddle} selectedNode={selectedNode || matchedPath[2] || matchedPath[1] || matchedPath[0] || null} hoveredId={hoveredId} />

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] shadow-lg p-6 text-white space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5 text-primary-400" />
              활용 가이드
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-gray-300 font-medium">
              <p className="flex gap-2"><span className="text-primary-400 font-black">•</span> 처음에는 대분류만 보입니다. 원하시는 코드를 클릭하세요.</p>
              <p className="flex gap-2"><span className="text-primary-400 font-black">•</span> 분류를 클릭하면 세포가 분열하듯 상세 가지가 펼쳐집니다.</p>
              <p className="flex gap-2"><span className="text-primary-400 font-black">•</span> 구외곽으로 퍼지는 레이아웃으로 여러 개를 동시에 열어볼 수 있습니다.</p>
              <p className="flex gap-2"><span className="text-primary-400 font-black">•</span> 특정 코드를 검색하면 해당 경로가 자동으로 강조됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InformationCircleIcon({ className, style }: { className?: string, style?: any }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
