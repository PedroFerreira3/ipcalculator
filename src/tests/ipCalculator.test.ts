import { describe, expect, it } from 'vitest'

import {
  calculateBroadcast,
  calculateHostMax,
  calculateHostMin,
  calculateHostsPerNetwork,
  calculateNetwork,
  calculateNetworkInfo,
  calculateWildcard,
  convertBinaryToIp,
  convertIpToBinary,
} from '../services/ipCalculator'
import type { ParsedIpInput } from '../types/network'
import { getNetworkClass } from '../utils/ipHelpers'

describe('ipCalculator', () => {
  it('converts dotted decimal IP to binary octets', () => {
    expect(convertIpToBinary('192.168.1.10')).toBe(
      '11000000.10101000.00000001.00001010',
    )
  })

  it('converts binary octets back to dotted decimal IP', () => {
    expect(convertBinaryToIp('11000000.10101000.00000001.00001010')).toBe(
      '192.168.1.10',
    )
  })

  it('calculates network and broadcast from IP + mask', () => {
    expect(calculateNetwork('192.168.1.10', '255.255.255.0')).toBe('192.168.1.0')
    expect(calculateBroadcast('192.168.1.0', '255.255.255.0')).toBe('192.168.1.255')
  })

  it('calculates host range and host count for /24', () => {
    expect(calculateHostMin('192.168.1.0', 24)).toBe('192.168.1.1')
    expect(calculateHostMax('192.168.1.255', 24)).toBe('192.168.1.254')
    expect(calculateHostsPerNetwork(24)).toBe(254)
  })

  it('calculates wildcard from netmask', () => {
    expect(calculateWildcard('255.255.255.0')).toBe('0.0.0.255')
  })

  it('returns the complete network result from parsed input', () => {
    const parsed: ParsedIpInput = {
      ip: '192.168.1.10',
      mask: '255.255.255.0',
      cidr: 24,
    }

    expect(calculateNetworkInfo(parsed)).toEqual({
      address: '192.168.1.10',
      netmask: '255.255.255.0',
      wildcard: '0.0.0.255',
      network: '192.168.1.0',
      broadcast: '192.168.1.255',
      hostMin: '192.168.1.1',
      hostMax: '192.168.1.254',
      hostsPerNet: 254,
      networkClass: 'Class C (Private)',
    })
  })

  describe('/32 — single host', () => {
    it('returns the host itself as network and broadcast', () => {
      expect(calculateNetwork('10.0.0.1', '255.255.255.255')).toBe('10.0.0.1')
      expect(calculateBroadcast('10.0.0.1', '255.255.255.255')).toBe('10.0.0.1')
    })

    it('returns the host itself as hostMin and hostMax', () => {
      expect(calculateHostMin('10.0.0.1', 32)).toBe('10.0.0.1')
      expect(calculateHostMax('10.0.0.1', 32)).toBe('10.0.0.1')
    })

    it('counts 1 host', () => {
      expect(calculateHostsPerNetwork(32)).toBe(1)
    })

    it('returns full result via calculateNetworkInfo', () => {
      const parsed: ParsedIpInput = { ip: '10.0.0.1', mask: '255.255.255.255', cidr: 32 }
      expect(calculateNetworkInfo(parsed)).toEqual({
        address: '10.0.0.1',
        netmask: '255.255.255.255',
        wildcard: '0.0.0.0',
        network: '10.0.0.1',
        broadcast: '10.0.0.1',
        hostMin: '10.0.0.1',
        hostMax: '10.0.0.1',
        hostsPerNet: 1,
        networkClass: 'Class A (Private)',
      })
    })
  })

  describe('/31 — point-to-point link (RFC 3021)', () => {
    it('calculates network and broadcast correctly', () => {
      expect(calculateNetwork('192.168.1.4', '255.255.255.254')).toBe('192.168.1.4')
      expect(calculateBroadcast('192.168.1.4', '255.255.255.254')).toBe('192.168.1.5')
    })

    it('returns both addresses as usable hosts', () => {
      expect(calculateHostMin('192.168.1.4', 31)).toBe('192.168.1.4')
      expect(calculateHostMax('192.168.1.5', 31)).toBe('192.168.1.5')
    })

    it('counts 2 hosts', () => {
      expect(calculateHostsPerNetwork(31)).toBe(2)
    })

    it('returns full result via calculateNetworkInfo', () => {
      const parsed: ParsedIpInput = { ip: '192.168.1.5', mask: '255.255.255.254', cidr: 31 }
      expect(calculateNetworkInfo(parsed)).toEqual({
        address: '192.168.1.5',
        netmask: '255.255.255.254',
        wildcard: '0.0.0.1',
        network: '192.168.1.4',
        broadcast: '192.168.1.5',
        hostMin: '192.168.1.4',
        hostMax: '192.168.1.5',
        hostsPerNet: 2,
        networkClass: 'Class C (Private)',
      })
    })
  })

  describe('/0 — entire address space', () => {
    it('calculates network and broadcast correctly', () => {
      expect(calculateNetwork('10.0.0.1', '0.0.0.0')).toBe('0.0.0.0')
      expect(calculateBroadcast('0.0.0.0', '0.0.0.0')).toBe('255.255.255.255')
    })

    it('calculates host range correctly', () => {
      expect(calculateHostMin('0.0.0.0', 0)).toBe('0.0.0.1')
      expect(calculateHostMax('255.255.255.255', 0)).toBe('255.255.255.254')
    })

    it('counts 4294967294 hosts', () => {
      expect(calculateHostsPerNetwork(0)).toBe(4294967294)
    })

    it('calculates wildcard correctly', () => {
      expect(calculateWildcard('0.0.0.0')).toBe('255.255.255.255')
    })
  })

  describe('getNetworkClass', () => {
    it('identifies private classes', () => {
      expect(getNetworkClass('10.0.0.1')).toBe('Class A (Private)')
      expect(getNetworkClass('172.16.0.1')).toBe('Class B (Private)')
      expect(getNetworkClass('172.31.255.255')).toBe('Class B (Private)')
      expect(getNetworkClass('192.168.0.1')).toBe('Class C (Private)')
    })

    it('identifies public classes', () => {
      expect(getNetworkClass('8.8.8.8')).toBe('Class A')
      expect(getNetworkClass('130.0.0.1')).toBe('Class B')
      expect(getNetworkClass('200.0.0.1')).toBe('Class C')
    })

    it('identifies special ranges', () => {
      expect(getNetworkClass('127.0.0.1')).toBe('Loopback')
      expect(getNetworkClass('224.0.0.1')).toBe('Class D (Multicast)')
      expect(getNetworkClass('240.0.0.1')).toBe('Class E (Reserved)')
      expect(getNetworkClass('0.0.0.0')).toBe('Special')
    })
  })

  describe('invalid inputs', () => {
    it('throws for a non-contiguous netmask', () => {
      expect(() => calculateNetwork('192.168.1.1', '255.0.255.0')).toThrow('Invalid netmask')
      expect(() => calculateBroadcast('192.168.1.0', '255.0.255.0')).toThrow('Invalid netmask')
      expect(() => calculateWildcard('255.0.255.0')).toThrow('Invalid netmask')
    })

    it('throws for CIDR out of range', () => {
      expect(() => calculateHostsPerNetwork(33)).toThrow()
      expect(() => calculateHostsPerNetwork(-1)).toThrow()
    })
  })
})
