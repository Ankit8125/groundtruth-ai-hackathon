import genAI from '../utils/geminiClient';
import { getFormattedCustomerContext } from '../data/customerHistory';
import { maskPII } from '../utils/piiMasking';

/**
 * Safety settings for content filtering.
 * @returns {Array} Safety settings configuration.
 */
function getSafetySettings() {
  return [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    }
  ];
}

/**
 * Handles common Gemini API errors with user-friendly messages.
 * @param {Error} error - The error object from the API.
 * @returns {string} User-friendly error message.
 */
export function handleGeminiError(error) {
  console.error('Gemini API Error:', error);

  if (error?.message?.includes('429')) {
    return 'Rate limit exceeded. Please wait a moment before trying again.';
  }
  
  if (error?.message?.includes('SAFETY')) {
    return 'Content was blocked by safety filters. Please modify your request.';
  }
  
  if (error?.message?.includes('cancelled')) {
    return 'Request was cancelled by user.';
  }
  
  if (error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  if (error?.message?.includes('API key') || error?.message?.includes('API_KEY')) {
    return 'API key is invalid or missing. Please check your configuration.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Generates a chat response with customer history context using Gemini AI.
 * Now includes PII masking before sending to AI.
 * @param {string} userMessage - The user's input message.
 * @param {Array} conversationHistory - Previous conversation messages.
 * @returns {Promise<Object>} The AI-generated response with PII information.
 */
export async function generateChatResponse(userMessage, conversationHistory = []) {
  try {
    if (!userMessage?.trim()) {
      throw new Error('Please provide a message.');
    }

    // Mask PII in user message before sending to AI
    const { maskedText, detectedPII } = maskPII(userMessage);

    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      safetySettings: getSafetySettings()
    });

    // Get formatted customer context
    const customerContext = getFormattedCustomerContext();
    
    // Build conversation history for Gemini with masked content
    const history = conversationHistory?.map(msg => ({
      role: msg?.sender === 'user' ? 'user' : 'model',
      parts: [{ 
        text: msg?.sender === 'user' && msg?.content 
          ? maskPII(msg?.content)?.maskedText 
          : (msg?.content || '') 
      }]
    })) || [];

    // Start chat with history and system context
    const chat = model?.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System Context: ${customerContext}\n\nPlease use this information to answer customer queries accurately and helpfully. Note: Some sensitive information may be masked with asterisks for privacy.` }]
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will use the provided business context, menu information, and customer service guidelines to assist customers effectively while respecting privacy protections.' }]
        },
        ...history
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 32,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat?.sendMessage(maskedText);
    const response = await result?.response;
    
    return {
      response: response?.text(),
      detectedPII,
      originalMessage: userMessage,
      maskedMessage: maskedText
    };
  } catch (error) {
    console.error('Error in chat generation:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Streams a chat response chunk by chunk for real-time display.
 * Now includes PII masking before sending to AI.
 * @param {string} userMessage - The user's input message.
 * @param {Array} conversationHistory - Previous conversation messages.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 * @returns {Promise<Object>} PII detection information.
 */
export async function streamChatResponse(userMessage, conversationHistory = [], onChunk) {
  try {
    if (!userMessage?.trim()) {
      throw new Error('Please provide a message.');
    }

    // Mask PII in user message before sending to AI
    const { maskedText, detectedPII } = maskPII(userMessage);

    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      safetySettings: getSafetySettings()
    });

    // Get formatted customer context
    const customerContext = getFormattedCustomerContext();
    
    // Build conversation history for Gemini with masked content
    const history = conversationHistory?.map(msg => ({
      role: msg?.sender === 'user' ? 'user' : 'model',
      parts: [{ 
        text: msg?.sender === 'user' && msg?.content 
          ? maskPII(msg?.content)?.maskedText 
          : (msg?.content || '') 
      }]
    })) || [];

    // Start chat with history and system context
    const chat = model?.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System Context: ${customerContext}\n\nPlease use this information to answer customer queries accurately and helpfully. Note: Some sensitive information may be masked with asterisks for privacy.` }]
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will use the provided business context, menu information, and customer service guidelines to assist customers effectively while respecting privacy protections.' }]
        },
        ...history
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 32,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat?.sendMessageStream(maskedText);

    for await (const chunk of result?.stream) {
      const text = chunk?.text();
      if (text && onChunk) {
        onChunk(text);
      }
    }

    // Return PII information after streaming completes
    return {
      detectedPII,
      originalMessage: userMessage,
      maskedMessage: maskedText
    };
  } catch (error) {
    console.error('Error in streaming chat generation:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Analyzes user intent and extracts structured information from messages.
 * @param {string} userMessage - The user's input message.
 * @returns {Promise<Object>} Structured intent analysis.
 */
export async function analyzeUserIntent(userMessage) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Analyze the following customer message and determine their intent. 
Classify it into one of these categories: menu_inquiry, location_query, order_status, promotion_inquiry, dietary_question, general_question, complaint.
Also extract any specific items, locations, or details mentioned.

Customer message: "${userMessage}"

Return a JSON response with: { "intent": "category", "entities": [], "confidence": 0.0-1.0 }`;

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const text = response?.text();
    
    // Try to parse JSON from response
    try {
      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }
    } catch (parseError) {
      console.error('Error parsing intent JSON:', parseError);
    }
    
    return {
      intent: 'general_question',
      entities: [],
      confidence: 0.5
    };
  } catch (error) {
    console.error('Error in intent analysis:', error);
    return {
      intent: 'general_question',
      entities: [],
      confidence: 0.0
    };
  }
}

export default {
  generateChatResponse,
  streamChatResponse,
  analyzeUserIntent,
  handleGeminiError
};