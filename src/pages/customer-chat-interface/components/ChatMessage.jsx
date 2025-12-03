import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ChatMessage = ({ message, isStreaming = false, onRate }) => {
  const isUser = message?.sender === 'user';
  const isAI = message?.sender === 'ai';
  const [rating, setRating] = useState(message?.rating || null);

  const handleRate = (value) => {
    setRating(value);
    if (onRate) {
      onRate(message.id, value);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessageContent = () => {
    if (message?.type === 'text') {
      return (
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message?.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse-subtle" />
          )}
        </div>
      );
    }

    if (message?.type === 'recommendation') {
      return (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{message?.content}</p>
          {message?.recommendations && (
            <div className="grid gap-2">
              {message?.recommendations?.map((item, index) => (
                <div 
                  key={index}
                  className="bg-background/50 rounded-lg p-3 border border-border hover:border-primary/30 transition-colors duration-200"
                >
                  <div className="flex gap-3">
                    {item?.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={item?.image}
                          alt={item?.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground mb-1">{item?.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{item?.description}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-primary">{item?.price}</span>
                        {item?.rating && (
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={12} color="var(--color-warning)" />
                            <span className="text-muted-foreground">{item?.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (message?.type === 'location') {
      return (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{message?.content}</p>
          {message?.locations && (
            <div className="grid gap-2">
              {message?.locations?.map((location, index) => (
                <div 
                  key={index}
                  className="bg-background/50 rounded-lg p-3 border border-border hover:border-primary/30 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-foreground mb-1">{location?.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{location?.address}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Icon name="MapPin" size={12} color="var(--color-primary)" />
                          <span className="text-muted-foreground">{location?.distance}</span>
                        </div>
                        {location?.isOpen && (
                          <span className="text-success font-medium">Open Now</span>
                        )}
                      </div>
                    </div>
                    <button className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-200">
                      <Icon name="Navigation" size={16} color="var(--color-primary)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (message?.type === 'order-status') {
      return (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{message?.content}</p>
          {message?.orderDetails && (
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">Order #{message?.orderDetails?.orderId}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  message?.orderDetails?.status === 'Preparing' ? 'bg-warning/10 text-warning' :
                  message?.orderDetails?.status === 'Ready'? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {message?.orderDetails?.status}
                </span>
              </div>
              <div className="space-y-2">
                {message?.orderDetails?.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-foreground">{item?.quantity}x {item?.name}</span>
                    <span className="text-muted-foreground">{item?.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-sm font-semibold text-primary">{message?.orderDetails?.total}</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    return <div className="text-sm">{message?.content}</div>;
  };

  return (
    <div className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Bot" size={18} color="var(--color-primary)" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
            <Icon name="User" size={18} color="var(--color-secondary)" />
          </div>
        )}
      </div>
      <div className={`flex-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card border border-border'
        }`}>
          {renderMessageContent()}
        </div>
        <div className={`flex items-center px-2 w-full ${isUser ? 'justify-end' : 'justify-between'}`}>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(message?.timestamp)}
          </span>
          {isAI && !isStreaming && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground mr-1">Was this helpful?</span>
              <button 
                onClick={() => handleRate('up')}
                className={`p-1 rounded hover:bg-muted transition-colors ${rating === 'up' ? 'text-success bg-success/10' : 'text-muted-foreground'}`}
                title="Yes, helpful"
              >
                <Icon name="ThumbsUp" size={14} />
              </button>
              <button 
                onClick={() => handleRate('down')}
                className={`p-1 rounded hover:bg-muted transition-colors ${rating === 'down' ? 'text-error bg-error/10' : 'text-muted-foreground'}`}
                title="No, not helpful"
              >
                <Icon name="ThumbsDown" size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;