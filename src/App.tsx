import { useEffect, useState, useCallback } from 'react';
import { Plus, Activity, Video, BarChart3, Download, Target } from 'lucide-react';
import type { Tab } from '@/types';
import type { MatchInfo, ScoreLogEntry, ReviewEntry, ScoreActionKey } from '@/types';
import { SCORE_ACTIONS } from '@/types';
import { loadData, saveData, exportJSON, generateId } from '@/storage';
import NewMatch from '@/components/NewMatch';
import ScorePanel from '@/components/ScorePanel';
import VideoReview from '@/components/VideoReview';
import StatsDashboard from '@/components/StatsDashboard';

const TABS: { key: Tab; label: string; icon: typeof Plus }[] = [
  { key: 'new', label: '新建比赛', icon: Plus },
  { key: 'score', label: '记分/标记', icon: Activity },
  { key: 'review', label: '录像复盘', icon: Video },
  { key: 'stats', label: '统计看板', icon: BarChart3 },
];

function App() {
  const [tab, setTab] = useState<Tab>('new');
  const [info, setInfo] = useState<MatchInfo | null>(null);
  const [scoreLogs, setScoreLogs] = useState<ScoreLogEntry[]>([]);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const data = loadData();
    setInfo(data.info);
    setScoreLogs(data.scoreLogs);
    setReviews(data.reviews);
    setLoaded(true);
  }, []);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    if (loaded) {
      saveData({ info, scoreLogs, reviews });
    }
  }, [info, scoreLogs, reviews, loaded]);

  const handleCreateMatch = useCallback((matchInfo: MatchInfo) => {
    setInfo(matchInfo);
    setScoreLogs([]); // reset score logs for new match
    setTab('score');
  }, []);

  const handleAddScore = useCallback(
    (key: ScoreActionKey) => {
      const action = SCORE_ACTIONS.find((a) => a.key === key);
      if (!action) return;
      const entry: ScoreLogEntry = {
        id: generateId(),
        key,
        label: action.label,
        category: action.category,
        timestamp: Date.now(),
        elapsed: info ? Math.floor((Date.now() - info.createdAt) / 1000) : 0,
      };
      setScoreLogs((prev) => [...prev, entry]);
    },
    [info]
  );

  const handleRemoveScore = useCallback((id: string) => {
    setScoreLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const handleClearScores = useCallback(() => {
    setScoreLogs([]);
  }, []);

  const handleAddReview = useCallback((entry: ReviewEntry) => {
    setReviews((prev) => [...prev, entry]);
  }, []);

  const handleRemoveReview = useCallback((id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleExport = useCallback(() => {
    exportJSON({ info, scoreLogs, reviews });
  }, [info, scoreLogs, reviews]);

  const matchStarted = info !== null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center">
              <Target size={20} className="text-slate-900" />
            </div>
            <span className="font-bold text-base sm:text-lg">网球复盘</span>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-lime-400/50 hover:text-lime-300 transition-colors"
          >
            <Download size={15} />
            <span className="hidden sm:inline">导出 JSON</span>
          </button>
        </div>
      </header>

      {/* Tab content */}
      <main className="flex-1 px-4 py-6 pb-24 sm:pb-6">
        {tab === 'new' && <NewMatch existing={info} onCreate={handleCreateMatch} />}
        {tab === 'score' && (
          <ScorePanel
            matchStarted={matchStarted}
            scoreLogs={scoreLogs}
            onAdd={handleAddScore}
            onRemove={handleRemoveScore}
            onClear={handleClearScores}
          />
        )}
        {tab === 'review' && (
          <VideoReview reviews={reviews} onAdd={handleAddReview} onRemove={handleRemoveReview} />
        )}
        {tab === 'stats' && (
          <StatsDashboard info={info} scoreLogs={scoreLogs} reviews={reviews} />
        )}
      </main>

      {/* Tab navigation — bottom bar on mobile, top bar on desktop */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md sm:sticky sm:top-14 sm:bottom-auto sm:border-t-0 sm:border-b">
        <div className="max-w-5xl mx-auto px-2 flex items-center justify-around sm:justify-center sm:gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 transition-colors ${
                  active ? 'text-lime-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs sm:text-sm font-medium">{t.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-lime-400 sm:top-0 sm:bottom-auto" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;
