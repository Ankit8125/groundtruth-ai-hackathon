import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities, isLoading }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'chat_complete':
        return 'MessageSquare';
      case 'pii_masked':
        return 'Shield';
      case 'escalation':
        return 'AlertTriangle';
      case 'system':
        return 'Settings';
      default:
        return 'Info';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-info';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Clock" size={20} className="text-muted-foreground" />
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3]?.map((i) => (
            <div key={i} className="animate-pulse flex items-start gap-3 p-3 bg-background rounded-lg">
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : activities?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities?.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start gap-3 p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity?.severity === 'success' ?'bg-success/10'
                    : activity?.severity === 'warning' ?'bg-warning/10'
                    : activity?.severity === 'error' ?'bg-error/10' :'bg-info/10'
                }`}
              >
                <Icon
                  name={getActivityIcon(activity?.type)}
                  size={16}
                  className={getSeverityColor(activity?.severity)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity?.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimestamp(activity?.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivityFeed;