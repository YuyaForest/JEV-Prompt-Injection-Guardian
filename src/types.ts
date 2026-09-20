export type RiskLevelEn = 'Critical' | 'High' | 'Medium' | 'Low' | 'Safe';
export type RiskLevelJa = '深刻' | '高' | '中' | '低' | '安全';

export interface DualSpectrumMetrics {
  intentScore: number;       // 0-100: Semantic intent, instruction tampering, role manipulation
  intentSummary: string;     // Brief summary of semantic intent
  patternScore: number;      // 0-100: Structural syntax, delimiters, bypass keywords, encodings
  patternSummary: string;    // Brief summary of structural syntax
}

export interface RiskEvaluationResult {
  score: number;             // 0-100%
  level: RiskLevelEn;        // Critical, High, Medium, Low, Safe
  levelJa: RiskLevelJa;      // 深刻, 高, 中, 低, 安全
  formattedReport: string;   // The exact report specified in instructions
  threatCategories: string[]; // Detected threat types (Leak, Misinfo, Guideline bypass, etc.)
  dualSpectrum: DualSpectrumMetrics;
  action: 'BLOCK' | 'QUARANTINE' | 'INSPECT' | 'MONITOR' | 'ALLOW';
  analyzedAt: string;
  isHeuristicFallback?: boolean;
  engine?: 'jev' | 'gemini' | 'heuristic';
  jevDetails?: {
    model: string;
    confidence: number;
    probabilities?: Record<string, number>;
  };
}

export interface EvaluationHistoryItem {
  id: string;
  userInput: string;
  result: RiskEvaluationResult;
  timestamp: number;
}
