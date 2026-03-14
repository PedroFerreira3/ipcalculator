import { describe, expect, it } from 'vitest'

import { parseIpInput } from '../utils/ipParser'

describe('parseIpInput', () => {
  it('parses CIDR input into a normalized structure', () => {
    expect(parseIpInput('192.168.1.10/24')).toEqual({
      ip: '192.168.1.10',
      mask: '255.255.255.0',
      cidr: 24,
    })
  })

  it('parses "address + netmask" input into the same structure', () => {
    expect(parseIpInput('192.168.1.10 255.255.255.0')).toEqual({
      ip: '192.168.1.10',
      mask: '255.255.255.0',
      cidr: 24,
    })
  })

  it('returns the same parsed structure for both accepted formats', () => {
    const fromCidr = parseIpInput('192.168.1.10/24')
    const fromMask = parseIpInput('192.168.1.10 255.255.255.0')

    expect(fromCidr).toEqual(fromMask)
  })

  it('parses /0 correctly', () => {
    expect(parseIpInput('10.0.0.1/0')).toEqual({
      ip: '10.0.0.1',
      mask: '0.0.0.0',
      cidr: 0,
    })
  })

  it('parses /32 correctly', () => {
    expect(parseIpInput('10.0.0.1/32')).toEqual({
      ip: '10.0.0.1',
      mask: '255.255.255.255',
      cidr: 32,
    })
  })

  it('parses /31 correctly', () => {
    expect(parseIpInput('192.168.1.4/31')).toEqual({
      ip: '192.168.1.4',
      mask: '255.255.255.254',
      cidr: 31,
    })
  })

  it('accepts extra whitespace around the slash in CIDR', () => {
    expect(parseIpInput('  192.168.1.10 / 24  ')).toEqual({
      ip: '192.168.1.10',
      mask: '255.255.255.0',
      cidr: 24,
    })
  })

  describe('invalid inputs', () => {
    it('throws for empty input', () => {
      expect(() => parseIpInput('')).toThrow('Input is required')
      expect(() => parseIpInput('   ')).toThrow('Input is required')
    })

    it('throws for CIDR out of range', () => {
      expect(() => parseIpInput('192.168.1.10/33')).toThrow()
    })

    it('throws for an invalid IPv4 address in CIDR format', () => {
      expect(() => parseIpInput('999.1.1.1/24')).toThrow('Invalid IPv4 address')
      expect(() => parseIpInput('192.168.1/24')).toThrow('Invalid IPv4 address')
    })

    it('throws for an invalid IPv4 address in netmask format', () => {
      expect(() => parseIpInput('999.1.1.1 255.255.255.0')).toThrow('Invalid IPv4 address')
    })

    it('throws for a non-contiguous netmask', () => {
      expect(() => parseIpInput('192.168.1.1 255.0.255.0')).toThrow('Invalid netmask')
    })

    it('throws when only the IP is provided with no mask or CIDR', () => {
      expect(() => parseIpInput('192.168.1.10')).toThrow()
    })

    it('throws for completely malformed input', () => {
      expect(() => parseIpInput('not-an-ip')).toThrow()
      expect(() => parseIpInput('192.168.1.10 255.255.255.0 extra')).toThrow()
    })
  })
})
