import { useState } from 'react';
import { Calendar, Users, Layers, User, Tag, Check, RotateCcw } from 'lucide-react';
import type { MatchInfo, Format, Surface, OpponentType } from '@/types';
import { OPPONENT_TYPE_LABELS } from '@/types';
import { generateId } from '@/storage';

interface Props {
  existing: MatchInfo | null;
  onCreate: (info: MatchInfo) => void;
}

export default function NewMatch({ existing, onCreate }: Props) {
  const [date, setDate] = useState(
    existing ? existing.date : new Date().toISOString().slice(0, 10)
  );
  const [format, setFormat] = useState<Format>(existing?.format ?? 'singles');
  const [surface, setSurface] = useState<Surface>(existing?.surface ?? 'hard');
  const [opponentName, setOpponentName] = useState(existing?.opponentName ?? '');
  const [opponentType, setOpponentType] = useState<OpponentType>(existing?.opponentType ?? 'unknown');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: existing?.id ?? generateId(),
      date,
      format,
      surface,
      opponentName,
      opponentType,
      createdAt: existing?.createdAt ?? Date.now(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls =
    'w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/50 transition-colors';

  const labelCls = 'flex items-center gap-2 text-sm font-medium text-slate-300 mb-2';

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">新建比赛</h2>
        <p className="text-slate-400 text-sm mt-1">设置比赛基本信息，开始记录数据</p>
      </div>

      {existing && (
        <div className="mb-6 rounded-xl bg-lime-500/10 border border-lime-500/30 px-4 py-3 text-sm text-lime-300">
          当前已有比赛记录 — 提交将覆盖现有信息
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <div>
          <label className={labelCls}>
            <Calendar size={16} className="text-lime-400" /> 比赛日期
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={inputCls}
          />
        </div>

        {/* Format */}
        <div>
          <label className={labelCls}>
            <Users size={16} className="text-lime-400" /> 赛制
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['singles', 'doubles'] as Format[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`rounded-xl px-4 py-3 font-medium transition-all border ${
                  format === f
                    ? 'bg-lime-400 text-slate-900 border-lime-400'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {f === 'singles' ? '单打' : '双打'}
              </button>
            ))}
          </div>
        </div>

        {/* Surface */}
        <div>
          <label className={labelCls}>
            <Layers size={16} className="text-lime-400" /> 场地
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['hard', 'clay'] as Surface[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSurface(s)}
                className={`rounded-xl px-4 py-3 font-medium transition-all border flex items-center justify-center gap-2 ${
                  surface === s
                    ? 'bg-lime-400 text-slate-900 border-lime-400'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full ${s === 'hard' ? 'bg-blue-400' : 'bg-orange-500'}`}
                />
                {s === 'hard' ? '硬地' : '红土'}
              </button>
            ))}
          </div>
        </div>

        {/* Opponent Name */}
        <div>
          <label className={labelCls}>
            <User size={16} className="text-lime-400" /> 对手信息
          </label>
          <input
            type="text"
            value={opponentName}
            onChange={(e) => setOpponentName(e.target.value)}
            placeholder="对手姓名 / 特征"
            className={inputCls}
          />
        </div>

        {/* Opponent Type */}
        <div>
          <label className={labelCls}>
            <Tag size={16} className="text-lime-400" /> 对手类型标签
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(OPPONENT_TYPE_LABELS) as OpponentType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOpponentType(t)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all border ${
                  opponentType === t
                    ? 'bg-lime-400 text-slate-900 border-lime-400'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {OPPONENT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 font-bold text-slate-900 transition-all hover:bg-lime-300 active:scale-[0.98]"
          >
            {saved ? <Check size={20} /> : <RotateCcw size={18} />}
            {existing ? '更新比赛' : '创建比赛'}
          </button>
        </div>
      </form>
    </div>
  );
}
