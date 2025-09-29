/**
 * Utility functions to filter out internal framework messages from user notifications
 */

/**
 * Checks if an error message should be filtered out from user notifications
 * @param message - The error message to check
 * @returns true if the message should be filtered (not shown to user)
 */
export function shouldFilterErrorMessage(message: string): boolean {
  if (!message || typeof message !== 'string') {
    return false;
  }

  const lowerMessage = message.toLowerCase();
  const originalMessage = message.trim();

  // Filter out Next.js internal redirect messages - be very aggressive
  const redirectPatterns = [
    'next_redirect',
    'next.js redirect',
    'nextredirect',
    'redirect error',
    'internal redirect',
    'redirecterror',
    'next redirect',
    'redirect_error',
    'redirect',
    'nextjs redirect',
    'next.js internal',
    'navigation redirect',
  ];

  // Check if message exactly matches or contains redirect patterns
  if (redirectPatterns.some((pattern) => lowerMessage.includes(pattern))) {
    return true;
  }

  // Check if message starts or ends with redirect indicators
  if (originalMessage.startsWith('NEXT_REDIRECT') || originalMessage.endsWith('NEXT_REDIRECT') || originalMessage === 'NEXT_REDIRECT') {
    return true;
  }

  // Filter out other framework internal messages
  const frameworkPatterns = [
    'chunk load error',
    'loading chunk',
    'hydration',
    'hydration mismatch',
    'server error',
    'internal server error',
  ];

  // Filter out network/browser internal errors that aren't user-actionable
  const networkPatterns = ['network error', 'fetch error', 'cors error', 'preflight'];

  const allPatterns = [...redirectPatterns, ...frameworkPatterns, ...networkPatterns];

  return allPatterns.some((pattern) => lowerMessage.includes(pattern));
}

/**
 * Sanitizes an error message for user display
 * @param message - The original error message
 * @returns A user-friendly error message or null if should be filtered
 */
export function sanitizeErrorMessage(message: string): string | null {
  if (shouldFilterErrorMessage(message)) {
    console.log('Filtered internal framework message:', message);
    return null;
  }

  // Additional sanitization can be added here
  // For example, removing stack traces, technical jargon, etc.

  return message;
}

/**
 * Gets a user-friendly error message from an error object
 * @param error - The error object or message
 * @param fallbackMessage - Fallback message if error is filtered or invalid
 * @returns A user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown, fallbackMessage = 'An unexpected error occurred'): string {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    return fallbackMessage;
  }

  const sanitized = sanitizeErrorMessage(message);
  return sanitized || fallbackMessage;
}
