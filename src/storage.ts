import type { MatchData } from '@/types';

const STORAGE_KEY = 'tennis-review-app';

const emptyData: MatchData = {
  info: null,
  scoreLogs: [],
  reviews: [],
};

export function loadData(): MatchData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyData };
    const parsed = JSON.parse(raw) as MatchData;
    return {
      info: parsed.info ?? null,
      scoreLogs: parsed.scoreLogs ?? [],
      reviews: parsed.reviews ?? [],
    };
  } catch {
    return { ...emptyData };
  }
}

export function saveData(data: MatchData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportJSON(data: MatchData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `tennis-review-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
