import React from 'react';
// Centralized error handling for all Binna platform products
import { NextApiRequest, NextApiResponse } from 'next';

export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',

  // Business logic errors
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',

  // System errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

  // File/Upload errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
}

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp?: string;
  requestId?: string;
}

export class BinnaError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message);
    this.name = 'BinnaError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;

    // Ensure the name of this error is the same as the class name
    Object.setPrototypeOf(this, BinnaError.prototype);
  }

  toJSON(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
      requestId: this.requestId,
    };
  }
}

// Predefined error creators
export const createAuthError = (message: string, details?: Record<string, any>) =>
  new BinnaError(ErrorCode.UNAUTHORIZED, message, 401, details);

export const createValidationError = (message: string, details?: Record<string, any>) =>
  new BinnaError(ErrorCode.VALIDATION_ERROR, message, 400, details);

export const createNotFoundError = (resource: string, id?: string) =>
  new BinnaError(ErrorCode.USER_NOT_FOUND, `${resource} not found${id ? ` with id: ${id}` : ''}`, 404);

export const createPaymentError = (message: string, details?: Record<string, any>) =>
  new BinnaError(ErrorCode.PAYMENT_FAILED, message, 402, details);

export const createStockError = (productId: string, requested: number, available: number) =>
  new BinnaError(
    ErrorCode.INSUFFICIENT_STOCK,
    `Insufficient stock for product ${productId}`,
    400,
    { productId, requested, available }
  );

export const createRateLimitError = (retryAfter?: number) =>
  new BinnaError(
    ErrorCode.RATE_LIMIT_EXCEEDED,
    'Rate limit exceeded',
    429,
    { retryAfter }
  );

// Error logging
export interface ErrorLogger {
  log(error: Error | BinnaError, context?: Record<string, any>): void;
}

export class ConsoleErrorLogger implements ErrorLogger {
  log(error: Error | BinnaError, context?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    
    if (error instanceof BinnaError) {
      console.error(`[${timestamp}] BinnaError:`, {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
        requestId: error.requestId,
        context,
      });
    } else {
      console.error(`[${timestamp}] Error:`, {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
      });
    }
  }
}

// Global error logger instance
export const errorLogger = new ConsoleErrorLogger();

// Error handler middleware for API routes
export function errorHandlerMiddleware(
  error: Error,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestId = req.headers['x-request-id'] as string || 
                   Math.random().toString(36).substring(2, 15);

  // Log the error
  errorLogger.log(error, {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    requestId,
  });

  // Handle BinnaError
  if (error instanceof BinnaError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
        requestId,
      },
    });
  }

  // Handle known error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: error.message,
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        code: ErrorCode.INVALID_FORMAT,
        message: 'Invalid ID format',
        timestamp: new Date().toISOString(),
        requestId,
      },
    });
  }

  // Default to internal server error
  return res.status(500).json({
    success: false,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      timestamp: new Date().toISOString(),
      requestId,
    },
  });
}

// Async error wrapper for API routes
export function asyncErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      errorHandlerMiddleware(error as Error, req, res);
    }
  };
}

// Client-side error boundary
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export const createErrorBoundary = (fallbackComponent?: React.ComponentType<ErrorBoundaryState>) => {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    ErrorBoundaryState
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
      errorLogger.log(error, { errorInfo, boundary: 'React' });
      this.setState({ errorInfo });
    }

    render() {
      if (this.state.hasError) {
        if (fallbackComponent) {
          const FallbackComponent = fallbackComponent;
          return <FallbackComponent {...this.state} />;
        }

        return (
          <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          </div>
        );
      }

      return this.props.children;
    }
  };
};

export default {
  BinnaError,
  ErrorCode,
  createAuthError,
  createValidationError,
  createNotFoundError,
  createPaymentError,
  createStockError,
  createRateLimitError,
  errorLogger,
  errorHandlerMiddleware,
  asyncErrorHandler,
  createErrorBoundary,
};


