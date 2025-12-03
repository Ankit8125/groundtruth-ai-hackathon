import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PIIMaskingControlCard = ({ piiMetrics, isLoading }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">PII Masking Control</h3>
        <Icon name="Shield" size={20} className="text-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Messages Scanned</p>
          <p className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : piiMetrics?.totalScanned?.toLocaleString()}
          </p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">PII Detected</p>
          <p className="text-2xl font-bold text-warning">
            {isLoading ? '...' : piiMetrics?.piiDetected?.toLocaleString()}
          </p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Detection Accuracy</p>
          <p className="text-2xl font-bold text-success">
            {isLoading ? '...' : `${piiMetrics?.detectionAccuracy}%`}
          </p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">False Positives</p>
          <p className="text-2xl font-bold text-error">
            {isLoading ? '...' : piiMetrics?.falsePositives}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Masking Effectiveness</span>
            <span className="text-sm font-semibold text-success">
              {isLoading ? '...' : `${piiMetrics?.maskingEffectiveness}%`}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${piiMetrics?.maskingEffectiveness || 0}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
          <Icon name="Info" size={16} className="text-info" />
          <p className="text-xs text-muted-foreground">
            PII types monitored: Phone, Email, Address, SSN, Credit Card
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" iconName="Eye" className="flex-1">
          View Logs
        </Button>
        <Button variant="default" size="sm" iconName="Settings" className="flex-1">
          Configure Rules
        </Button>
      </div>
    </div>
  );
};

export default PIIMaskingControlCard;