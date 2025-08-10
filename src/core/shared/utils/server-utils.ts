// @ts-nocheck
// Server-only utilities that use Medusa.js imports
import {
  MedusaError,
  RuleOperator,
  isObject,
  isString,
  pickValueFromObject,
} from "@medusajs/framework/utils"

/**
 * The rule engine here is kept inside the module as of now, but it could be moved
 * to the utils package and be used across the different modules that provides context
 * based rule filtering.
 *
 * TODO: discussion around that should happen at some point
 */

export type Rule = {
  attribute: string
  operator: Lowercase<keyof typeof RuleOperator> | (string & {})
  value: any[] | string | number | boolean | Date
}

export type RuleSet = {
  field_hash: string
  rules: Rule[]
}

// Re-export Medusa utilities for server-side use
export {
  MedusaError,
  RuleOperator,
  isObject,
  isString,
  pickValueFromObject,
}

// Server-side rule processing functions
export const buildRuleSet = ({ data, rules }: any) => {
  // Implementation for server-side rule building
  return {
    field_hash: '',
    rules: []
  }
}

export const validateRule = (rule: Rule) => {
  // Server-side rule validation
  return true
}


