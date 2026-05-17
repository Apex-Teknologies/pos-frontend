/**
 * Unit tests for lib/utils.ts
 * Run with: npx jest (after installing jest + @testing-library/react)
 */
import { formatCurrency, formatDate, generateReceiptNumber } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats number with default symbol', () => {
    expect(formatCurrency(100)).toBe('₵100.00')
  })
  it('formats with custom symbol', () => {
    expect(formatCurrency(50, '$')).toBe('$50.00')
  })
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('₵0.00')
  })
  it('handles decimals', () => {
    expect(formatCurrency(9.5)).toBe('₵9.50')
  })
})

describe('formatDate', () => {
  it('returns a formatted date string', () => {
    const iso = '2026-01-15T10:00:00.000Z'
    const result = formatDate(iso)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('generateReceiptNumber', () => {
  it('starts with RCP-', () => {
    expect(generateReceiptNumber()).toMatch(/^RCP-/)
  })
  it('generates unique numbers', () => {
    const a = generateReceiptNumber()
    const b = generateReceiptNumber()
    expect(a).not.toBe(b)
  })
})
