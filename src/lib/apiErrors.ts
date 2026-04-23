/**
 * API Error Handling and Retry Utilities
 */

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, any>;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && typeof (error as any).status === "number";
}

/**
 * Create a user-friendly error message based on API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (isApiError(error)) {
      switch (error.status) {
        case 400:
          return "Invalid request. Please check your input.";
        case 401:
          return "You need to sign in to do this.";
        case 403:
          return "You don't have permission to do this.";
        case 404:
          return "The resource you're looking for doesn't exist.";
        case 429:
          return "Too many requests. Please try again later.";
        case 500:
          return "Server error. Please try again later.";
        case 503:
          return "Service temporarily unavailable. Please try again later.";
        default:
          return error.message || "An error occurred. Please try again.";
      }
    }
    return error.message;
  }
  return "An unknown error occurred";
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on client errors (4xx)
      if (isApiError(lastError) && lastError.status && lastError.status < 500) {
        throw lastError;
      }

      // Don't retry on the last attempt
      if (attempt < maxAttempts - 1) {
        const delay = Math.min(
          initialDelayMs * Math.pow(backoffMultiplier, attempt),
          maxDelayMs
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retry attempts exceeded");
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!isApiError(error)) return false;
  if (!error.status) return false;

  // Retry on server errors (5xx) and rate limits (429)
  return error.status >= 500 || error.status === 429;
}

/**
 * Create an API error from response
 */
export function createApiError(
  status: number,
  data: Record<string, any> = {}
): ApiError {
  const error = new Error(data.message || `API Error: ${status}`) as ApiError;
  error.status = status;
  error.code = data.code;
  error.details = data;
  return error;
}
