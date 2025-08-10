export interface ValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: ValidationRule[];
}

export interface FormErrors {
  [key: string]: string[];
}

export class FormValidator {
  static validateField(value: any, rules: FieldValidation): string[] {
    const errors: string[] = [];

    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push('This field is required');
    }

    if (value && typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`Minimum length is ${rules.minLength} characters`);
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`Maximum length is ${rules.maxLength} characters`);
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push('Invalid format');
      }
    }

    if (rules.custom) {
      for (const rule of rules.custom) {
        if (!rule.validate(value)) {
          errors.push(rule.message);
        }
      }
    }

    return errors;
  }

  static validateForm(data: Record<string, any>, schema: Record<string, FieldValidation>): FormErrors {
    const errors: FormErrors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const fieldErrors = this.validateField(data[field], rules);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    }

    return errors;
  }

  static hasErrors(errors: FormErrors): boolean {
    return Object.keys(errors).length > 0;
  }
}

// Common validation rules
export const ValidationRules = {
  email: {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  phone: {
    validate: (value: string) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')),
    message: 'Please enter a valid phone number'
  },
  strongPassword: {
    validate: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
  }
};


