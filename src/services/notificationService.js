
const NOTIFICATIONS_KEY = 'restaurant_ai_notifications';

export const getNotifications = () => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
};

export const addNotification = (notification) => {
  try {
    const notifications = getNotifications();
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    // Keep only last 50 notifications
    const updated = [newNotification, ...notifications].slice(0, 50);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return newNotification;
  } catch (error) {
    console.error('Error adding notification:', error);
    return null;
  }
};

export const markAsRead = (id) => {
  try {
    const notifications = getNotifications();
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return [];
  }
};

export const markAllAsRead = () => {
  try {
    const notifications = getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return [];
  }
};

export const getUnreadCount = () => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
};
