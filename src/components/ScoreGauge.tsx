import React from 'react';
import { RiskEvaluationResult } from '../types';

interface ScoreGaugeProps {
  result: RiskEvaluationResult | null;
  isLoading?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ result, isLoading = false }) => {
  const score = result ? result.score : 0;

  // Arc calculation for semi-circle gauge (180 degrees)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 80) return { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    if (val >= 60) return { stroke: '#f97316', text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
    if (val >= 30) return { stroke: '#eab308', text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' };
    if (val >= 10) return { stroke: '#3b82f6', text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' };
    return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };
  };

  const theme = getColor(score);

  const getActionBadge = (action?: string) => {
    switch (action) {
      case 'BLOCK':
        return { label: 'BLOCK (遮断)', class: 'bg-red-500 text-white' };
      case 'QUARANTINE':
        return { label: 'QUARANTINE (検疫)', class: 'bg-orange-500 text-white' };
      case 'INSPECT':
        return { label: 'INSPECT (精密検査)', class: 'bg-amber-500 text-black font-semibold' };
      case 'MONITOR':
        return { label: 'MONITOR (監視)', class: 'bg-blue-500 text-white' };
      default:
        return { label: 'ALLOW (許可)', class: 'bg-emerald-600 text-white' };
    }
  };

  const actionInfo = getActionBadge(result?.action);

  return (
    <div id="jev-score-gauge-card" className="flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.stroke }}
      />

      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider font-mono text-slate-400 font-semibold">
          JEV Risk Score Assessment
        </span>
        {result && (
          <span className={`px-2.5 py-1 text-xs rounded-full font-mono font-medium ${actionInfo.class}`}>
            {actionInfo.label}
          </span>
        )}
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative w-56 h-32 flex items-end justify-center mb-2">
        <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="25%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isLoading ? circumference * 0.5 : strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <div className="flex items-baseline">
            <span className={`text-5xl font-black font-mono tracking-tight ${isLoading ? 'animate-pulse text-slate-400' : theme.text}`}>
              {isLoading ? '--' : score}
            </span>
            <span className="text-xl font-bold text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">悪意の度合い</span>
        </div>
      </div>

      {/* Risk Level Callout */}
      {result ? (
        <div className={`mt-3 px-4 py-1.5 rounded-lg border ${theme.bg} ${theme.border} flex items-center gap-2`}>
          <span className={`text-base font-bold ${theme.text}`}>
            {result.levelJa} {result.score}%
          </span>
          <span className="text-xs font-mono text-slate-400">
            ({result.level})
          </span>
        </div>
      ) : (
        <div className="mt-3 px-4 py-1.5 rounded-lg border border-slate-800 bg-slate-800/40 text-xs text-slate-400 font-mono">
          入力待機中 (Awaiting Input)
        </div>
      )}

      {/* Gauge Legend Scale */}
      <div className="w-full mt-5 pt-3 border-t border-slate-800/80 flex justify-between text-[10px] font-mono text-slate-400">
        <span className="text-emerald-400">0% 安全</span>
        <span className="text-blue-400">10% 低</span>
        <span className="text-amber-400">30% 中</span>
        <span className="text-orange-400">60% 高</span>
        <span className="text-red-400">80% 深刻</span>
      </div>
    </div>
  );
};
