import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')

// User validation schemas
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

// Product validation schemas
export const productSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  inventory_quantity: z.number().min(0, 'Inventory cannot be negative'),
  sku: z.string().optional(),
  images: z.array(z.string().url()).optional(),
})

// Order validation schemas
export const orderItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
})

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  shipping_address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  payment_method: z.enum(['card', 'paypal', 'bank_transfer']),
})

// Form validation helper
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}

// Real-time validation helper
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return {
    validate: (data: unknown) => validateForm(schema, data),
    validateField: (field: string, value: unknown) => {
      try {
        if (schema instanceof z.ZodObject) {
          const fieldSchema = schema.shape[field as keyof typeof schema.shape];
          if (fieldSchema) {
            fieldSchema.parse(value);
            return { success: true };
          }
        }
        return { success: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { success: false, error: error.issues[0]?.message };
        }
        return { success: false, error: 'Validation failed' };
      }
    },
  };
}


