import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import MessageBubble from './MessageBubble';
import ConversationAnalytics from './ConversationAnalytics';
import { analyzeConversation } from '../../../services/geminiService';

const ConversationDetail = ({ conversation, onClose }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('transcript');

  useEffect(() => {
    if (conversation) {
      // If conversation already has analytics, use it
      if (conversation.analytics) {
        setAnalyticsData(conversation.analytics);
      } else {
        // Otherwise, analyze it using Gemini
        analyzeWithGemini();
      }
    } else {
      setAnalyticsData(null);
    }
  }, [conversation]);

  const analyzeWithGemini = async () => {
    if (!conversation?.messages || conversation.messages.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeConversation(conversation.messages);
      if (result) {
        // Merge with existing basic stats if available, or create new structure
        setAnalyticsData({
          ...result,
          messageCount: conversation.messages.length,
          // Add default values for fields expected by the UI if missing
          accuracy: result.agentPerformance === 'Good' ? 95 : 75,
          sentimentScore: result.sentiment === 'Positive' ? 90 : (result.sentiment === 'Negative' ? 30 : 60),
          escalations: result.resolutionStatus === 'Escalated' ? 1 : 0,
          avgResponseTime: '2s' // Placeholder
        });
      }
    } catch (error) {
      console.error("Failed to analyze conversation:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-background rounded-lg border border-border">
        <div className="text-center">
          <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a conversation to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="User" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{conversation?.customerId}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="MapPin" size={12} />
              <span>{conversation?.outlet}</span>
              <span>•</span>
              <span>{conversation?.date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            iconName="ExternalLink"
            iconSize={18}
          />
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={18}
            onClick={onClose}
            className="lg:hidden"
          />
        </div>
      </div>

      <div className="flex items-center border-b border-border bg-card px-4">
        <button
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'transcript'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('transcript')}
        >
          Transcript
        </button>
        <button
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {activeTab === 'transcript' ? (
          <>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Duration</span>
                  <span className="text-sm font-medium text-foreground flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    {conversation?.duration}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Status</span>
                  <span className="text-sm font-medium text-foreground capitalize">
                    {conversation?.status}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Satisfaction</span>
                  <span className="text-sm font-medium text-foreground flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-warning" />
                    {conversation?.satisfactionRating}/5
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Messages</span>
                  <span className="text-sm font-medium text-foreground">
                    {conversation?.messages?.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {conversation?.messages?.map((message) => (
                <MessageBubble key={message?.id} message={message} />
              ))}
            </div>
          </>
        ) : (
          <ConversationAnalytics analytics={analyticsData} isLoading={isAnalyzing} />
        )}
      </div>
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Flag"
            iconPosition="left"
          >
            Flag for Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Share2"
            iconPosition="left"
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;