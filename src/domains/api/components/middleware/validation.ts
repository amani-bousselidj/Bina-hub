import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export interface ValidationOptions {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

export interface ValidatedRequest extends NextRequest {
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export interface ValidationConfig {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

export function createValidationMiddleware(options: ValidationOptions) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const url = new URL(request.url);
      
      // Validate query parameters
      if (options.query) {
        const queryParams = Object.fromEntries(url.searchParams);
        const queryResult = options.query.safeParse(queryParams);
        
        if (!queryResult.success) {
          return NextResponse.json(
            { 
              error: 'Invalid query parameters', 
              details: queryResult.error.issues 
            },
            { status: 400 }
          );
        }
        
        (request as ValidatedRequest).validatedQuery = queryResult.data;
      }

      // Validate request body
      if (options.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
        try {
          const body = await request.json();
          const bodyResult = options.body.safeParse(body);
          
          if (!bodyResult.success) {
            return NextResponse.json(
              { 
                error: 'Invalid request body', 
                details: bodyResult.error.issues 
              },
              { status: 400 }
            );
          }
          
          (request as ValidatedRequest).validatedBody = bodyResult.data;
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          );
        }
      }

      // If validation passes, return null to continue to next middleware/handler
      return null;
    } catch (error) {
      return NextResponse.json(
        { error: 'Validation middleware error' },
        { status: 500 }
      );
    }
  };
}

export const validationMiddleware = (config: ValidationConfig) => {
  return async (req: NextRequest) => {
    const middleware = createValidationMiddleware(config);
    const result = await middleware(req);
    return result || NextResponse.next();
  };
};

export const commonSchemas = {
  id: z.string().uuid(),
  email: z.string().email(),
  phone: z.string(),
  pagination: z.object({
    page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1)).optional(),
    limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1).max(100)).optional(),
  }),
  search: z.object({
    query: z.string().optional(),
    filters: z.record(z.string(), z.any()).optional(),
  }),
  createProduct: z.object({
    name: z.string(),
    price: z.number(),
    description: z.string().optional(),
    category: z.string(),
  }),
  createOrder: z.object({
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number(),
    })),
    customerId: z.string(),
    total: z.number(),
  }),
  createUser: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    phone: z.string().optional(),
  }),
};

export default createValidationMiddleware;



