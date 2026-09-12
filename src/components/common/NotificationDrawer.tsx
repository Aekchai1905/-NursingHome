import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCheck, 
  Bell, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  FileText, 
  Pill, 
  Activity 
} from 'lucide-react';

interface NotificationDrawerProps {
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'vital_alert': return <Activity className="w-4 h-4 text-rose-600" />;
      case 'appointment': return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'checkin': return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'care_report': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'med_reminder': return <Pill className="w-4 h-4 text-purple-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'success': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sage-800 text-white">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">ศูนย์แจ้งเตือน (Notifications)</h2>
              <p className="text-xs text-gray-500">การแจ้งเตือนสุขภาพและสถานะเรียลไทม์</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Actions */}
        <div className="p-3 border-b border-gray-100 bg-white flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === 'all' ? 'bg-sage-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ทั้งหมด ({notifications.length})
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === 'unread' ? 'bg-sage-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ยังไม่อ่าน ({notifications.filter(n => !n.read).length})
            </button>
            <button
              onClick={() => setFilterType('vital_alert')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === 'vital_alert' ? 'bg-sage-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              สัญญาณชีพ
            </button>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-sage-800 hover:text-sage-950 font-semibold flex items-center gap-1 whitespace-nowrap"
            title="อ่านทั้งหมด"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>อ่านทั้งหมด</span>
          </button>
        </div>

        {/* List of notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bell className="w-10 h-10 mx-auto stroke-1 text-gray-300 mb-2" />
              <p className="text-sm font-medium">ไม่มีการแจ้งเตือนในหมวดหมู่นี้</p>
            </div>
          ) : (
            filteredNotifs.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  notif.read 
                    ? 'bg-white border-gray-100 opacity-75 hover:opacity-100 hover:border-gray-200' 
                    : 'bg-cream-50 border-sage-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-xs shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-400">
                      <span className={`px-2 py-0.5 rounded-md border font-medium uppercase tracking-wider ${getSeverityBadge(notif.severity)}`}>
                        {notif.type.replace('_', ' ')}
                      </span>
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer simulation info */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-400">
          ⚡ รองรับ Firebase Cloud Messaging (FCM) Real-time Push
        </div>
      </div>
    </div>
  );
};
