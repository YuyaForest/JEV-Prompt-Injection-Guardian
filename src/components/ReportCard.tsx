import React, { useState } from 'react';
import { RiskEvaluationResult } from '../types';
import { Copy, Check, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ReportCardProps {
  result: RiskEvaluationResult | null;
}

export const ReportCard: React.FC<ReportCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div id="jev-report-card-empty" className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center min-h-[220px]">
        <ShieldCheck className="w-10 h-10 text-slate-400 mb-2 opacity-60" />
        <h4 className="text-sm font-semibold text-slate-300">検疫レポート未生成</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          テキストを入力して「JEVリスク判定を実行」ボタンを押すと、公式フォーマットの検疫レポートが出力されます。
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.formattedReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const isSevere = result.score >= 60;

  return (
    <div id="jev-report-card" className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isSevere ? (
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-bold text-slate-200">
            JEV Quarantine Report Output
          </span>
          {result.engine === 'jev' ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              JEV System One ({result.jevDetails?.model || 'jev-latest'})
            </span>
          ) : result.engine === 'gemini' ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-mono">
              Gemini Engine
            </span>
          ) : result.isHeuristicFallback ? (
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              Heuristic Engine
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {result.jevDetails?.confidence !== undefined && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
              JEV 確信度: {Math.round(result.jevDetails.confidence * 100)}%
            </span>
          )}
          <button
          id="copy-report-btn"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
          title="レポートをクリップボードにコピー"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">コピー完了</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>コピー</span>
            </>
          )}
        </button>
        </div>
      </div>

      {/* Raw Output Block in exact requested format */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
        {result.formattedReport}
      </div>

      {/* Threat vectors tag list */}
      {result.threatCategories && result.threatCategories.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
            検知された脅威カテゴリ (Detected Threat Vectors)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {result.threatCategories.map((threat, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-red-950/50 text-red-300 border border-red-800/40"
              >
                {threat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
