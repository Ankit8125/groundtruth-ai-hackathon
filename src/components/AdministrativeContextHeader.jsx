import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const AdministrativeContextHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [systemStatus, setSystemStatus] = useState('operational');
  const [userRole, setUserRole] = useState('Administrator');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

          <Button
            variant="ghost"
            size="sm"
            iconName="Bell"
            iconSize={18}
            className="touch-target"
          />
        </div>
      </div>
    </div>
  );
};

export default AdministrativeContextHeader;