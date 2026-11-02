import {
  Layers,
  Activity,
  Footprints,
  Zap,
  Trophy,
  Flame,
  Dumbbell,
  Compass,
  ShoppingBag,
} from 'lucide-react';

export const getSportTheme = (sportName: string) => {
  const s = sportName.toLowerCase();
  if (s.includes('pickleball')) {
    return {
      icon: <Activity size={18} />,
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-700',
    };
  }
  if (s.includes('chạy bộ')) {
    return {
      icon: <Footprints size={18} />,
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
    };
  }
  if (s.includes('cầu lông')) {
    return {
      icon: <Zap size={18} />,
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-700',
    };
  }
  if (s.includes('đá bóng')) {
    return {
      icon: <Trophy size={18} />,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
    };
  }
  if (s.includes('bóng chuyền')) {
    return {
      icon: <Flame size={18} />,
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-700',
    };
  }
  if (s.includes('đa dụng') || s.includes('gym')) {
    return {
      icon: <Dumbbell size={18} />,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
    };
  }
  if (s.includes('dã ngoại')) {
    return {
      icon: <Compass size={18} />,
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-200',
      badge: 'bg-teal-100 text-teal-700',
    };
  }
  if (s.includes('phụ kiện')) {
    return {
      icon: <ShoppingBag size={18} />,
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      badge: 'bg-slate-200 text-slate-800',
    };
  }
  return {
    icon: <Layers size={18} />,
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
  };
};
