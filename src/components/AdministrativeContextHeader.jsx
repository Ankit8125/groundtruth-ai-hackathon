import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import { getNotifications, markAllAsRead, getUnreadCount } from '../services/notificationService';

const AdministrativeContextHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [systemStatus, setSystemStatus] = useState('operational');
  const [userRole, setUserRole] = useState('Administrator');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Initial load of notifications
    loadNotifications();
    
    // Poll for new notifications every 5 seconds
    const notificationTimer = setInterval(loadNotifications, 5000);

    // Click outside to close
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      clearInterval(notificationTimer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadNotifications = () => {
    const allNotifications = getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(getUnreadCount());
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markAllAsRead();
      setUnreadCount(0);
      // Update local state to reflect read status
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const getBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Dashboard', path: '/admin-dashboard' }];

    pathSegments?.forEach((segment, index) => {
      const path = `/${pathSegments?.slice(0, index + 1)?.join('/')}`;
      const label = segment?.split('-')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ');
      breadcrumbs?.push({ label, path });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'operational':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  // Group notifications
  const escalatedNotifications = notifications.filter(n => n.type === 'escalation');
  const otherNotifications = notifications.filter(n => n.type !== 'escalation');

  return (
    <div className="admin-context-header">
      <div className="admin-context-header-content">
        <div className="flex items-center gap-4">
          <nav className="admin-context-breadcrumb">
            {breadcrumbs?.map((crumb, index) => (
              <React.Fragment key={crumb?.path}>
                {index > 0 && (
                  <span className="admin-context-breadcrumb-separator">
                    <Icon name="ChevronRight" size={16} />
                  </span>
                )}
                <button
                  onClick={() => handleBreadcrumbClick(crumb?.path)}
                  className={`admin-context-breadcrumb-item ${
                    index === breadcrumbs?.length - 1 ? 'text-foreground font-medium' : ''
                  }`}
                >
                  {crumb?.label}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="admin-context-status">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground font-mono">
              {currentTime?.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse-subtle`} />
            <span className="text-muted-foreground capitalize">{systemStatus}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Icon name="User" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">{userRole}</span>
          </div>

          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="sm"
              iconName="Bell"
              iconSize={18}
              className="touch-target relative"
              onClick={handleNotificationClick}
            />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
            )}

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                ) : (
                  <div className="py-2">
                    {escalatedNotifications.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-1 text-xs font-semibold text-destructive bg-destructive/10 mb-1">
                          Escalations
                        </div>
                        {escalatedNotifications.map(n => (
                          <div key={n.id} className="px-3 py-2 hover:bg-muted/50 cursor-pointer border-l-2 border-destructive">
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {otherNotifications.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-xs font-semibold text-muted-foreground bg-muted mb-1">
                          Updates
                        </div>
                        {otherNotifications.map(n => (
                          <div key={n.id} className="px-3 py-2 hover:bg-muted/50 cursor-pointer border-l-2 border-transparent">
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrativeContextHeader;