import { useState } from 'react';
import { Video, Tag, FileText, Plus, Clock, Trash2 } from 'lucide-react';
import type { ReviewEntry } from '@/types';
import { REVIEW_TAGS } from '@/types';
import { generateId } from '@/storage';

interface Props {
  reviews: ReviewEntry[];
  onAdd: (entry: ReviewEntry) => void;
  onRemove: (id: string) => void;
}

export default function VideoReview({ reviews, onAdd, onRemove }: Props) {
  const [videoTimestamp, setVideoTimestamp] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTimestamp.trim()) {
      setError('请输入录像时间戳');
      return;
    }
    onAdd({
      id: generateId(),
      videoTimestamp: videoTimestamp.trim(),
      tags: selectedTags,
      note: note.trim(),
      createdAt: Date.now(),
    });
    setVideoTimestamp('');
    setSelectedTags([]);
    setNote('');
    setError('');
  };

  const inputCls =
    'w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/50 transition-colors';
  const labelCls = 'flex items-center gap-2 text-sm font-medium text-slate-300 mb-2';

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">录像复盘</h2>
        <p className="text-slate-400 text-sm mt-1">记录关键时刻，关联标签与思考</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 mb-6">
        <div>
          <label className={labelCls}>
            <Clock size={16} className="text-lime-400" /> 录像时间戳
          </label>
          <input
            type="text"
            value={videoTimestamp}
            onChange={(e) => setVideoTimestamp(e.target.value)}
            placeholder="如 14:20"
            className={inputCls}
          />
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className={labelCls}>
            <Tag size={16} className="text-lime-400" /> 标签选择
          </label>
          <div className="flex flex-wrap gap-2">
            {REVIEW_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all border ${
                  selectedTags.includes(tag)
                    ? 'bg-lime-400 text-slate-900 border-lime-400'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>
            <FileText size={16} className="text-lime-400" /> 复盘思考
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="记录你的思考、战术分析..."
            rows={3}
            className={inputCls + ' resize-none'}
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 font-bold text-slate-900 transition-all hover:bg-lime-300 active:scale-[0.98]"
        >
          <Plus size={20} /> 添加复盘记录
        </button>
      </form>

      {/* Review list */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Video size={16} className="text-slate-400" /> 复盘记录 ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-8 text-center text-slate-500 text-sm">
            还没有复盘记录
          </div>
        ) : (
          <div className="space-y-3">
            {reviews
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 animate-slide-up"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-1.5 rounded-lg bg-lime-500/15 px-2.5 py-1 text-lime-300 font-mono text-sm font-semibold flex-shrink-0">
                      <Clock size={14} />
                      {entry.videoTimestamp}
                    </div>
                    <button
                      onClick={() => onRemove(entry.id)}
                      className="ml-auto text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-700/60 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.note && (
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">{entry.note}</p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
