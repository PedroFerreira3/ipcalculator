import type { ParsedIpInput } from '../types/network'
import { assertValidCidr, cidrToMask, isValidIpv4, maskToCidr } from './ipHelpers'

export function parseIpInput(input: string): ParsedIpInput {
  const normalizedInput = input.trim()

  if (!normalizedInput) {
    throw new Error('Input is required')
  }

  if (normalizedInput.includes('/')) {
    const cidrMatch = normalizedInput.match(/^([^/\s]+)\s*\/\s*(\d{1,2})$/)

    if (!cidrMatch) {
      throw new Error('Invalid CIDR input format')
    }

    const ip = cidrMatch[1]
    const cidr = Number.parseInt(cidrMatch[2], 10)

    if (!isValidIpv4(ip)) {
      throw new Error('Invalid IPv4 address')
    }

    assertValidCidr(cidr)

    return {
      ip,
      mask: cidrToMask(cidr),
      cidr,
    }
  }

  const parts = normalizedInput.split(/\s+/)

  if (parts.length !== 2) {
    throw new Error('Input must be in CIDR or "IP netmask" format')
  }

  const [ip, mask] = parts

  if (!isValidIpv4(ip)) {
    throw new Error('Invalid IPv4 address')
  }

  const cidr = maskToCidr(mask)

  return {
    ip,
    mask,
    cidr,
  }
}
