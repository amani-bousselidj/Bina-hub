// @ts-nocheck
// Client-safe utilities without Medusa.js server-side imports

/**
 * Client-side rule types and utilities
 */

export type Rule = {
  attribute: string
  operator: string
  value: any[] | string | number | boolean | Date
}

export type RuleSet = {
  field_hash: string
  rules: Rule[]
}

// Client-side utility functions without server dependencies
export const isObject = (obj: any): obj is object => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

export const isString = (str: any): str is string => {
  return typeof str === 'string'
}

export const pickValueFromObject = (obj: any, path: string) => {
  const keys = path.split('.')
  let result = obj
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return undefined
    }
  }
  
  return result
}

// Rule operators enum (client-side version)
export const RuleOperator = {
  EQ: 'eq',
  NE: 'ne',
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
  IN: 'in',
  NIN: 'nin',
} as const

// Client-side rule processing functions
export const buildRuleSet = ({ data, rules }: any) => {
  // Implementation for client-side rule building
  return {
    field_hash: '',
    rules: []
  }
}

export const availableOperators = Object.values(RuleOperator)

const isDate = (str: string) => {
  return !isNaN(Date.parse(str))
}

const operatorsPredicate = {
  in: (contextValue: string, ruleValue: string[]) =>
    ruleValue.includes(contextValue),
  nin: (contextValue: string, ruleValue: string[]) =>
    !ruleValue.includes(contextValue),
  eq: (contextValue: string, ruleValue: string) => contextValue === ruleValue,
  ne: (contextValue: string, ruleValue: string) => contextValue !== ruleValue,
  gt: (contextValue: string, ruleValue: string) => {
    if (isDate(contextValue) && isDate(ruleValue)) {
      return new Date(contextValue) > new Date(ruleValue)
    }
    return Number(contextValue) > Number(ruleValue)
  },
  gte: (contextValue: string, ruleValue: string) => {
    if (isDate(contextValue) && isDate(ruleValue)) {
      return new Date(contextValue) >= new Date(ruleValue)
    }
    return Number(contextValue) >= Number(ruleValue)
  },
  lt: (contextValue: string, ruleValue: string) => {
    if (isDate(contextValue) && isDate(ruleValue)) {
      return new Date(contextValue) < new Date(ruleValue)
    }
    return Number(contextValue) < Number(ruleValue)
  },
  lte: (contextValue: string, ruleValue: string) => {
    if (isDate(contextValue) && isDate(ruleValue)) {
      return new Date(contextValue) <= new Date(ruleValue)
    }
    return Number(contextValue) <= Number(ruleValue)
  },
}

/**
 * Validate contextValue context object from contextValue set of rules.
 * By default, all rules must be valid to return true unless the option atLeastOneValidRule is set to true.
 * @param context
 * @param rules
 * @param options
 */
export function isContextValid(
  context: Record<string, any>,
  rules: Rule[],
  options: {
    someAreValid: boolean
  } = {
    someAreValid: false,
  }
): boolean {
  const { someAreValid } = options

  const loopComparator = someAreValid ? rules.some : rules.every
  const predicate = (rule) => {
    const { attribute, operator, value } = rule
    const contextValue = pickValueFromObject(attribute, context)

    return operatorsPredicate[operator](
      `${contextValue}`,
      value as string & string[]
    )
  }

  return loopComparator.apply(rules, [predicate])
}

/**
 * Validate contextValue rule object (client-safe version)
 * @param rule
 */
export function validateRule(rule: Record<string, unknown>): boolean {
  if (!rule.attribute || !rule.operator || !rule.value) {
    throw new Error("Rule must have an attribute, an operator and a value")
  }

  if (!isString(rule.attribute)) {
    throw new Error("Rule attribute must be a string")
  }

  if (!isString(rule.operator)) {
    throw new Error("Rule operator must be a string")
  }

  if (!availableOperators.includes(rule.operator as any)) {
    throw new Error(
      `Rule operator ${
        rule.operator
      } is not supported. Must be one of ${availableOperators.join(", ")}`
    )
  }

  if (rule.operator === RuleOperator.IN || rule.operator === RuleOperator.NIN) {
    if (!Array.isArray(rule.value)) {
      throw new Error("Rule value must be an array for in/nin operators")
    }
  } else {
    if (Array.isArray(rule.value) || isObject(rule.value)) {
      throw new Error(
        `Rule value must be a string, bool, number value for the selected operator ${rule.operator}`
      )
    }
  }

  return true
}

export function normalizeRulesValue<T extends Partial<Rule>>(rules: T[]): void {
  rules.forEach((rule: any) => {
    /**
     * If a boolean is provided, then we convert to string
     */
    if (rule.value === true || rule.value === false) {
      rule.value = rule.value === true ? "true" : "false"
    }

    return rule
  })
}

export function validateAndNormalizeRules<T extends Partial<Rule>>(rules: T[]) {
  rules.forEach(validateRule)
  normalizeRulesValue(rules)
}

/**
 * Validate contextValue set of rules
 * @param rules
 */
export function validateRules(rules: Record<string, unknown>[]): boolean {
  rules.forEach(validateRule)
  return true
}




