import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const AdministrativeSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Chat Logs',
      icon: 'MessageSquare',
      path: '/chat-log-viewer',
      description: 'View conversation history'
    },
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/dashboard',
      description: 'System overview'
    },
    {
      label: 'Outlets',
      icon: 'Store',
      path: '/outlets',
      description: 'Manage locations'
    },
    {
      label: 'Analytics',
      icon: 'BarChart3',
      path: '/analytics',
      description: 'Performance metrics'
    },
    {
      label: 'Customers',
      icon: 'Users',
      path: '/customers',
      description: 'Customer management'
    },
    {
      label: 'Settings',
      icon: 'Settings',
      path: '/settings',
      description: 'System configuration'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(!isOpen);
    } else {
      onToggleCollapse?.();
    }
  };

  const isActive = (path) => location?.pathname === path;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        iconName="Menu"
        iconSize={24}
        onClick={handleToggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden touch-target"
      />
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="flex items-center gap-3">
            <div className="admin-sidebar-logo">
              <Icon name="UtensilsCrossed" size={24} color="var(--color-primary)" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold font-heading text-foreground">RestaurantAI</span>
                <span className="text-xs text-muted-foreground">Admin Portal</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
            iconSize={20}
            onClick={onToggleCollapse}
            className="hidden lg:flex"
          />
        </div>

        <nav className="admin-sidebar-nav">
          {navigationItems?.map((item) => (
            <div
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`admin-sidebar-nav-item ${isActive(item?.path) ? 'active' : ''}`}
              title={isCollapsed ? item?.label : item?.description}
            >
              <Icon name={item?.icon} size={20} />
              <span>{item?.label}</span>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <div className={`admin-sidebar-nav-item`}>
            <Icon name="LogOut" size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdministrativeSidebar;