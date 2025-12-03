import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatHeader = ({ onClearChat }) => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate('/chat-log-viewer');
  };

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Bot" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-sm font-semibold font-heading text-foreground">
                AI Assistant
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="History"
              iconSize={18}
              onClick={handleViewHistory}
              className="touch-target"
            >
              <span className="hidden sm:inline">History</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              iconSize={18}
              onClick={onClearChat}
              className="touch-target"
            >
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;