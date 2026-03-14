import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'

import { clampOctet } from '../utils/ipHelpers'
import EraserIcon from './EraserIcon'

interface Ipv4OctetInputProps {
  idPrefix: string
  label: string
  value: string[]
  onChange: (nextValue: string[]) => void
}

const OCTET_COUNT = 4
const EMPTY_OCTETS = ['', '', '', '']

function sanitizeOctet(rawValue: string): string {
  return rawValue.replace(/\D/g, '').slice(0, 3)
}

function setOctetAt(value: string[], index: number, octet: string): string[] {
  const nextValue = [...value]
  nextValue[index] = octet
  return nextValue
}

export default function Ipv4OctetInput({
  idPrefix,
  label,
  value,
  onChange,
}: Ipv4OctetInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (index: number, rawValue: string) => {
    const octet = clampOctet(sanitizeOctet(rawValue))
    onChange(setOctetAt(value, index, octet))

    if (octet.length === 3 && index < OCTET_COUNT - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleBlur = (index: number) => {
    const current = value[index]
    if (!current) return
    const normalized = clampOctet(current)
    if (normalized !== current) {
      onChange(setOctetAt(value, index, normalized))
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && value[index] === '' && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData.getData('text').trim()
    const octets = pastedText.split('.')

    if (octets.length !== OCTET_COUNT || !octets.every((part) => /^\d{1,3}$/.test(part))) {
      return
    }

    event.preventDefault()
    onChange(octets.map(clampOctet))
    refs.current[OCTET_COUNT - 1]?.focus()
  }

  const handleClear = () => {
    onChange(EMPTY_OCTETS)
    refs.current[0]?.focus()
  }

  return (
    <div className="segmented-field">
      <span className="segmented-label">{label}</span>
      <div className="octet-row">
        {Array.from({ length: OCTET_COUNT }, (_, index) => (
          <div className="octet-cell" key={`${idPrefix}-${index}`}>
            <input
              aria-label={`${label} octet ${index + 1}`}
              className="octet-input"
              id={`${idPrefix}-${index}`}
              inputMode="numeric"
              maxLength={3}
              pattern="[0-9]*"
              placeholder="0"
              ref={(node) => { refs.current[index] = node }}
              type="text"
              value={value[index] ?? ''}
              onBlur={() => handleBlur(index)}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={handlePaste}
            />
            {index < OCTET_COUNT - 1 ? <span className="dot-separator">.</span> : null}
          </div>
        ))}
        <button
          aria-label={`Clear ${label}`}
          className="clear-btn"
          type="button"
          onClick={handleClear}
        >
          <EraserIcon />
        </button>
      </div>
    </div>
  )
}
