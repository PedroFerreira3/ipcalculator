const IPV4_REGEX =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/

function assertIntegerInRange(value: number, min: number, max: number, label: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${label} must be an integer between ${min} and ${max}`)
  }
}

function parseIpv4(ip: string, label = 'IPv4 address'): number[] {
  if (!IPV4_REGEX.test(ip)) {
    throw new Error(`Invalid ${label}`)
  }

  return ip.split('.').map((part) => Number.parseInt(part, 10))
}

export function isValidIpv4(ip: string): boolean {
  return IPV4_REGEX.test(ip)
}

export function assertValidCidr(cidr: number): void {
  assertIntegerInRange(cidr, 0, 32, 'CIDR')
}

export function ipToInt(ip: string): number {
  const [a, b, c, d] = parseIpv4(ip)
  return (((a << 24) >>> 0) + (b << 16) + (c << 8) + d) >>> 0
}

export function intToIp(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) {
    throw new Error('Invalid IPv4 integer value')
  }

  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join('.')
}

export function cidrToMask(cidr: number): string {
  assertValidCidr(cidr)
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0
  return intToIp(maskInt)
}

export function maskToCidr(mask: string): number {
  const maskInt = ipToInt(mask)
  const binaryMask = maskInt.toString(2).padStart(32, '0')

  if (!/^1*0*$/.test(binaryMask)) {
    throw new Error('Invalid netmask')
  }

  const firstZeroIndex = binaryMask.indexOf('0')
  return firstZeroIndex === -1 ? 32 : firstZeroIndex
}

export function assertValidMask(mask: string): void {
  maskToCidr(mask)
}

export function getNetworkClass(ip: string): string {
  const parts = ip.split('.').map(Number)
  const a = parts[0]
  const b = parts[1]

  if (a === 0) return 'Special'
  if (a === 10) return 'Class A (Private)'
  if (a < 127) return 'Class A'
  if (a === 127) return 'Loopback'
  if (a === 172 && b >= 16 && b <= 31) return 'Class B (Private)'
  if (a < 192) return 'Class B'
  if (a === 192 && b === 168) return 'Class C (Private)'
  if (a < 224) return 'Class C'
  if (a < 240) return 'Class D (Multicast)'
  return 'Class E (Reserved)'
}

export function clampOctet(octet: string): string {
  if (!octet) {
    return ''
  }

  return String(Math.min(Number.parseInt(octet, 10), 255))
}

export function wildcardFromMask(mask: string): string {
  const maskInt = ipToInt(mask)
  return intToIp((~maskInt) >>> 0)
}

export function binaryOctetsToIp(binary: string): string {
  const binaryRegex = /^[01]{8}(\.[01]{8}){3}$/

  if (!binaryRegex.test(binary)) {
    throw new Error('Invalid binary IPv4 format')
  }

  return binary
    .split('.')
    .map((octet) => Number.parseInt(octet, 2))
    .join('.')
}

export function ipToBinaryOctets(ip: string): string {
  return parseIpv4(ip)
    .map((octet) => octet.toString(2).padStart(8, '0'))
    .join('.')
}
