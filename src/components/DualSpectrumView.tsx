import React from 'react';
import { DualSpectrumMetrics } from '../types';
import { Brain, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DualSpectrumViewProps {
  metrics?: DualSpectrumMetrics;
}

export const DualSpectrumView: React.FC<DualSpectrumViewProps> = ({ metrics }) => {
  if (!metrics) return null;

  const getSpectrumBarColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 30) return 'bg-amber-400';
    if (score >= 10) return 'bg-blue-400';
    return 'bg-emerald-400';
  };

  return (
    <div id="jev-dual-spectrum-panel" className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-sm font-bold text-slate-200">
            JEV Dual-Spectrum Analysis (二重スペクトラム判定)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Intent × Pattern Verification
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spectrum A: Intent / Semantic Spectrum */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Spectrum A: 意図 (Semantic Intent)</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {metrics.intentScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-500 ${getSpectrumBarColor(metrics.intentScore)}`}
                style={{ width: `${metrics.intentScore}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {metrics.intentSummary}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-900 flex items-center gap-1.5 text-[11px] text-slate-400">
            {metrics.intentScore >= 50 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span>指示の上書き・機密奪取意図の検証</span>
          </div>
        </div>

        {/* Spectrum B: Pattern / Syntax Spectrum */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Spectrum B: 構文 (Pattern / Syntax)</span>
              </div>
              <span className="text-xs font-mono font-bold text-purple-300">
                {metrics.patternScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-500 ${getSpectrumBarColor(metrics.patternScore)}`}
                style={{ width: `${metrics.patternScore}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {metrics.patternSummary}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-900 flex items-center gap-1.5 text-[11px] text-slate-400">
            {metrics.patternScore >= 50 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span>デリミタ偽装・脱獄キーワード・難読化の検証</span>
          </div>
        </div>
      </div>
    </div>
  );
};
