import React from 'react';
import Icon from '../../../components/AppIcon';

const ConversationAnalytics = ({ analytics }) => {
  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-success';
    if (accuracy >= 70) return 'text-warning';
    return 'text-error';
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return { name: 'Smile', color: 'var(--color-success)' };
      case 'neutral':
        return { name: 'Meh', color: 'var(--color-warning)' };
      case 'negative':
        return { name: 'Frown', color: 'var(--color-error)' };
      default:
        return { name: 'HelpCircle', color: 'var(--color-muted-foreground)' };
    }
  };

  const sentimentIcon = getSentimentIcon(analytics?.sentiment);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        Conversation Analytics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Response Accuracy</span>
            <Icon name="Target" size={16} className="text-muted-foreground" />
          </div>
          <div className={`text-2xl font-bold ${getAccuracyColor(analytics?.accuracy)}`}>
            {analytics?.accuracy}%
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${
                analytics?.accuracy >= 90
                  ? 'bg-success'
                  : analytics?.accuracy >= 70
                  ? 'bg-warning' :'bg-error'
              }`}
              style={{ width: `${analytics?.accuracy}%` }}
            />
          </div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Customer Sentiment</span>
            <Icon name={sentimentIcon?.name} size={16} color={sentimentIcon?.color} />
          </div>
          <div className="text-2xl font-bold text-foreground capitalize">
            {analytics?.sentiment}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Confidence: {analytics?.sentimentScore}%
          </div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Messages</span>
            <Icon name="MessageSquare" size={16} className="text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">{analytics?.messageCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Avg response: {analytics?.avgResponseTime}
          </div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Escalations</span>
            <Icon name="AlertTriangle" size={16} className="text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">{analytics?.escalations}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {analytics?.escalations === 0 ? 'Fully resolved' : 'Required intervention'}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Key Topics Discussed</span>
            <Icon name="Tag" size={14} className="text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-2">
            {analytics?.topics?.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {analytics?.escalationPoints?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Escalation Points</span>
              <Icon name="AlertCircle" size={14} className="text-warning" />
            </div>
            <div className="space-y-2">
              {analytics?.escalationPoints?.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded bg-warning/10 border border-warning/20"
                >
                  <Icon name="ArrowRight" size={14} className="text-warning mt-0.5" />
                  <span className="text-sm text-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics?.successfulResolutions?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Successful Resolutions</span>
              <Icon name="CheckCircle" size={14} className="text-success" />
            </div>
            <div className="space-y-2">
              {analytics?.successfulResolutions?.map((resolution, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded bg-success/10 border border-success/20"
                >
                  <Icon name="Check" size={14} className="text-success mt-0.5" />
                  <span className="text-sm text-foreground">{resolution}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationAnalytics;