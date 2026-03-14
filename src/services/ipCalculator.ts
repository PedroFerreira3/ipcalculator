import type { NetworkResult, ParsedIpInput } from '../types/network'
import {
  assertValidCidr,
  assertValidMask,
  binaryOctetsToIp,
  getNetworkClass,
  intToIp,
  ipToBinaryOctets,
  ipToInt,
  wildcardFromMask,
} from '../utils/ipHelpers'

export function convertIpToBinary(ip: string): string {
  return ipToBinaryOctets(ip)
}

export function convertBinaryToIp(binary: string): string {
  return binaryOctetsToIp(binary)
}

export function calculateNetwork(ip: string, mask: string): string {
  assertValidMask(mask)
  const ipInt = ipToInt(ip)
  const maskInt = ipToInt(mask)
  return intToIp((ipInt & maskInt) >>> 0)
}

export function calculateBroadcast(network: string, mask: string): string {
  assertValidMask(mask)
  const networkInt = ipToInt(network)
  const maskInt = ipToInt(mask)
  return intToIp((networkInt | ((~maskInt) >>> 0)) >>> 0)
}

export function calculateHostMin(network: string, cidr: number): string {
  assertValidCidr(cidr)
  const networkInt = ipToInt(network)

  if (cidr >= 31) {
    return intToIp(networkInt)
  }

  return intToIp((networkInt + 1) >>> 0)
}

export function calculateHostMax(broadcast: string, cidr: number): string {
  assertValidCidr(cidr)
  const broadcastInt = ipToInt(broadcast)

  if (cidr >= 31) {
    return intToIp(broadcastInt)
  }

  return intToIp((broadcastInt - 1) >>> 0)
}

export function calculateWildcard(mask: string): string {
  assertValidMask(mask)
  return wildcardFromMask(mask)
}

export function calculateHostsPerNetwork(cidr: number): number {
  assertValidCidr(cidr)

  if (cidr === 32) {
    return 1
  }

  if (cidr === 31) {
    return 2
  }

  return 2 ** (32 - cidr) - 2
}

export function calculateNetworkInfo(input: ParsedIpInput): NetworkResult {
  const network = calculateNetwork(input.ip, input.mask)
  const broadcast = calculateBroadcast(network, input.mask)
  const wildcard = calculateWildcard(input.mask)

  return {
    address: input.ip,
    netmask: input.mask,
    wildcard,
    network,
    broadcast,
    hostMin: calculateHostMin(network, input.cidr),
    hostMax: calculateHostMax(broadcast, input.cidr),
    hostsPerNet: calculateHostsPerNetwork(input.cidr),
    networkClass: getNetworkClass(input.ip),
  }
}
