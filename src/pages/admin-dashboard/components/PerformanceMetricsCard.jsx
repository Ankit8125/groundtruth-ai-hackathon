import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricsCard = ({ statistics, isLoading }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
        <Icon name="TrendingUp" size={20} className="text-success" />
      </div>

      <div className="space-y-4">
        {/* Average Response Time */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
            <span className="text-sm font-semibold text-foreground">
              {isLoading ? '...' : statistics?.avgResponseTime}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: '85%' }}
            />
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
            <span className="text-sm font-semibold text-foreground">
              {isLoading ? '...' : `${statistics?.satisfactionScore}%`}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${statistics?.satisfactionScore || 0}%` }}
            />
          </div>
        </div>

        {/* Escalation Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Escalation Rate</span>
            <span className="text-sm font-semibold text-foreground">
              {isLoading ? '...' : `${statistics?.escalationRate}%`}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-warning h-2 rounded-full transition-all duration-300"
              style={{ width: `${statistics?.escalationRate || 0}%` }}
            />
          </div>
        </div>

        {/* Resolution Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Resolution Rate</span>
            <span className="text-sm font-semibold text-foreground">
              {isLoading ? '...' : `${100 - (statistics?.escalationRate || 0)}%`}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${100 - (statistics?.escalationRate || 0)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Chats (24h)</p>
            <p className="text-lg font-bold text-foreground">
              {isLoading ? '...' : statistics?.dailyInteractions}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Active Now</p>
            <p className="text-lg font-bold text-success">
              {isLoading ? '...' : statistics?.activeChats}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsCard;