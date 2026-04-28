/**
 * Analysis Engine (Core Product)
 * 
 * Centralized logic for insurance coverage analysis and pricing.
 */

export interface PolicyData {
  productName: string;
  companyName: string;
  premium: number;
  coverageList: { name: string; amount: number }[];
}

export interface AnalysisResult {
  score: number;
  status: 'excellent' | 'good' | 'average' | 'critical';
  tags: string[];
  recommendations: string[];
  locked?: boolean; // Indicates if the detailed analysis is hidden behind a paywall
}

/**
 * Main analysis algorithm
 */
export function analyzeCoverage(policies: PolicyData[]): AnalysisResult {
  const totalPremium = policies.reduce((sum, p) => sum + p.premium, 0);
  const coverageMap = new Map<string, number>();
  
  policies.forEach(p => {
    p.coverageList.forEach(c => {
      coverageMap.set(c.name, (coverageMap.get(c.name) || 0) + c.amount);
    });
  });

  const tags: string[] = [];
  const recommendations: string[] = [];
  let score = 75;

  // Mock Analysis Logic
  if (!coverageMap.has("암진단비") || (coverageMap.get("암진단비") || 0) < 30000000) {
    tags.push("암 보장 부족");
    recommendations.push("중증 질환 대비를 위해 암 진단비를 최소 3천만 원 이상으로 보충하세요.");
    score -= 15;
  } else {
    tags.push("충분한 암 보장");
  }

  if (totalPremium > 300000) {
    tags.push("보험료 과다");
    recommendations.push("소득 대비 보험료 비중이 높습니다. 불필요한 특약을 정리해보세요.");
    score -= 10;
  }

  if (!coverageMap.has("실손의료비")) {
    tags.push("실손 의료비 미가입");
    recommendations.push("기본적인 병원비 부담을 줄이기 위해 실손보험 가입을 권장합니다.");
    score -= 20;
  }

  const status = score > 90 ? "excellent" : score > 70 ? "good" : score > 50 ? "average" : "critical";

  return {
    score: Math.max(0, score),
    status,
    tags,
    recommendations
  };
}

/**
 * Constants for Pricing & Beta
 */
export const PRICING = {
  REGULAR: 4900,
  BETA: 0,
  MODE: 'BETA' as 'BETA' | 'PAID'
};
