import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { BarChart3, Clock, TrendingDown, Video, Inbox } from 'lucide-react';
import type { ScoreLogEntry, ReviewEntry, MatchInfo } from '@/types';
import { SCORE_ACTIONS, SURFACE_LABELS, FORMAT_LABELS, OPPONENT_TYPE_LABELS } from '@/types';

interface Props {
  info: MatchInfo | null;
  scoreLogs: ScoreLogEntry[];
  reviews: ReviewEntry[];
}

const LIME = '#a3e635';
const RED = '#f87171';
const BLUE = '#60a5fa';
const ORANGE = '#fb923c';
const SLATE = '#94a3b8';

export default function StatsDashboard({ info, scoreLogs, reviews }: Props) {
  const stats = useMemo(() => {
    const map: Record<string, number> = {};
    for (const log of scoreLogs) {
      map[log.key] = (map[log.key] ?? 0) + 1;
    }
    return map;
  }, [scoreLogs]);

  const totalErrors = SCORE_ACTIONS.filter((a) => a.category === 'error').reduce(
    (s, a) => s + (stats[a.key] ?? 0), 0
  );
  const totalPoints = SCORE_ACTIONS.filter((a) => a.category === 'point').reduce(
    (s, a) => s + (stats[a.key] ?? 0), 0
  );
  const totalUE = stats['opp_ue'] ?? 0;

  // Net vs Out pie
  const netCount = (stats['fh_net'] ?? 0) + (stats['bh_net'] ?? 0);
  const outCount = (stats['fh_long'] ?? 0) + (stats['bh_long'] ?? 0);
  const pieData = [
    { name: '下网', value: netCount, color: RED },
    { name: '出界', value: outCount, color: ORANGE },
  ].filter((d) => d.value > 0);

  // FH vs BH errors
  const fhErrors = (stats['fh_net'] ?? 0) + (stats['fh_long'] ?? 0);
  const bhErrors = (stats['bh_net'] ?? 0) + (stats['bh_long'] ?? 0);
  const fhBarData = [
    { name: '正手', 下网: stats['fh_net'] ?? 0, 出界: stats['fh_long'] ?? 0 },
    { name: '反手', 下网: stats['bh_net'] ?? 0, 出界: stats['bh_long'] ?? 0 },
  ];

  // All actions bar
  const allBarData = SCORE_ACTIONS.map((a) => ({
    name: a.label,
    count: stats[a.key] ?? 0,
    category: a.category,
  })).filter((d) => d.count > 0);

  const hasData = scoreLogs.length > 0;

  const cardCls = 'rounded-2xl border border-slate-800 bg-slate-800/40 p-5';

  if (!info && !hasData) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 text-center animate-slide-up">
        <Inbox size={48} className="text-slate-600 mb-4" />
        <p className="text-slate-400 text-lg">暂无统计数据</p>
        <p className="text-slate-500 text-sm mt-1">创建比赛并开始记分后，这里会展示图表</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="text-lime-400" /> 统计看板
        </h2>
        {info && (
          <p className="text-slate-400 text-sm mt-1">
            {info.date} · {FORMAT_LABELS[info.format]} · {SURFACE_LABELS[info.surface]}
            {info.opponentName && ` · 对手: ${info.opponentName}`}
            {` · ${OPPONENT_TYPE_LABELS[info.opponentType]}`}
          </p>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={cardCls + ' text-center'}>
          <p className="text-slate-400 text-xs mb-1">总得分</p>
          <p className="text-3xl font-black text-lime-400">{totalPoints}</p>
        </div>
        <div className={cardCls + ' text-center'}>
          <p className="text-slate-400 text-xs mb-1">总失误</p>
          <p className="text-3xl font-black text-red-400">{totalErrors}</p>
        </div>
        <div className={cardCls + ' text-center'}>
          <p className="text-slate-400 text-xs mb-1">对方 UE</p>
          <p className="text-3xl font-black text-blue-400">{totalUE}</p>
        </div>
      </div>

      {!hasData ? (
        <div className={cardCls + ' text-center py-12'}>
          <TrendingDown size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">还没有记分数据，去「记分/标记」开始记录</p>
        </div>
      ) : (
        <>
          {/* Pie: Net vs Out */}
          {pieData.length > 0 && (
            <div className={cardCls + ' mb-4'}>
              <h3 className="text-sm font-semibold text-slate-300 mb-4">下网 vs 出界比例</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Bar: FH vs BH */}
          {(fhErrors > 0 || bhErrors > 0) && (
            <div className={cardCls + ' mb-4'}>
              <h3 className="text-sm font-semibold text-slate-300 mb-4">正手 vs 反手失误对比</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={fhBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={13} />
                  <YAxis stroke="#94a3b8" fontSize={13} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="下网" fill={RED} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="出界" fill={ORANGE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Bar: All actions */}
          {allBarData.length > 0 && (
            <div className={cardCls + ' mb-6'}>
              <h3 className="text-sm font-semibold text-slate-300 mb-4">所有动作统计</h3>
              <ResponsiveContainer width="100%" height={Math.max(220, allBarData.length * 36)}>
                <BarChart data={allBarData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={13} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {allBarData.map((d) => (
                      <Cell key={d.name} fill={d.category === 'point' ? LIME : RED} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Review list */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Video size={16} className="text-slate-400" /> 录像时间戳列表 ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-8 text-center text-slate-500 text-sm">
            还没有录像复盘记录
          </div>
        ) : (
          <div className="space-y-2">
            {reviews
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/40 px-4 py-3 cursor-pointer hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5 rounded-lg bg-lime-500/15 px-2.5 py-1 text-lime-300 font-mono text-sm font-semibold flex-shrink-0">
                    <Clock size={14} />
                    {entry.videoTimestamp}
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-w-0">
                    {entry.tags.length > 0 ? (
                      entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-700/60 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm">{entry.note || '无备注'}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
