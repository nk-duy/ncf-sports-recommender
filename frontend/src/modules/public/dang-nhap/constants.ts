export type AuthMode = 'login' | 'register' | 'forgot' | 'google';

export const AUTH_LOGO_FALLBACK =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80';

export const AVAILABLE_SPORTS = [
  { id: 'Pickleball', label: 'Pickleball', icon: '🏓' },
  { id: 'Chạy bộ', label: 'Chạy bộ', icon: '🏃' },
  { id: 'Cầu lông', label: 'Cầu lông', icon: '🏸' },
  { id: 'Đá bóng', label: 'Đá bóng', icon: '⚽' },
  { id: 'Bóng chuyền', label: 'Bóng chuyền', icon: '🏐' },
  { id: 'Gym & Fitness', label: 'Gym & Fitness', icon: '🏋️' },
  { id: 'Dã ngoại', label: 'Dã ngoại', icon: '🏕️' },
];

export interface PresetGoogleAccount {
  name: string;
  email: string;
  initials: string;
  avatarBg: string;
  sports: string[];
}

export const PRESET_GOOGLE_ACCOUNTS: PresetGoogleAccount[] = [
  {
    name: 'Nguyễn Hoàng Anh',
    email: 'hoanganh.runner@gmail.com',
    initials: 'HA',
    avatarBg: 'bg-blue-100 text-blue-700',
    sports: ['Chạy bộ', 'Pickleball'],
  },
  {
    name: 'Trần Quang Minh',
    email: 'quangminh.badminton@gmail.com',
    initials: 'QM',
    avatarBg: 'bg-emerald-100 text-emerald-700',
    sports: ['Cầu lông', 'Gym & Fitness'],
  },
  {
    name: 'Lê Minh Khôi',
    email: 'minhkhoi.football@gmail.com',
    initials: 'MK',
    avatarBg: 'bg-indigo-100 text-indigo-700',
    sports: ['Đá bóng', 'Dã ngoại'],
  },
];
