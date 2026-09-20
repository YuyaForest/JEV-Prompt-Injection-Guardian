import { RiskEvaluationResult, RiskLevelEn, RiskLevelJa } from '../types';

export function determineRiskLevel(score: number): { level: RiskLevelEn; levelJa: RiskLevelJa; action: RiskEvaluationResult['action'] } {
  if (score >= 80) {
    return { level: 'Critical', levelJa: '深刻', action: 'BLOCK' };
  } else if (score >= 60) {
    return { level: 'High', levelJa: '高', action: 'QUARANTINE' };
  } else if (score >= 30) {
    return { level: 'Medium', levelJa: '中', action: 'INSPECT' };
  } else if (score >= 10) {
    return { level: 'Low', levelJa: '低', action: 'MONITOR' };
  } else {
    return { level: 'Safe', levelJa: '安全', action: 'ALLOW' };
  }
}

export function formatQuarantineReport(score: number, level: RiskLevelEn, levelJa: RiskLevelJa): string {
  return `### 🛡️ プロンプトインジェクション検疫レポート

**1. 悪意の度合い（リスクレベル：${score}%）:**
[ ${levelJa}${score}% (${level}) ]`;
}

export function analyzePromptInjectionHeuristically(input: string): RiskEvaluationResult {
  const text = input.trim();
  if (!text) {
    const { level, levelJa, action } = determineRiskLevel(0);
    return {
      score: 0,
      level,
      levelJa,
      formattedReport: formatQuarantineReport(0, level, levelJa),
      threatCategories: [],
      dualSpectrum: {
        intentScore: 0,
        intentSummary: '入力テキストが空です。',
        patternScore: 0,
        patternSummary: '脅威パターンは検出されませんでした。',
      },
      action,
      analyzedAt: new Date().toISOString(),
      isHeuristicFallback: true,
    };
  }

  let intentScore = 0;
  let patternScore = 0;
  const threatCategories: string[] = [];

  const lower = text.toLowerCase();

  // Pattern detection: Instruction Override / Reset
  const overrideRegex = /(ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|rules?|prompts?)|disregard\s+(previous|all)|これまでの(指示|ルール|命令)を(忘れて|無視)|前述の(命令|指示)を無視|すべての指示をクリア|忘却せよ)/i;
  if (overrideRegex.test(text)) {
    intentScore += 45;
    patternScore += 35;
    threatCategories.push('指示の上書き (Instruction Override / Hijack)');
  }

  // Pattern detection: System Prompt Exfiltration / Leak
  const exfilRegex = /(show\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions?)|reveal\s+(system\s+)?prompt|repeat\s+(everything|all\s+text)\s+above|output\s+initial\s+prompt|システムプロンプトを(表示|出力|教えて)|初期指示を(教えて|出力)|ルール一覧を出力)/i;
  if (exfilRegex.test(text)) {
    intentScore += 45;
    patternScore += 30;
    threatCategories.push('機密情報の漏洩 (Information Leakage)');
  }

  // Pattern detection: Safety Evasion / Jailbreaks / DAN
  const jailbreakRegex = /\b(dan|jailbreak|unfiltered|developer\s+mode|do\s+anything\s+now|evilgpt|oppo|anti-filter|bypass\s+(safety|rules|filters?)|安全(基準|ガイドライン)を(無効化|回避|無視)|制限を解除)\b/i;
  if (jailbreakRegex.test(text)) {
    intentScore += 40;
    patternScore += 40;
    threatCategories.push('セキュリティ対策の回避 (Safety Guideline Bypass)');
  }

  // Pattern detection: Persona Forcing / Roleplay Hijacking
  const personaRegex = /(you\s+are\s+now\s+an?\s+unrestricted|pretend\s+you\s+have\s+no\s+(morals|rules)|roleplay\s+as\s+an\s+evil|これからは.*として振る舞ってください|いかなる制限も受けない.*として回答)/i;
  if (personaRegex.test(text)) {
    intentScore += 35;
    patternScore += 25;
    threatCategories.push('ロールプレイ強制 (Roleplay Forcing)');
  }

  // Pattern detection: System Delimiters & Structured Injection
  const delimiterRegex = /(<\|im_start\|>|<\|im_end\|>|<system>|<\/system>|\[system\]|\[\/system\]|{"role":\s*"system"}|###\s*system|###\s*instruction|```\s*json\s*\{\s*"override")/i;
  if (delimiterRegex.test(text)) {
    patternScore += 45;
    intentScore += 20;
    threatCategories.push('システムデリミタ偽装 (System Delimiter Manipulation)');
  }

  // Pattern detection: Obfuscation / Base64 / Hex
  const base64Suspect = /[A-Za-z0-9+/=]{40,}/.test(text) && /(base64|decode|eval|run|execute)/i.test(text);
  if (base64Suspect) {
    patternScore += 35;
    intentScore += 25;
    threatCategories.push('難読化・エンコード (Obfuscation / Encoding)');
  }

  // Normalization
  intentScore = Math.min(100, intentScore);
  patternScore = Math.min(100, patternScore);

  // Overall score: Weighted average with emphasis on highest detected spectrum
  let finalScore = Math.round(intentScore * 0.55 + patternScore * 0.45);
  if (threatCategories.length >= 2) {
    finalScore = Math.min(100, Math.max(finalScore, 75));
  }
  if (threatCategories.length >= 3) {
    finalScore = Math.min(100, Math.max(finalScore, 88));
  }

  const { level, levelJa, action } = determineRiskLevel(finalScore);

  let intentSummary = '通常の発話・質問であり、悪意ある命令改変の意図は見られません。';
  if (intentScore >= 70) {
    intentSummary = '指示の上書きやシステムプロンプト漏洩を狙った攻撃意図が強く検知されました。';
  } else if (intentScore >= 40) {
    intentSummary = 'AIの振る舞いを誘導・制限回避させようとする疑わしい意図が検知されました。';
  } else if (intentScore > 0) {
    intentSummary = '軽微な誘導またはシステム関連の言及が含まれています。';
  }

  let patternSummary = '標準的な自然言語テキストです。インジェクション特有の構文はありません。';
  if (patternScore >= 70) {
    patternSummary = 'システム特殊タグ、脱獄キーワード、またはエスケープ構文が複数検知されました。';
  } else if (patternScore >= 40) {
    patternSummary = 'プロンプトインジェクションで頻出するデリミタや構文パターンが検知されました。';
  } else if (patternScore > 0) {
    patternSummary = '特定のシステム構文や不自然な形式が検知されました。';
  }

  return {
    score: finalScore,
    level,
    levelJa,
    formattedReport: formatQuarantineReport(finalScore, level, levelJa),
    threatCategories,
    dualSpectrum: {
      intentScore,
      intentSummary,
      patternScore,
      patternSummary,
    },
    action,
    analyzedAt: new Date().toISOString(),
    isHeuristicFallback: true,
  };
}
