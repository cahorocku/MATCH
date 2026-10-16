export type Tab = 'new' | 'score' | 'review' | 'stats';

export type Surface = 'hard' | 'clay';
export type Format = 'singles' | 'doubles';
export type OpponentType = 'aggressive' | 'defensive' | 'all-round' | 'serve-volley' | 'unknown';

export interface MatchInfo {
  id: string;
  date: string;
  format: Format;
  surface: Surface;
  opponentName: string;
  opponentType: OpponentType;
  createdAt: number;
}

export type ScoreActionKey =
  | 'fh_winner'
  | 'bh_winner'
  | 'ace'
  | 'net_winner'
  | 'slice_drop'
  | 'opp_ue'
  | 'fh_net'
  | 'fh_long'
  | 'bh_net'
  | 'bh_long'
  | 'double_fault'
  | 'forced_error';

export interface ScoreLogEntry {
  id: string;
  key: ScoreActionKey;
  label: string;
  category: 'point' | 'error';
  timestamp: number;
  elapsed: number; // seconds since match start
}

export interface ReviewEntry {
  id: string;
  videoTimestamp: string; // e.g. "14:20"
  tags: string[];
  note: string;
  createdAt: number;
}

export interface MatchData {
  info: MatchInfo | null;
  scoreLogs: ScoreLogEntry[];
  reviews: ReviewEntry[];
}

export const SCORE_ACTIONS: {
  key: ScoreActionKey;
  label: string;
  category: 'point' | 'error';
  icon: string;
}[] = [
  { key: 'fh_winner', label: '正手 Winner', category: 'point', icon: 'Zap' },
  { key: 'bh_winner', label: '反手 Winner', category: 'point', icon: 'Zap' },
  { key: 'ace', label: '发球 ACE', category: 'point', icon: 'Target' },
  { key: 'net_winner', label: '网前得分', category: 'point', icon: 'ArrowUp' },
  { key: 'slice_drop', label: '切削/放短', category: 'point', icon: 'Scissors' },
  { key: 'opp_ue', label: '对方非受迫失误', category: 'point', icon: 'Gift' },
  { key: 'fh_net', label: '正手下网', category: 'error', icon: 'Minus' },
  { key: 'fh_long', label: '正手出界', category: 'error', icon: 'ArrowUpRight' },
  { key: 'double_fault', label: '双误', category: 'error', icon: 'X' },
  { key: 'bh_net', label: '反手下网', category: 'error', icon: 'Minus' },
  { key: 'bh_long', label: '反手出界', category: 'error', icon: 'ArrowUpRight' },
  { key: 'forced_error', label: '受迫失误', category: 'error', icon: 'AlertTriangle' },
];

export const REVIEW_TAGS = [
  '#下网失误',
  '#击球点偏后',
  '#精彩攻防',
  '#关键分',
  '#发球问题',
  '#战术调整',
  '#体能下降',
  '#心理波动',
];

export const OPPONENT_TYPE_LABELS: Record<OpponentType, string> = {
  aggressive: '进攻型',
  defensive: '防守型',
  'all-round': '全面型',
  'serve-volley': '发球上网型',
  unknown: '未知',
};

export const SURFACE_LABELS: Record<Surface, string> = {
  hard: '硬地',
  clay: '红土',
};

export const FORMAT_LABELS: Record<Format, string> = {
  singles: '单打',
  doubles: '双打',
};
