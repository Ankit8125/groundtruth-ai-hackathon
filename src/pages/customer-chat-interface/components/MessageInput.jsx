import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage(message?.trim());
      setMessage('');
      if (textareaRef?.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e?.target?.value);
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef?.current?.scrollHeight, 120)}px`;
    }
  };

  const handleFileClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      console.log('File selected:', file?.name);
      // Handle file upload logic here
    }
  };

  const handleVoiceClick = () => {
    setIsRecording(!isRecording);
    console.log('Voice recording:', !isRecording ? 'started' : 'stopped');
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            iconName="Paperclip"
            iconSize={20}
            onClick={handleFileClick}
            disabled={disabled}
            className="flex-shrink-0 touch-target"
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            {message?.length > 0 && (
              <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                {message?.length}
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            iconName={isRecording ? "MicOff" : "Mic"}
            iconSize={20}
            onClick={handleVoiceClick}
            disabled={disabled}
            className={`flex-shrink-0 touch-target ${isRecording ? 'text-error' : ''}`}
          />

          <Button
            type="submit"
            variant="default"
            size="icon"
            iconName="Send"
            iconSize={20}
            disabled={disabled || !message?.trim()}
            className="flex-shrink-0 touch-target"
          />
        </form>

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Icon name="Lock" size={12} />
          <span>Your messages are encrypted and secure</span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;