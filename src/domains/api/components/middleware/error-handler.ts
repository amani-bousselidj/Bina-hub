import { NextRequest, NextResponse } from 'next/server';

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
  timestamp: string;
  path: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Backward compatibility
export class APIErrorHandler extends ApiError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode);
  }

  static handleError(error: any) {
    console.error('API Error:', error);
    if (error instanceof APIErrorHandler) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const withErrorHandler = (handler: Function) => {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      const timestamp = new Date().toISOString();
      const path = new URL(req.url).pathname;

      console.error('API Error:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        path,
        timestamp,
      });

      if (error instanceof ApiError || error instanceof APIErrorHandler) {
        const response: ErrorResponse = {
          error: error.message,
          details: error.details,
          timestamp,
          path,
        };
        return NextResponse.json(response, { status: error.statusCode });
      }

      // Handle validation errors
      if (error instanceof Error && error.name === 'ValidationError') {
        const response: ErrorResponse = {
          error: 'Validation Error',
          message: error.message,
          timestamp,
          path,
        };
        return NextResponse.json(response, { status: 400 });
      }

      // Generic error
      const response: ErrorResponse = {
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : 'Unknown error') : 
          'Something went wrong',
        timestamp,
        path,
      };
      return NextResponse.json(response, { status: 500 });
    }
  };
};

// Common error creators
export const createNotFoundError = (resource: string) => 
  new ApiError(`${resource} not found`, 404);

export const createValidationError = (message: string, details?: any) =>
  new ApiError(message, 400, details);

export const createUnauthorizedError = (message: string = 'Unauthorized') =>
  new ApiError(message, 401);

export const createForbiddenError = (message: string = 'Forbidden') =>
  new ApiError(message, 403);

export const createConflictError = (message: string) =>
  new ApiError(message, 409);

export default withErrorHandler;



