import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

export interface SanitizationOptions {
  allowHtml?: boolean;
  maxLength?: number;
  trimWhitespace?: boolean;
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}

const defaultOptions: SanitizationOptions = {
  allowHtml: false,
  maxLength: 1000,
  trimWhitespace: true,
  allowedTags: [],
  allowedAttributes: {}
};

// Sanitize string input
export function sanitizeString(input: string, options: SanitizationOptions = {}): string {
  const opts = { ...defaultOptions, ...options };
  
  if (typeof input !== 'string') {
    return '';
  }
  
  let sanitized = input;
  
  // Trim whitespace
  if (opts.trimWhitespace) {
    sanitized = sanitized.trim();
  }
  
  // Truncate if too long
  if (opts.maxLength && sanitized.length > opts.maxLength) {
    sanitized = sanitized.substring(0, opts.maxLength);
  }
  
  // HTML sanitization
  if (opts.allowHtml) {
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: opts.allowedTags || ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: Array.isArray(opts.allowedAttributes) ? opts.allowedAttributes : ['href', 'title', 'class', 'id']
    });
  } else {
    // Strip all HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  // Escape special characters
  sanitized = validator.escape(sanitized);
  
  return sanitized;
}

// Sanitize email
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }
  
  const sanitized = validator.normalizeEmail(email.trim()) || '';
  return validator.isEmail(sanitized) ? sanitized : '';
}

// Sanitize URL
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }
  
  const sanitized = url.trim();
  
  // Check if it's a valid URL
  if (!validator.isURL(sanitized, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true
  })) {
    return '';
  }
  
  return sanitized;
}

// Sanitize phone number
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') {
    return '';
  }
  
  // Remove all non-digit characters except +
  const sanitized = phone.replace(/[^\d+]/g, '');
  
  // Validate phone number format
  if (validator.isMobilePhone(sanitized, 'ar-SA')) {
    return sanitized;
  }
  
  return '';
}

// Sanitize object recursively
export function sanitizeObject(obj: any, options: SanitizationOptions = {}): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj, options);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, options));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key], options);
      }
    }
    return sanitized;
  }
  
  return obj;
}

// Validation helpers
export const validators = {
  email: (value: string): boolean => {
    const sanitized = sanitizeEmail(value);
    return sanitized.length > 0 && validator.isEmail(sanitized);
  },
  
  password: (value: string): boolean => {
    return typeof value === 'string' && 
           value.length >= 8 && 
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value);
  },
  
  phone: (value: string): boolean => {
    const sanitized = sanitizePhone(value);
    return sanitized.length > 0;
  },
  
  url: (value: string): boolean => {
    const sanitized = sanitizeUrl(value);
    return sanitized.length > 0;
  },
  
  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },
  
  minLength: (value: string, min: number): boolean => {
    return typeof value === 'string' && value.length >= min;
  },
  
  maxLength: (value: string, max: number): boolean => {
    return typeof value === 'string' && value.length <= max;
  },
  
  numeric: (value: string): boolean => {
    return typeof value === 'string' && validator.isNumeric(value);
  },
  
  alphanumeric: (value: string): boolean => {
    return typeof value === 'string' && validator.isAlphanumeric(value);
  },
  
  uuid: (value: string): boolean => {
    return typeof value === 'string' && validator.isUUID(value);
  }
};

// Sanitize input middleware
export function sanitizeInput(input: any, options: SanitizationOptions = {}): any {
  return sanitizeObject(input, options);
}

// Validation schema interface
export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'phone';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
    sanitize?: SanitizationOptions;
  };
}

// Validate data against schema
export function validateSchema(data: any, schema: ValidationSchema): { 
  isValid: boolean; 
  errors: Record<string, string>; 
  sanitized: any 
} {
  const errors: Record<string, string> = {};
  const sanitized: any = {};
  
  // Check required fields
  for (const field in schema) {
    const rules = schema[field];
    const value = data[field];
    
    if (rules.required && (!value || (typeof value === 'string' && value.trim().length === 0))) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (value === undefined || value === null) {
      sanitized[field] = value;
      continue;
    }
    
    // Sanitize value
    let sanitizedValue = value;
    if (rules.sanitize) {
      sanitizedValue = typeof value === 'string' ? 
        sanitizeString(value, rules.sanitize) : 
        sanitizeObject(value, rules.sanitize);
    }
    
    // Type validation
    if (rules.type) {
      switch (rules.type) {
        case 'email':
          if (!validators.email(sanitizedValue)) {
            errors[field] = `${field} must be a valid email`;
            continue;
          }
          sanitizedValue = sanitizeEmail(sanitizedValue);
          break;
        case 'url':
          if (!validators.url(sanitizedValue)) {
            errors[field] = `${field} must be a valid URL`;
            continue;
          }
          sanitizedValue = sanitizeUrl(sanitizedValue);
          break;
        case 'phone':
          if (!validators.phone(sanitizedValue)) {
            errors[field] = `${field} must be a valid phone number`;
            continue;
          }
          sanitizedValue = sanitizePhone(sanitizedValue);
          break;
        case 'string':
          if (typeof sanitizedValue !== 'string') {
            errors[field] = `${field} must be a string`;
            continue;
          }
          break;
        case 'number':
          if (typeof sanitizedValue !== 'number' && !validators.numeric(sanitizedValue)) {
            errors[field] = `${field} must be a number`;
            continue;
          }
          sanitizedValue = typeof sanitizedValue === 'string' ? parseFloat(sanitizedValue) : sanitizedValue;
          break;
        case 'boolean':
          if (typeof sanitizedValue !== 'boolean') {
            errors[field] = `${field} must be a boolean`;
            continue;
          }
          break;
      }
    }
    
    // Length validation
    if (typeof sanitizedValue === 'string') {
      if (rules.minLength && sanitizedValue.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
        continue;
      }
      if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
        errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
        continue;
      }
    }
    
    // Pattern validation
    if (rules.pattern && typeof sanitizedValue === 'string') {
      if (!rules.pattern.test(sanitizedValue)) {
        errors[field] = `${field} format is invalid`;
        continue;
      }
    }
    
    // Custom validation
    if (rules.custom && !rules.custom(sanitizedValue)) {
      errors[field] = `${field} is invalid`;
      continue;
    }
    
    sanitized[field] = sanitizedValue;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized
  };
}


