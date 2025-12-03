/**
 * PII (Personally Identifiable Information) Masking Utility
 * Detects and masks sensitive data in messages before sending to AI or storing
 */

// PII Detection Patterns
const PII_PATTERNS = {
  // Phone numbers (various formats)
  phone: {
    pattern: /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g,
    mask: (match) => {
      const digits = match?.replace(/\D/g, '');
      if (digits?.length >= 10) {
        return `***-***-${digits?.slice(-4)}`;
      }
      return '***-***-****';
    },
    type: 'PHONE'
  },
  
  // Email addresses
  email: {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    mask: (match) => {
      const [username, domain] = match?.split('@');
      if (username?.length <= 2) {
        return `**@${domain}`;
      }
      return `${username?.slice(0, 2)}***@${domain}`;
    },
    type: 'EMAIL'
  },
  
  // Credit card numbers
  creditCard: {
    pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    mask: () => '****-****-****-****',
    type: 'CREDIT_CARD'
  },
  
  // Social Security Numbers
  ssn: {
    pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
    mask: () => '***-**-****',
    type: 'SSN'
  },
  
  // Street addresses (basic pattern)
  address: {
    pattern: /\b\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct|Way|Place|Pl)(?:\s+(?:Apt|Apartment|Unit|#)\s*\w+)?\b/gi,
    mask: () => '[ADDRESS MASKED]',
    type: 'ADDRESS'
  },
  
  // Dates of birth
  dob: {
    pattern: /\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{2,4}[-/]\d{1,2}[-/]\d{1,2})\b/g,
    mask: () => '[DATE MASKED]',
    type: 'DOB'
  },
  
  // ZIP codes
  zipCode: {
    pattern: /\b\d{5}(?:-\d{4})?\b/g,
    mask: (match) => `${match?.slice(0, 2)}***`,
    type: 'ZIP_CODE'
  }
};

/**
 * Masks PII in text content
 * @param {string} text - Text to mask
 * @param {Object} options - Masking options
 * @returns {Object} - Masked text and detected PII information
 */
export function maskPII(text, options = {}) {
  if (!text) return { maskedText: text, detectedPII: [] };

  const {
    enablePhoneMasking = true,
    enableEmailMasking = true,
    enableCreditCardMasking = true,
    enableSSNMasking = true,
    enableAddressMasking = true,
    enableDOBMasking = true,
    enableZipCodeMasking = true
  } = options;

  let maskedText = text;
  const detectedPII = [];

  // Phone masking
  if (enablePhoneMasking) {
    maskedText = maskedText?.replace(PII_PATTERNS?.phone?.pattern, (match, ...args) => {
      const offset = args?.[args?.length - 2];
      detectedPII?.push({
        type: PII_PATTERNS?.phone?.type,
        original: match,
        position: offset,
        length: match?.length
      });
      return PII_PATTERNS?.phone?.mask(match);
    });
  }

  // Email masking
  if (enableEmailMasking) {
    maskedText = maskedText?.replace(PII_PATTERNS?.email?.pattern, (match, ...args) => {
      const offset = args?.[args?.length - 2];
      detectedPII?.push({
        type: PII_PATTERNS?.email?.type,
        original: match,
        position: offset,
        length: match?.length
      });
      return PII_PATTERNS?.email?.mask(match);
    });
  }

  // Credit card masking
  if (enableCreditCardMasking) {
    maskedText = maskedText?.replace(PII_PATTERNS?.creditCard?.pattern, (match, ...args) => {
      const offset = args?.[args?.length - 2];
      detectedPII?.push({
        type: PII_PATTERNS?.creditCard?.type,
        original: match,
        position: offset,
        length: match?.length
      });
      return PII_PATTERNS?.creditCard?.mask(match);
    });
  }

  // SSN masking
  if (enableSSNMasking) {
    maskedText = maskedText?.replace(PII_PATTERNS?.ssn?.pattern, (match, ...args) => {
      const offset = args?.[args?.length - 2];
      detectedPII?.push({
        type: PII_PATTERNS?.ssn?.type,
        original: match,
        position: offset,
        length: match?.length
      });
      return PII_PATTERNS?.ssn?.mask(match);
    });
  }

  // Address masking
  if (enableAddressMasking) {
    maskedText = maskedText?.replace(PII_PATTERNS?.address?.pattern, (match, ...args) => {
      const offset = args?.[args?.length - 2];
      detectedPII?.push({
        type: PII_PATTERNS?.address?.type,
        original: match,
        position: offset,
        length: match?.length
      });
      return PII_PATTERNS?.address?.mask(match);
    });
  }

  // DOB masking
  if (enableDOBMasking) {
    maskedText = maskedText?.replace(PII_PATTERNS?.dob?.pattern, (match, ...args) => {
      const offset = args?.[args?.length - 2];
      detectedPII?.push({
        type: PII_PATTERNS?.dob?.type,
        original: match,
        position: offset,
        length: match?.length
      });
      return PII_PATTERNS?.dob?.mask(match);
    });
  }

  // ZIP code masking
  if (enableZipCodeMasking) {
    maskedText = maskedText?.replace(PII_PATTERNS?.zipCode?.pattern, (match, ...args) => {
      const offset = args?.[args?.length - 2];
      detectedPII?.push({
        type: PII_PATTERNS?.zipCode?.type,
        original: match,
        position: offset,
        length: match?.length
      });
      return PII_PATTERNS?.zipCode?.mask(match);
    });
  }

  return {
    maskedText,
    detectedPII,
    hasPII: detectedPII?.length > 0
  };
}

/**
 * Validates if text contains PII without masking
 * @param {string} text - Text to validate
 * @returns {Object} - Validation results
 */
export function detectPII(text) {
  if (!text) return { hasPII: false, detectedTypes: [] };

  const detectedTypes = [];

  Object.entries(PII_PATTERNS)?.forEach(([key, config]) => {
    if (config?.pattern?.test(text)) {
      detectedTypes?.push(config?.type);
    }
  });

  return {
    hasPII: detectedTypes?.length > 0,
    detectedTypes
  };
}

/**
 * Gets masking statistics for a text
 * @param {string} text - Text to analyze
 * @returns {Object} - Statistics about PII in text
 */
export function getPIIStatistics(text) {
  const { detectedPII } = maskPII(text);
  
  const stats = {
    total: detectedPII?.length,
    byType: {}
  };

  detectedPII?.forEach((pii) => {
    if (!stats?.byType?.[pii?.type]) {
      stats.byType[pii.type] = 0;
    }
    stats.byType[pii.type]++;
  });

  return stats;
}

export default {
  maskPII,
  detectPII,
  getPIIStatistics
};