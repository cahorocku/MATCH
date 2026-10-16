import { useMemo, useState } from 'react';
import {
  Zap, Target, ArrowUp, Gift, Minus, ArrowUpRight, X,
  Scissors, AlertTriangle,
  Trash2, AlertCircle, CheckCircle2,
} from 'lucide-react';
import type { ScoreLogEntry, ScoreActionKey } from '@/types';
import { SCORE_ACTIONS } from '@/types';

const ICON_MAP: Record<string, typeof Zap> = {
  Zap, Target, ArrowUp, Gift, Minus, ArrowUpRight, X,
  Scissors, AlertTriangle,
};

interface Props {
  matchStarted: boolean;
  scoreLogs: ScoreLogEntry[];
  onAdd: (key: ScoreActionKey) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function ScorePanel({ matchStarted, scoreLogs, onAdd, onRemove, onClear }: Props) {
  const [poppingKey, setPoppingKey] = useState<string | null>(null);

  const points = SCORE_ACTIONS.filter((a) => a.category === 'point');
  const errors = SCORE_ACTIONS.filter((a) => a.category === 'error');

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const log of scoreLogs) {
      map[log.key] = (map[log.key] ?? 0) + 1;
    }
    return map;
  }, [scoreLogs]);

  const totalPoints = points.reduce((s, p) => s + (counts[p.key] ?? 0), 0);
  const totalErrors = errors.reduce((s, e) => s + (counts[e.key] ?? 0), 0);

  const handleClick = (key: ScoreActionKey) => {
    onAdd(key);
    setPoppingKey(key);
    setTimeout(() => setPoppingKey(null), 250);
  };

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (!matchStarted) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 text-center animate-slide-up">
        <AlertCircle size={48} className="text-slate-600 mb-4" />
        <p className="text-slate-400 text-lg">请先在「新建比赛」中创建比赛</p>
        <p className="text-slate-500 text-sm mt-1">创建后即可开始记分标记</p>
      </div>
    );
  }

  const pointBtn =
    'relative flex flex-col items-center justify-center gap-1 rounded-2xl border transition-all active:scale-95 select-none ';
  const pointBtnBase =
    'bg-lime-500/15 border-lime-500/30 text-lime-300 hover:bg-lime-500/25 hover:border-lime-500/50';
  const errorBtnBase =
    'bg-red-500/10 border-red-500/25 text-red-300 hover:bg-red-500/20 hover:border-red-500/40';

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      {/* Summary bar */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex-1 rounded-xl bg-slate-800/60 border border-slate-700 px-4 py-2.5 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-lime-400" />
          <span className="text-slate-400 text-sm">得分</span>
          <span className="text-lime-400 font-bold text-lg ml-auto">{totalPoints}</span>
        </div>
        <div className="flex-1 rounded-xl bg-slate-800/60 border border-slate-700 px-4 py-2.5 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-400" />
          <span className="text-slate-400 text-sm">失误</span>
          <span className="text-red-400 font-bold text-lg ml-auto">{totalErrors}</span>
        </div>
        {scoreLogs.length > 0 && (
          <button
            onClick={onClear}
            className="rounded-xl bg-slate-800/60 border border-slate-700 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
            title="清空记分"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Point buttons */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-lime-400" /> 得分
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {points.map((action) => {
            const Icon = ICON_MAP[action.icon] ?? Zap;
            const count = counts[action.key] ?? 0;
            return (
              <button
                key={action.key}
                onClick={() => handleClick(action.key)}
                className={`${pointBtn} ${pointBtnBase} ${poppingKey === action.key ? 'animate-pop' : ''} px-3 py-4`}
              >
                <Icon size={22} />
                <span className="text-sm font-medium">{action.label}</span>
                <span
                  className={`text-2xl font-black transition-all ${
                    count > 0 ? 'text-lime-300' : 'text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error buttons */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-red-400" /> 失误
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {errors.map((action) => {
            const Icon = ICON_MAP[action.icon] ?? X;
            const count = counts[action.key] ?? 0;
            return (
              <button
                key={action.key}
                onClick={() => handleClick(action.key)}
                className={`${pointBtn} ${errorBtnBase} ${poppingKey === action.key ? 'animate-pop' : ''} px-3 py-4`}
              >
                <Icon size={22} />
                <span className="text-sm font-medium">{action.label}</span>
                <span
                  className={`text-2xl font-black transition-all ${
                    count > 0 ? 'text-red-300' : 'text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live log */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-slate-400" /> 实时日志
        </h3>
        {scoreLogs.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-8 text-center text-slate-500 text-sm">
            还没有记录，点击上方按钮开始记分
          </div>
        ) : (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar">
            {[...scoreLogs].reverse().map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-2.5 animate-slide-up"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    log.category === 'point' ? 'bg-lime-400' : 'bg-red-400'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    log.category === 'point' ? 'text-lime-300' : 'text-red-300'
                  }`}
                >
                  {log.label}
                </span>
                <span className="text-xs text-slate-500 ml-auto">
                  {formatElapsed(log.elapsed)} · {formatTime(log.timestamp)}
                </span>
                <button
                  onClick={() => onRemove(log.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
