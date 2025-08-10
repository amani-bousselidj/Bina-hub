import { z } from 'zod';

export const commonSchemas = {
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  phone: z.string().optional(),
  
  // Search and pagination schemas
  search: z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional()
  }),
  
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().min(0).optional()
  }),
  
  // Product schemas
  createProduct: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    inventory: z.number().min(0).default(0)
  }),
  
  // Order schemas
  createOrder: z.object({
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive()
    })),
    shippingAddress: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string()
    }),
    paymentMethod: z.string()
  }),
  
  // Common validation schemas
  createUser: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8)
  }),
  
  updateUser: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional()
  }),
  
  loginRequest: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
};

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (body: unknown): T => {
    return schema.parse(body);
  };
}



