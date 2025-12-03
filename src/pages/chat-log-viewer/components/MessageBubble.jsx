import React from 'react';
import Icon from '../../../components/AppIcon';

const MessageBubble = ({ message }) => {
  const isCustomer = message?.sender === 'customer';
  const isSystem = message?.sender === 'system';

  const maskPII = (text) => {
    let maskedText = text;
    maskedText = maskedText?.replace(/\b\d{3}-\d{3}-\d{4}\b/g, '***-***-****');
    maskedText = maskedText?.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '****@****.***');
    maskedText = maskedText?.replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '**** **** **** ****');
    maskedText = maskedText?.replace(/\b\d{1,5}\s[\w\s]+,\s[\w\s]+,\s[A-Z]{2}\s\d{5}\b/g, '[ADDRESS MASKED]');
    return maskedText;
  };

  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-4">
        <div className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-xs flex items-center gap-2">
          <Icon name="Info" size={14} />
          <span>{message?.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isCustomer ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isCustomer ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isCustomer
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card border border-border rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {maskPII(message?.content)}
          </p>
          {message?.metadata && (
            <div className="mt-2 pt-2 border-t border-current/10">
              <div className="flex items-center gap-2 text-xs opacity-70">
                {message?.metadata?.sentiment && (
                  <span className="flex items-center gap-1">
                    <Icon name="Heart" size={12} />
                    {message?.metadata?.sentiment}
                  </span>
                )}
                {message?.metadata?.confidence && (
                  <span className="flex items-center gap-1">
                    <Icon name="Target" size={12} />
                    {message?.metadata?.confidence}%
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
            isCustomer ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{message?.timestamp}</span>
          {message?.edited && (
            <span className="flex items-center gap-1">
              <Icon name="Edit2" size={10} />
              edited
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;