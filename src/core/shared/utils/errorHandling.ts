import { NextResponse } from 'next/server'
import { z } from 'zod'

export interface ApiError {
  message: string
  code: string
  status: number
  details?: any
}

export class AppError extends Error {
  public readonly status: number
  public readonly code: string
  public readonly details?: any

  constructor(message: string, status: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function createErrorResponse(error: AppError | Error, status?: number): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json({
      error: {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error.details
      }
    }, { status: error.status })
  }

  return NextResponse.json({
    error: {
      message: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
      status: status || 500
    }
  }, { status: status || 500 })
}

export function handleValidationError(error: z.ZodError): AppError {
  const details = error.issues.map((err: any) => ({
    field: err.path.join('.'),
    message: err.message
  }))

  return new AppError(
    'Validation failed',
    400,
    'VALIDATION_ERROR',
    details
  )
}

export function handleDatabaseError(error: any): AppError {
  if (error.code === '23505') {
    return new AppError('Resource already exists', 409, 'DUPLICATE_ERROR')
  }
  
  if (error.code === '23503') {
    return new AppError('Referenced resource not found', 400, 'FOREIGN_KEY_ERROR')
  }

  return new AppError('Database operation failed', 500, 'DATABASE_ERROR')
}

export function logError(error: Error, context?: any) {
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: error.message,
    stack: error.stack,
    context
  })
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry, LogRocket, etc.
  }
}


