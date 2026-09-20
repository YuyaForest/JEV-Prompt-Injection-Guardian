import React from 'react';
import { EvaluationHistoryItem } from '../types';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

interface EvaluationHistoryProps {
  history: EvaluationHistoryItem[];
  onSelect: (item: EvaluationHistoryItem) => void;
  onClear: () => void;
}

export const EvaluationHistory: React.FC<EvaluationHistoryProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) return null;

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (score >= 60) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (score >= 30) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (score >= 10) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div id="jev-evaluation-history" className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            判定履歴 (Evaluation History)
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {history.length}
          </span>
        </div>
        <button
          id="clear-history-btn"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
          title="履歴をクリア"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>履歴削除</span>
        </button>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {history.map((item) => {
          const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-slate-700 hover:bg-slate-800/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-mono font-bold border shrink-0 ${getScoreBadge(
                    item.result.score
                  )}`}
                >
                  {item.result.score}%
                </span>
                <span className="text-xs text-slate-300 truncate max-w-xs sm:max-w-md group-hover:text-cyan-300 transition-colors">
                  {item.userInput}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400 font-mono">
                <span>{timeStr}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
