import { Button, Card, CardBody } from '@heroui/react'
import { type ChangeEvent, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { calculateNetworkInfo } from '../services/ipCalculator'
import type { NetworkResult } from '../types/network'
import { cidrToMask, clampOctet, maskToCidr } from '../utils/ipHelpers'
import { parseIpInput } from '../utils/ipParser'
import EraserIcon from './EraserIcon'
import Ipv4OctetInput from './Ipv4OctetInput'

interface IpInputProps {
  onCalculated: (result: NetworkResult | null) => void
  onError: (message: string | null) => void
  onOpenHelp: () => void
}

type InputMode = 'cidr' | 'mask'

const DEFAULT_MASK = ['255', '255', '255', '0']
const EMPTY_OCTETS = ['', '', '', '']
const MAX_CIDR = 32

const PRESETS = [
  { cidr: 8,  mask: '255.0.0.0' },
  { cidr: 16, mask: '255.255.0.0' },
  { cidr: 24, mask: '255.255.255.0' },
  { cidr: 25, mask: '255.255.255.128' },
  { cidr: 26, mask: '255.255.255.192' },
  { cidr: 27, mask: '255.255.255.224' },
  { cidr: 28, mask: '255.255.255.240' },
  { cidr: 29, mask: '255.255.255.248' },
  { cidr: 30, mask: '255.255.255.252' },
  { cidr: 31, mask: '255.255.255.254' },
  { cidr: 32, mask: '255.255.255.255' },
]

function hasEmptyOctets(octets: string[]): boolean {
  return octets.some((octet) => octet === '')
}

function clampCidr(value: string): string {
  if (!value) return ''
  return String(Math.min(Number.parseInt(value, 10), MAX_CIDR))
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandom(): { ip: string[]; preset: typeof PRESETS[number] } {
  const ip = [
    String(randomInt(1, 254)),
    String(randomInt(0, 255)),
    String(randomInt(0, 255)),
    String(randomInt(0, 254)),
  ]
  const preset = PRESETS[randomInt(0, PRESETS.length - 1)]
  return { ip, preset }
}

function HelpIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function DiceIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"
    >
      {/* back die — face 2 */}
      <rect x="0.75" y="0.75" width="13" height="13" rx="2.5" ry="2.5" />
      <circle cx="4.25"  cy="10.25" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="10.25" cy="4.25"  r="1.1" fill="currentColor" stroke="none" />
      {/* front die — face 3 diagonal, filled to occlude back die */}
      <rect x="10.25" y="10.25" width="13" height="13" rx="2.5" ry="2.5"
        fill="var(--surface, #fff)" />
      <circle cx="20.75" cy="12.75" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16.75" cy="16.75" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12.75" cy="20.75" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24" width="15" xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
      viewBox="0 0 24 24" width="15" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export default function IpInput({ onCalculated, onError, onOpenHelp }: IpInputProps) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<InputMode>('cidr')
  const [ipOctets, setIpOctets] = useState<string[]>(EMPTY_OCTETS)
  const [maskOctets, setMaskOctets] = useState<string[]>(DEFAULT_MASK)
  const [cidr, setCidr] = useState('24')
  const [copied, setCopied] = useState(false)

  const setInputMode = (nextMode: InputMode) => {
    if (nextMode === mode) return

    if (nextMode === 'mask') {
      if (cidr !== '') {
        try {
          setMaskOctets(cidrToMask(Number.parseInt(cidr, 10)).split('.'))
        } catch {
          setMaskOctets(DEFAULT_MASK)
        }
      }
    } else if (!hasEmptyOctets(maskOctets)) {
      try {
        setCidr(String(maskToCidr(maskOctets.join('.'))))
      } catch {
        setCidr('24')
      }
    }

    setMode(nextMode)
  }

  const handlePresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (!value) return
    const preset = PRESETS.find((p) => p.cidr === Number.parseInt(value, 10))
    if (!preset) return
    setCidr(String(preset.cidr))
    setMaskOctets(preset.mask.split('.'))
  }

  const handleRandom = () => {
    const { ip, preset } = generateRandom()
    setIpOctets(ip)
    setCidr(String(preset.cidr))
    setMaskOctets(preset.mask.split('.'))
  }

  const handleCopy = async () => {
    const ip = ipOctets.join('.')
    const text = mode === 'cidr'
      ? `${ip}/${cidr}`
      : `${ip} ${maskOctets.join('.')}`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const normalizedIpOctets = ipOctets.map(clampOctet)

      if (normalizedIpOctets.join('.') !== ipOctets.join('.')) {
        setIpOctets(normalizedIpOctets)
      }

      if (hasEmptyOctets(normalizedIpOctets)) {
        throw new Error(t('input.errors.fillIpOctets'))
      }

      const ip = normalizedIpOctets.join('.')

      const rawInput =
        mode === 'cidr'
          ? (() => {
              const normalizedCidr = clampCidr(cidr)
              if (normalizedCidr !== cidr) setCidr(normalizedCidr)
              if (normalizedCidr === '') throw new Error(t('input.errors.enterCidr'))
              return `${ip}/${normalizedCidr}`
            })()
          : (() => {
              const normalizedMaskOctets = maskOctets.map(clampOctet)
              if (normalizedMaskOctets.join('.') !== maskOctets.join('.')) {
                setMaskOctets(normalizedMaskOctets)
              }
              if (hasEmptyOctets(normalizedMaskOctets)) throw new Error(t('input.errors.fillMaskOctets'))
              return `${ip} ${normalizedMaskOctets.join('.')}`
            })()

      const parsedInput = parseIpInput(rawInput)
      const result = calculateNetworkInfo(parsedInput)
      onCalculated(result)
      onError(null)

      setCidr(String(parsedInput.cidr))
      setMaskOctets(parsedInput.mask.split('.'))
    } catch (error) {
      const message = error instanceof Error ? error.message : t('input.errors.unableToParse')
      onCalculated(null)
      onError(message)
    }
  }

  return (
    <Card className="panel-card ip-input-card">
      <div className="card-corner-btns">
        <button
          aria-label={t('help.title')}
          className="random-btn"
          title={t('help.title')}
          type="button"
          onClick={onOpenHelp}
        >
          <HelpIcon />
        </button>
        <button
          aria-label={t('input.randomIp')}
          className="random-btn"
          title={t('input.randomIp')}
          type="button"
          onClick={handleRandom}
        >
          <DiceIcon />
        </button>
      </div>
      <CardBody className="card-body-padded">
        <form className="input-form" onSubmit={handleSubmit}>
          <Ipv4OctetInput
            idPrefix="ip"
            label={t('input.ipAddress')}
            value={ipOctets}
            onChange={setIpOctets}
          />

          <div className="mode-switch">
            <span className="mode-switch-label">{t('input.maskFormat')}</span>
            <div className="seg-bar">
              <button
                className={`seg-btn ${mode === 'cidr' ? 'is-active' : ''}`}
                type="button"
                onClick={() => setInputMode('cidr')}
              >
                Bit / CIDR
              </button>
              <button
                className={`seg-btn ${mode === 'mask' ? 'is-active' : ''}`}
                type="button"
                onClick={() => setInputMode('mask')}
              >
                {t('input.netmask')}
              </button>
            </div>
          </div>

          {mode === 'cidr' ? (
            <div className="segmented-field">
              <span className="segmented-label">{t('input.cidrBit')}</span>
              <div className="cidr-input-row">
                <span className="cidr-slash">/</span>
                <input
                  aria-label={t('input.cidrBit')}
                  className="octet-input cidr-single"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="24"
                  value={cidr}
                  onBlur={() => setCidr((current) => clampCidr(current))}
                  onChange={(event) => {
                    const numericValue = event.target.value.replace(/\D/g, '').slice(0, 2)
                    setCidr(clampCidr(numericValue))
                  }}
                />
                <button
                  aria-label={t('input.clearCidr')}
                  className="clear-btn"
                  type="button"
                  onClick={() => setCidr('')}
                >
                  <EraserIcon />
                </button>
              </div>
            </div>
          ) : (
            <Ipv4OctetInput
              idPrefix="mask"
              label={t('input.netmask')}
              value={maskOctets}
              onChange={setMaskOctets}
            />
          )}

          <div className="preset-wrapper">
            <label className="segmented-label" htmlFor="cidr-preset">
              {t('input.commonPresets')}
            </label>
            <select
              className="preset-select"
              id="cidr-preset"
              value=""
              onChange={handlePresetChange}
            >
              <option value="" disabled>{t('input.selectPreset')}</option>
              {PRESETS.map((p) => (
                <option key={p.cidr} value={p.cidr}>
                  {mode === 'cidr' ? `/${p.cidr}` : p.mask}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <Button className="calculate-btn" color="primary" disableRipple type="submit">
              {t('input.calculate')}
            </Button>
            <button
              aria-label={copied ? t('input.copied') : t('input.copyInput')}
              className={`copy-btn ${copied ? 'is-copied' : ''}`}
              title={copied ? t('input.copied') : t('input.copyInput')}
              type="button"
              onClick={handleCopy}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
