import React from 'react';
import { HealthStatus, PrecautionAlert } from '../../types';
import { 
  AlertTriangle, 
  Pill, 
  Activity, 
  HeartPulse, 
  Bed, 
  Brain, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface StatusBadgeProps {
  status: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showLabel = true }) => {
  const configs = {
    stable: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      dot: 'bg-emerald-500',
      label: '🟢 Stable / ปกติ',
      icon: CheckCircle2
    },
    monitor: {
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      dot: 'bg-amber-500',
      label: '🟡 Monitor / เฝ้าระวัง',
      icon: Clock
    },
    attention: {
      bg: 'bg-rose-50 border-rose-200 text-rose-700',
      dot: 'bg-rose-500 animate-pulse-subtle',
      label: '🔴 Attention / ต้องดูแลพิเศษ',
      icon: AlertCircle
    }
  };

  const config = configs[status] || configs.stable;
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-medium px-3 py-1.5'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} transition-all`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export const PrecautionBadge: React.FC<{ alert: PrecautionAlert; compact?: boolean }> = ({ alert, compact = false }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'fall_risk': return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'drug_allergy': return <Pill className="w-3.5 h-3.5 text-rose-600" />;
      case 'food_allergy': return <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />;
      case 'bedridden': return <Bed className="w-3.5 h-3.5 text-purple-600" />;
      case 'diabetes': return <Activity className="w-3.5 h-3.5 text-blue-600" />;
      case 'hypertension': return <HeartPulse className="w-3.5 h-3.5 text-rose-600" />;
      case 'dementia': return <Brain className="w-3.5 h-3.5 text-indigo-600" />;
      default: return <AlertTriangle className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  const getStyle = () => {
    if (alert.severity === 'high') {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    if (alert.severity === 'medium') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  if (compact) {
    return (
      <span 
        title={`${alert.label}: ${alert.details}`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${getStyle()}`}
      >
        {getIcon()}
        <span className="truncate max-w-[140px]">{alert.label}</span>
      </span>
    );
  }

  return (
    <div className={`p-3 rounded-xl border ${getStyle()} flex items-start gap-2.5 transition-all hover:shadow-sm`}>
      <div className="p-1.5 rounded-lg bg-white/80 shadow-xs mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold leading-tight">{alert.label}</h4>
        <p className="text-[11px] opacity-85 mt-0.5 leading-snug">{alert.details}</p>
      </div>
    </div>
  );
};
