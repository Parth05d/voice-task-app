import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

export interface NotificationItem {
  _id: string;
  type: 'task_update' | 'system_alert' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMins = Math.floor(diffInSeconds / 60);
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      window.dispatchEvent(new CustomEvent('notifications_updated', { detail: { action: 'decrease' } }));
      await api.patch(`/notifications/${id}/read`);
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new CustomEvent('notifications_updated', { detail: { action: 'clear' } }));
      await api.patch('/notifications/read-all');
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder': return 'alarm';
      case 'task_update': return 'check_circle';
      case 'system_alert': return 'info';
      default: return 'notifications';
    }
  };

  const getIconColor = (type: string, isRead: boolean) => {
    if (isRead) return 'text-slate-500 bg-surface-container-high';
    switch (type) {
      case 'reminder': return 'text-error bg-error/10';
      case 'task_update': return 'text-secondary bg-secondary/10';
      case 'system_alert': return 'text-primary bg-primary/10';
      default: return 'text-white bg-surface-container-high';
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <div className="mb-12 border-b border-outline-variant/10 pb-8 mt-4 flex justify-between items-end">
        <div>
          <h1 className='text-4xl md:text-5xl font-bold font-headline tracking-tighter text-[#c4c0ff] text-glow mb-2'>Notifications</h1>
          <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">System alerts and task updates.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead}
            className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
           <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
        </div>
      ) : notifications.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-container-low rounded-3xl p-12 text-center border border-outline-variant/10 flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-slate-500 mb-6 border border-outline-variant/10">
            <span className="material-symbols-outlined text-3xl">notifications_off</span>
          </div>
          <h3 className="font-headline text-xl font-bold text-white mb-2">You're all caught up</h3>
          <p className="text-slate-500 text-sm max-w-sm">There are no pending alerts or notifications for your account at this time.</p>
        </motion.div>
      ) : (
        <div className="space-y-4 pb-20">
          {notifications.map((notif, i) => (
            <motion.div 
              key={notif._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-5 rounded-2xl flex items-start gap-5 transition-all duration-300 ${notif.isRead ? 'bg-background border border-outline-variant/5' : 'bg-surface-container-low border border-primary/20 shadow-[0_4px_20px_rgba(108,99,255,0.05)]'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconColor(notif.type, notif.isRead)}`}>
                <span className="material-symbols-outlined">{getIcon(notif.type)}</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex justify-between items-start mb-1 gap-4">
                  <h4 className={`font-headline font-bold text-lg ${notif.isRead ? 'text-slate-400' : 'text-white'}`}>{notif.title}</h4>
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase shrink-0 mt-1 whitespace-nowrap">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>
                <p className={`text-sm ${notif.isRead ? 'text-slate-500' : 'text-slate-300'}`}>{notif.message}</p>
                
                {!notif.isRead && (
                  <button onClick={(e) => markAsRead(notif._id, e)} className="mt-4 text-[10px] font-headline font-bold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1 group">
                    <span className="material-symbols-outlined text-[14px] group-hover:scale-110 transition-transform">check</span>
                    Mark as Read
                  </button>
                )}
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary mt-3 shrink-0 blur-[1px]"></div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
