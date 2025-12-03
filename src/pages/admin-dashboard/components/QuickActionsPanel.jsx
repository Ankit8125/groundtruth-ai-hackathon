import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ onActionClick }) => {
  const actions = [
    {
      id: 'view_logs',
      label: 'View Chat Logs',
      icon: 'Database',
      variant: 'default'
    },
    {
      id: 'export_data',
      label: 'Export Training Data',
      icon: 'Download',
      variant: 'outline'
    },
    {
      id: 'configure_pii',
      label: 'Configure PII',
      icon: 'Shield',
      variant: 'outline'
    },
    {
      id: 'system_health',
      label: 'System Health',
      icon: 'Activity',
      variant: 'outline'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Common administrative tasks
        </p>
      </div>

      <div className="space-y-2">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="sm"
            iconName={action?.icon}
            iconPosition="left"
            onClick={() => onActionClick?.(action?.id)}
            className="w-full justify-start"
          >
            {action?.label}
          </Button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Role: Administrator</span>
          <span>•</span>
          <span>Full Access</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;