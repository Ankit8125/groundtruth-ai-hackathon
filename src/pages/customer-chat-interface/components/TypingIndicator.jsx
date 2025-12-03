import React from 'react';
import Icon from '../../../components/AppIcon';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="Bot" size={18} color="var(--color-primary)" />
        </div>
      </div>

      <div className="flex-1 max-w-[75%]">
        <div className="rounded-2xl px-4 py-3 bg-card border border-border">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-subtle" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-subtle" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-subtle" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-muted-foreground">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;