import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconBg = 'bg-sage-100',
  iconColor = 'text-sage-800',
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white border border-[#E8ECE9] shadow-soft hover:shadow-soft-lg transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-sage-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs">
          <span className={`font-semibold mr-1.5 ${
            trend.isNeutral ? 'text-gray-600' : trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {trend.value}
          </span>
          <span className="text-gray-400">เปรียบเทียบกับสัปดาห์ก่อน</span>
        </div>
      )}
    </div>
  );
};
