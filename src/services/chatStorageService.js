/**
 * Chat Storage Service
 * Manages chat conversation storage, retrieval, and statistics
 * for admin dashboard and training purposes
 */

// In-memory storage (in production, this would be a database)
let chatStorage = [];
let conversationIdCounter = 1;

/**
 * Stores a complete chat conversation
 * @param {Object} conversation - Conversation object
 * @returns {Object} - Stored conversation with ID
 */
export function storeConversation(conversation) {
  const storedConversation = {
    id: `CONV-2025-${String(conversationIdCounter++)?.padStart(3, '0')}`,
    timestamp: new Date()?.toISOString(),
    ...conversation
  };

  chatStorage?.push(storedConversation);
  return storedConversation;
}

/**
 * Stores an individual message in an ongoing conversation
 * @param {string} conversationId - Conversation ID
 * @param {Object} message - Message object
 */
export function storeMessage(conversationId, message) {
  const conversation = chatStorage?.find(c => c?.id === conversationId);
  
  if (conversation) {
    if (!conversation?.messages) {
      conversation.messages = [];
    }
    conversation?.messages?.push({
      ...message,
      timestamp: new Date()?.toISOString()
    });
  }
}

/**
 * Creates a new conversation session
 * @param {Object} metadata - Initial conversation metadata
 * @returns {string} - New conversation ID
 */
export function createConversation(metadata = {}) {
  const conversationId = `CONV-2025-${String(conversationIdCounter++)?.padStart(3, '0')}`;
  
  chatStorage?.push({
    id: conversationId,
    customerId: metadata?.customerId || `CUST-****${Math.floor(Math.random() * 10000)}`,
    outlet: metadata?.outlet || 'Online Chat',
    startTime: new Date()?.toISOString(),
    status: 'active',
    messages: [],
    piiDetections: [],
    ...metadata
  });

  return conversationId;
}

/**
 * Updates conversation status and metadata
 * @param {string} conversationId - Conversation ID
 * @param {Object} updates - Updates to apply
 */
export function updateConversation(conversationId, updates) {
  const conversation = chatStorage?.find(c => c?.id === conversationId);
  
  if (conversation) {
    Object.assign(conversation, updates);
    conversation.lastUpdated = new Date()?.toISOString();
  }
}

/**
 * Records PII detection in a conversation
 * @param {string} conversationId - Conversation ID
 * @param {Object} piiDetection - PII detection details
 */
export function recordPIIDetection(conversationId, piiDetection) {
  const conversation = chatStorage?.find(c => c?.id === conversationId);
  
  if (conversation) {
    if (!conversation?.piiDetections) {
      conversation.piiDetections = [];
    }
    conversation?.piiDetections?.push({
      ...piiDetection,
      timestamp: new Date()?.toISOString()
    });
  }
}

/**
 * Retrieves all conversations
 * @param {Object} filters - Filter options
 * @returns {Array} - Filtered conversations
 */
export function getConversations(filters = {}) {
  let filtered = [...chatStorage];

  if (filters?.status) {
    filtered = filtered?.filter(c => c?.status === filters?.status);
  }

  if (filters?.dateFrom) {
    filtered = filtered?.filter(c => new Date(c.startTime) >= new Date(filters.dateFrom));
  }

  if (filters?.dateTo) {
    filtered = filtered?.filter(c => new Date(c.startTime) <= new Date(filters.dateTo));
  }

  if (filters?.customerId) {
    filtered = filtered?.filter(c => c?.customerId === filters?.customerId);
  }

  return filtered;
}

/**
 * Retrieves a single conversation by ID
 * @param {string} conversationId - Conversation ID
 * @returns {Object|null} - Conversation or null
 */
export function getConversation(conversationId) {
  return chatStorage?.find(c => c?.id === conversationId) || null;
}

/**
 * Gets chat statistics for dashboard
 * @returns {Object} - Statistics object
 */
export function getChatStatistics() {
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

  const activeChats = chatStorage?.filter(c => c?.status === 'active')?.length;
  const dailyChats = chatStorage?.filter(c => new Date(c.startTime) >= oneDayAgo);
  
  const totalPIIDetections = chatStorage?.reduce((sum, c) => 
    sum + (c?.piiDetections?.length || 0), 0
  );

  const totalMessages = chatStorage?.reduce((sum, c) => 
    sum + (c?.messages?.length || 0), 0
  );

  const resolvedChats = chatStorage?.filter(c => c?.status === 'resolved');
  const avgSatisfaction = resolvedChats?.length > 0
    ? resolvedChats?.reduce((sum, c) => sum + (c?.satisfactionRating || 0), 0) / resolvedChats?.length
    : 0;

  const escalatedChats = chatStorage?.filter(c => c?.status === 'escalated')?.length;
  const escalationRate = chatStorage?.length > 0 
    ? (escalatedChats / chatStorage?.length) * 100 
    : 0;

  return {
    totalChats: chatStorage?.length,
    activeChats,
    dailyInteractions: dailyChats?.length,
    piiMaskingRate: totalMessages > 0 ? (totalPIIDetections / totalMessages) * 100 : 0,
    avgResponseTime: '2.3s',
    escalationRate: Math.round(escalationRate),
    satisfactionScore: Math.round(avgSatisfaction * 20) // Convert to percentage
  };
}

/**
 * Gets system health information
 * @returns {Object} - System health status
 */
export function getSystemHealth() {
  return {
    status: 'operational',
    apiStatus: 'healthy',
    databaseStatus: 'healthy',
    uptime: '99.9%',
    lastIncident: 'None in last 30 days'
  };
}

/**
 * Gets PII masking metrics
 * @returns {Object} - PII masking statistics
 */
export function getPIIMaskingMetrics() {
  const totalMessages = chatStorage?.reduce((sum, c) => 
    sum + (c?.messages?.length || 0), 0
  );

  const totalPIIDetections = chatStorage?.reduce((sum, c) => 
    sum + (c?.piiDetections?.length || 0), 0
  );

  return {
    totalScanned: totalMessages,
    piiDetected: totalPIIDetections,
    maskingEffectiveness: 100,
    falsePositives: 0,
    detectionAccuracy: 98
  };
}

/**
 * Exports conversations for AI training
 * @param {Object} filters - Export filters
 * @returns {Array} - Formatted training data
 */
export function exportForTraining(filters = {}) {
  const conversations = getConversations(filters);
  
  return conversations?.map(conv => ({
    conversationId: conv?.id,
    messages: conv?.messages?.map(msg => ({
      role: msg?.sender === 'user' ? 'user' : 'assistant',
      content: msg?.content,
      timestamp: msg?.timestamp
    })),
    metadata: {
      outcome: conv?.status,
      satisfaction: conv?.satisfactionRating,
      topics: conv?.tags,
      piiCount: conv?.piiDetections?.length || 0
    }
  }));
}

/**
 * Clears all stored conversations (for testing)
 */
export function clearAllConversations() {
  chatStorage = [];
  conversationIdCounter = 1;
}

export default {
  storeConversation,
  storeMessage,
  createConversation,
  updateConversation,
  recordPIIDetection,
  getConversations,
  getConversation,
  getChatStatistics,
  getSystemHealth,
  getPIIMaskingMetrics,
  exportForTraining,
  clearAllConversations
};