/**
 * Security utilities for VoteWise AI
 */

/**
 * SECURITY LAYER: Input Sanitization
 * Prevents Cross-Site Scripting (XSS) and injection attacks by escaping 
 * dangerous characters and removing malicious patterns like <script> tags.
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // 1. Remove obvious script tags and event handlers
  const maliciousPatterns = [
    /<script\b[^>]*>([\s\S]*?)<\/script>/gim,
    /on\w+="[^"]*"/gim,
    /on\w+='[^']*'/gim,
    /javascript:/gim
  ];
  
  let cleanInput = input;
  maliciousPatterns.forEach(pattern => {
    cleanInput = cleanInput.replace(pattern, "");
  });

  // 2. Escape HTML entities for deep XSS protection
  return cleanInput
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validates if the input is empty or contains only whitespace.
 * @param {string} input 
 * @returns {boolean}
 */
export const isNotEmpty = (input) => {
  return Boolean(input && input.trim().length > 0);
};

/**
 * Basic rate limiting check using sessionStorage
 * @param {string} actionKey - Unique key for the action
 * @param {number} limit - Max calls allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if allowed, false if rate limited
 */
export const checkRateLimit = (actionKey, limit = 5, windowMs = 60000) => {
  const now = Date.now();
  const data = JSON.parse(sessionStorage.getItem(`rate_limit_${actionKey}`) || '[]');
  
  // Filter out expired timestamps
  const validTimestamps = data.filter(ts => now - ts < windowMs);
  
  if (validTimestamps.length >= limit) {
    return false;
  }
  
  validTimestamps.push(now);
  sessionStorage.setItem(`rate_limit_${actionKey}`, JSON.stringify(validTimestamps));
  return true;
};
