import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealthCard = ({ systemHealth, isLoading }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational': case'healthy':
        return 'text-success';
      case 'degraded':
        return 'text-warning';
      case 'down':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational': case'healthy':
        return 'CheckCircle';
      case 'degraded':
        return 'AlertTriangle';
      case 'down':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">System Health</h3>
        <Icon
          name={getStatusIcon(systemHealth?.status)}
          size={20}
          className={getStatusColor(systemHealth?.status)}
        />
      </div>
      <div className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overall Status</span>
          <span className={`text-sm font-semibold ${getStatusColor(systemHealth?.status)}`}>
            {isLoading ? '...' : systemHealth?.status?.toUpperCase()}
          </span>
        </div>

        {/* Gemini API Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Gemini API</span>
          <div className="flex items-center gap-2">
            <Icon
              name={getStatusIcon(systemHealth?.apiStatus)}
              size={16}
              className={getStatusColor(systemHealth?.apiStatus)}
            />
            <span className="text-sm font-semibold text-foreground">
              {isLoading ? '...' : systemHealth?.apiStatus}
            </span>
          </div>
        </div>

        {/* Database Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Chat Storage</span>
          <div className="flex items-center gap-2">
            <Icon
              name={getStatusIcon(systemHealth?.databaseStatus)}
              size={16}
              className={getStatusColor(systemHealth?.databaseStatus)}
            />
            <span className="text-sm font-semibold text-foreground">
              {isLoading ? '...' : systemHealth?.databaseStatus}
            </span>
          </div>
        </div>

        {/* Uptime */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Uptime</span>
          <span className="text-sm font-semibold text-success">
            {isLoading ? '...' : systemHealth?.uptime}
          </span>
        </div>

        {/* Last Incident */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Incident</span>
          <span className="text-xs text-muted-foreground">
            {isLoading ? '...' : systemHealth?.lastIncident}
          </span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthCard;