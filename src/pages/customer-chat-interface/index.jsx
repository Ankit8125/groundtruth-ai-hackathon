import React, { useState, useEffect, useRef } from 'react';
import CustomerContextBar from '../../components/CustomerContextBar';
import ConversationQuickActions from '../../components/ConversationQuickActions';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import MessageInput from './components/MessageInput';
import WelcomeScreen from './components/WelcomeScreen';
import { streamChatResponse } from '../../services/geminiService';
import { addNotification } from '../../services/notificationService';
import { 
  createConversation, 
  storeMessage, 
  updateConversation,
  recordPIIDetection,
  getConversation
} from '../../services/chatStorageService';

const CustomerChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const currentStreamRef = useRef('');

  // Initialize conversation (restore or create new)
  useEffect(() => {
    const activeId = localStorage.getItem('activeConversationId');
    
    if (activeId) {
      const existingConv = getConversation(activeId);
      if (existingConv && existingConv.status === 'active') {
        setConversationId(activeId);
        // Restore messages
        if (existingConv.messages) {
          setMessages(existingConv.messages.map(msg => ({
            ...msg,
            id: msg.id || Date.now() + Math.random(), // Ensure ID exists
            timestamp: new Date(msg.timestamp)
          })));
        }
        return;
      }
    }

    // If no active conversation found, create new one
    startNewConversation();
  }, []);

  const startNewConversation = () => {
    const newConversationId = createConversation({
      outlet: 'Online Chat',
      customerId: `CUST-****${Math.floor(Math.random() * 10000)}`
    });
    setConversationId(newConversationId);
    localStorage.setItem('activeConversationId', newConversationId);
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (messageText) => {
    if (!messageText?.trim() || !conversationId) return;

    setError(null);
    currentStreamRef.current = '';

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: messageText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Store user message
    storeMessage(conversationId, {
      sender: 'user',
      content: messageText,
      type: 'text'
    });

    // Check for escalation triggers
    const escalationKeywords = ['human', 'agent', 'supervisor', 'manager', 'person', 'representative'];
    const shouldEscalate = escalationKeywords.some(keyword => messageText.toLowerCase().includes(keyword));

    if (shouldEscalate) {
      updateConversation(conversationId, {
        status: 'escalated'
      });
      addNotification({
        title: 'Chat Escalated',
        message: `Conversation ${conversationId} escalated due to keyword trigger.`,
        type: 'escalation'
      });
    }

    setIsTyping(true);

    try {
      // Create placeholder AI message for streaming
      const aiMessageId = Date.now() + 1;
      const aiMessage = {
        id: aiMessageId,
        sender: 'ai',
        type: 'text',
        content: '',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      setIsStreaming(true);

      // Stream the response with customer history context and PII masking
      const piiInfo = await streamChatResponse(
        messageText,
        messages,
        (chunk) => {
          currentStreamRef.current += chunk;
          
          setMessages((prev) =>
            prev?.map((msg) =>
              msg?.id === aiMessageId
                ? { ...msg, content: currentStreamRef?.current }
                : msg
            )
          );
        }
      );

      // Store AI response
      storeMessage(conversationId, {
        sender: 'ai',
        content: currentStreamRef?.current,
        type: 'text'
      });

      // Record PII detections if any
      if (piiInfo?.detectedPII && piiInfo?.detectedPII?.length > 0) {
        recordPIIDetection(conversationId, {
          messageId: userMessage?.id,
          detections: piiInfo?.detectedPII,
          originalMessage: piiInfo?.originalMessage,
          maskedMessage: piiInfo?.maskedMessage
        });
      }

      setIsStreaming(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setIsTyping(false);
      setIsStreaming(false);
      setError(err?.message || 'Failed to get response. Please try again.');

      // Remove the empty AI message if there was an error
      setMessages((prev) => prev?.filter(msg => msg?.content || msg?.sender === 'user'));
      
      // Update conversation with error status
      updateConversation(conversationId, {
        status: 'error',
        lastError: err?.message
      });
    }
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      menu: 'Show me the menu',
      order: 'I want to place an order',
      hours: 'What are your opening hours?',
      location: 'Find restaurants near me',
      reservations: 'I want to book a table',
      specials: 'What are today\'s specials?',
      dietary: 'Tell me about dietary options',
      contact: 'How can I contact you?'
    };

    const message = actionMessages?.[action?.id] || action?.label;
    handleSendMessage(message);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.id === 'share_location') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Store location in conversation metadata
            if (conversationId) {
              updateConversation(conversationId, {
                location: { latitude, longitude },
                outlet: 'Nearest Outlet (Detected)'
              });
            }
            handleSendMessage(`I'm sharing my location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          },
          (error) => {
            console.log('Location access denied:', error);
            handleSendMessage("I couldn't share my location. Please help me find a restaurant near me.");
          }
        );
      } else {
        handleSendMessage("My browser doesn't support location sharing.");
      }
      return;
    }

    const suggestionMessages = {
      menu: 'Show me the menu',
      order: 'I want to place an order',
      location: 'Find restaurants near me',
      specials: 'What are today\'s specials?'
    };

    const message = suggestionMessages?.[suggestion?.id] || suggestion?.title;
    handleSendMessage(message);
  };

  const handleNewChat = () => {
    if (messages.length > 0 && !window.confirm('Start a new conversation? Current chat history will be saved.')) {
      return;
    }
    
    // Mark current conversation as completed
    if (conversationId) {
      updateConversation(conversationId, {
        status: 'completed',
        endTime: new Date()?.toISOString()
      });
    }
    
    // Clear active conversation ID and start new
    localStorage.removeItem('activeConversationId');
    startNewConversation();
  };

  const handleRateMessage = (messageId, rating) => {
    // Update local message state
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));

    // Update conversation satisfaction rating
    // We'll use a simple logic: Thumbs Up = 5, Thumbs Down = 1
    // In a real app, you might want to average these or have a separate conversation rating
    const satisfactionScore = rating === 'up' ? 5 : 1;
    
    if (conversationId) {
      updateConversation(conversationId, {
        satisfactionRating: satisfactionScore
      });
      
      if (rating === 'down') {
        addNotification({
          title: 'Negative Feedback',
          message: `Customer disliked a response in conversation ${conversationId}.`,
          type: 'feedback'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerContextBar />
      <div className="main-content with-customer-bar">
        <ChatHeader onClearChat={handleNewChat} />

        <div
          ref={chatContainerRef}
          className="max-w-4xl mx-auto px-4 py-6 pb-32"
          style={{ minHeight: 'calc(100vh - 280px)' }}>

          {messages?.length === 0 ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <div className="space-y-6">
              {messages?.map((message) => (
                <ChatMessage
                  key={message?.id}
                  message={message}
                  isStreaming={isStreaming && message?.id === messages?.[messages?.length - 1]?.id}
                  onRate={handleRateMessage}
                />
              ))}
              {isTyping && <TypingIndicator />}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30">
          <ConversationQuickActions onActionSelect={handleQuickAction} />
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isTyping || isStreaming}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerChatInterface;