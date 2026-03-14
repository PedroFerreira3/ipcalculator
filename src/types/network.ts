export interface ParsedIpInput {
  ip: string
  mask: string
  cidr: number
}

export interface NetworkResult {
  address: string
  netmask: string
  wildcard: string
  network: string
  broadcast: string
  hostMin: string
  hostMax: string
  hostsPerNet: number
  networkClass: string
}
