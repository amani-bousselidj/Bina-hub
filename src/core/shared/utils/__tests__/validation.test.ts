import { FormValidator, ValidationRules } from '../validation';

describe('FormValidator', () => {
  describe('validateField', () => {
    it('validates required fields correctly', () => {
      const rules = { required: true };
      
      expect(FormValidator.validateField('', rules)).toContain('This field is required');
      expect(FormValidator.validateField('  ', rules)).toContain('This field is required');
      expect(FormValidator.validateField(null, rules)).toContain('This field is required');
      expect(FormValidator.validateField('valid value', rules)).toEqual([]);
    });

    it('validates minLength correctly', () => {
      const rules = { minLength: 5 };
      
      expect(FormValidator.validateField('abc', rules)).toContain('Minimum length is 5 characters');
      expect(FormValidator.validateField('12345', rules)).toEqual([]);
      expect(FormValidator.validateField('123456', rules)).toEqual([]);
    });

    it('validates maxLength correctly', () => {
      const rules = { maxLength: 10 };
      
      expect(FormValidator.validateField('12345678901', rules)).toContain('Maximum length is 10 characters');
      expect(FormValidator.validateField('1234567890', rules)).toEqual([]);
      expect(FormValidator.validateField('123', rules)).toEqual([]);
    });

    it('validates pattern correctly', () => {
      const rules = { pattern: /^\d+$/ }; // Only digits
      
      expect(FormValidator.validateField('abc123', rules)).toContain('Invalid format');
      expect(FormValidator.validateField('123', rules)).toEqual([]);
    });

    it('validates custom rules correctly', () => {
      const rules = {
        custom: [
          {
            validate: (value: string) => value.includes('@'),
            message: 'Must contain @ symbol'
          }
        ]
      };
      
      expect(FormValidator.validateField('invalid', rules)).toContain('Must contain @ symbol');
      expect(FormValidator.validateField('valid@email', rules)).toEqual([]);
    });

    it('combines multiple validation errors', () => {
      const rules = {
        required: true,
        minLength: 5,
        pattern: /^\d+$/
      };
      
      const errors = FormValidator.validateField('ab', rules);
      expect(errors).toContain('Minimum length is 5 characters');
      expect(errors).toContain('Invalid format');
    });
  });

  describe('validateForm', () => {
    it('validates entire form correctly', () => {
      const data = {
        name: '',
        email: 'invalid-email',
        password: '123'
      };

      const schema = {
        name: { required: true },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { required: true, minLength: 8 }
      };

      const errors = FormValidator.validateForm(data, schema);
      
      expect(errors.name).toContain('This field is required');
      expect(errors.email).toContain('Invalid format');
      expect(errors.password).toContain('Minimum length is 8 characters');
    });

    it('returns empty object for valid form', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword123'
      };

      const schema = {
        name: { required: true },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { required: true, minLength: 8 }
      };

      const errors = FormValidator.validateForm(data, schema);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('hasErrors', () => {
    it('correctly identifies if errors exist', () => {
      expect(FormValidator.hasErrors({})).toBe(false);
      expect(FormValidator.hasErrors({ field: ['error'] })).toBe(true);
    });
  });
});

describe('ValidationRules', () => {
  it('validates email correctly', () => {
    expect(ValidationRules.email.validate('test@example.com')).toBe(true);
    expect(ValidationRules.email.validate('invalid-email')).toBe(false);
    expect(ValidationRules.email.validate('test@')).toBe(false);
    expect(ValidationRules.email.validate('@example.com')).toBe(false);
  });

  it('validates phone correctly', () => {
    expect(ValidationRules.phone.validate('+1234567890')).toBe(true);
    expect(ValidationRules.phone.validate('1234567890')).toBe(true);
    expect(ValidationRules.phone.validate('+1 234 567 890')).toBe(true);
    expect(ValidationRules.phone.validate('abc123')).toBe(false);
    expect(ValidationRules.phone.validate('')).toBe(false);
  });

  it('validates strong password correctly', () => {
    expect(ValidationRules.strongPassword.validate('Password123!')).toBe(true);
    expect(ValidationRules.strongPassword.validate('weakpass')).toBe(false);
    expect(ValidationRules.strongPassword.validate('PASSWORD123!')).toBe(false); // no lowercase
    expect(ValidationRules.strongPassword.validate('password123!')).toBe(false); // no uppercase
    expect(ValidationRules.strongPassword.validate('Password!')).toBe(false); // no number
    expect(ValidationRules.strongPassword.validate('Password123')).toBe(false); // no special char
  });
});


