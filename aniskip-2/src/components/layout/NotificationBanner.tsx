import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { fetchUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, AnimeNotification } from '../../services/notificationService';

const NotificationBanner: React.FC = () => {
  const [notifications, setNotifications] = useState<AnimeNotification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Fetch notifications when user changes
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchUserNotifications(userId).then(fetchedNotifications => {
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
        setLoading(false);
      });
    }
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    if (!userId) return;
    
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    await markNotificationAsRead();
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    
    await markAllNotificationsAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_episode':
        return '📺';
      case 'goal_achieved':
        return '🎉';
      case 'pro_feature':
        return '⭐';
      case 'anime_announcement':
        return '📢';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_episode':
        return 'border-blue-500/50 bg-blue-900/20';
      case 'goal_achieved':
        return 'border-green-500/50 bg-green-900/20';
      case 'pro_feature':
        return 'border-yellow-500/50 bg-yellow-900/20';
      case 'anime_announcement':
        return 'border-purple-500/50 bg-purple-900/20';
      default:
        return 'border-blue-500/50 bg-blue-900/20';
    }
  };

  if (!userId) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
        disabled={loading}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl z-50"
          >
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'bg-slate-800/30' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{notification.message}</p>
                        <p className="text-slate-400 text-xs">
                          {notification.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-700">
                <button className="w-full text-center text-purple-400 hover:text-purple-300 text-sm">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBanner; 