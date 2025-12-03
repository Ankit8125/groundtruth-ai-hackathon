import React from 'react';
import Icon from '../../../components/AppIcon';

const ConversationCard = ({ conversation, isSelected, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'text-success bg-success/10';
      case 'escalated':
        return 'text-warning bg-warning/10';
      case 'pending':
        return 'text-accent bg-accent/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getSatisfactionIcon = (rating) => {
    if (rating >= 4) return { name: 'ThumbsUp', color: 'var(--color-success)' };
    if (rating >= 3) return { name: 'Minus', color: 'var(--color-warning)' };
    return { name: 'ThumbsDown', color: 'var(--color-error)' };
  };

  const satisfactionIcon = getSatisfactionIcon(conversation?.satisfactionRating);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-warm-md ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-warm'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="User" size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-foreground truncate">
              {conversation?.customerId}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="MapPin" size={12} />
            <span className="truncate">{conversation?.outlet}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              conversation?.status
            )}`}
          >
            {conversation?.status}
          </span>
          <Icon
            name={satisfactionIcon?.name}
            size={16}
            color={satisfactionIcon?.color}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
        <div className="flex items-center gap-1">
          <Icon name="Calendar" size={12} />
          <span>{conversation?.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Clock" size={12} />
          <span>{conversation?.duration}</span>
        </div>
      </div>
      <p className="text-sm text-foreground/80 line-clamp-2 mb-2">
        {conversation?.lastMessage}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {conversation?.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ConversationCard;