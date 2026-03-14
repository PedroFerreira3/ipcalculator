import { useState } from 'react'
import { Card, CardBody } from '@heroui/react'
import { useTranslation } from 'react-i18next'

import type { NetworkResult } from '../types/network'
import { ipToBinaryOctets } from '../utils/ipHelpers'

interface ResultTableProps {
  result: NetworkResult
}

type ResultTab = 'decimal' | 'binary'

const IP_FIELDS = [
  { tKey: 'result.fields.address',   key: 'address'   },
  { tKey: 'result.fields.netmask',   key: 'netmask'   },
  { tKey: 'result.fields.network',   key: 'network'   },
  { tKey: 'result.fields.broadcast', key: 'broadcast' },
  { tKey: 'result.fields.hostMin',   key: 'hostMin'   },
  { tKey: 'result.fields.hostMax',   key: 'hostMax'   },
  { tKey: 'result.fields.wildcard',  key: 'wildcard'  },
] as const

function CopyIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="13" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24" width="13" xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="13" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
      viewBox="0 0 24 24" width="13" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function classBadgeVariant(networkClass: string): string {
  if (networkClass.startsWith('Class A')) return 'badge-a'
  if (networkClass.startsWith('Class B')) return 'badge-b'
  if (networkClass.startsWith('Class C')) return 'badge-c'
  if (networkClass.startsWith('Class D')) return 'badge-d'
  if (networkClass.startsWith('Class E')) return 'badge-e'
  return 'badge-special'
}

export default function ResultTable({ result }: ResultTableProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<ResultTab>('decimal')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    } catch {
      // clipboard unavailable
    }
  }

  const copyAll = async () => {
    const lines = activeTab === 'binary'
      ? IP_FIELDS.map(({ tKey, key }) => `${t(tKey).padEnd(12)}${ipToBinaryOctets(result[key])}`)
      : IP_FIELDS.map(({ tKey, key }) => `${t(tKey).padEnd(12)}${result[key]}`)
    lines.push(`${t('result.fields.hostsPerNet').padEnd(12)}${result.hostsPerNet.toLocaleString()}`)
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1500)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <Card className="panel-card">
      <CardBody className="card-body-padded">
        <div className="result-top-row">
          <div className="result-top-left">
            <p className="result-card-header">{t('result.title')}</p>
            <button
              aria-label={copiedAll ? t('result.copied') : t('result.copyAll')}
              className={`result-copy-all-btn ${copiedAll ? 'is-copied' : ''}`}
              title={copiedAll ? t('result.copied') : t('result.copyAll')}
              type="button"
              onClick={copyAll}
            >
              {copiedAll ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <span className={`network-class-badge ${classBadgeVariant(result.networkClass)}`}>
            {result.networkClass}
          </span>
        </div>

        <div className="seg-bar seg-bar--spaced" role="tablist">
          <button
            aria-selected={activeTab === 'decimal'}
            className={`seg-btn ${activeTab === 'decimal' ? 'is-active' : ''}`}
            role="tab"
            type="button"
            onClick={() => setActiveTab('decimal')}
          >
            {t('result.decimal')}
          </button>
          <button
            aria-selected={activeTab === 'binary'}
            className={`seg-btn ${activeTab === 'binary' ? 'is-active' : ''}`}
            role="tab"
            type="button"
            onClick={() => setActiveTab('binary')}
          >
            {t('result.binary')}
          </button>
        </div>

        {/* Both panels are always rendered and stacked in the same grid cell.
            The inactive one stays invisible but preserves its height, so the
            card never shrinks when switching tabs. */}
        <div className="result-tab-panels">
          <div
            aria-hidden={activeTab !== 'decimal'}
            className={`result-tab-panel ${activeTab === 'decimal' ? 'is-active' : ''}`}
          >
            <div className="result-grid">
              {IP_FIELDS.map(({ tKey, key }) => (
                <div className="result-item" key={key}>
                  <span className="result-item-label">{t(tKey)}</span>
                  <div className="result-item-value-row">
                    <span className="result-item-value">{result[key]}</span>
                    <button
                      aria-label={`Copy ${t(tKey)}`}
                      className={`result-copy-btn ${copiedKey === key ? 'is-copied' : ''}`}
                      type="button"
                      onClick={() => copyValue(key, result[key])}
                    >
                      {copiedKey === key ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="result-item">
                <span className="result-item-label">{t('result.fields.hostsPerNet')}</span>
                <div className="result-item-value-row">
                  <span className="result-item-value">{result.hostsPerNet.toLocaleString()}</span>
                  <button
                    aria-label={`Copy ${t('result.fields.hostsPerNet')}`}
                    className={`result-copy-btn ${copiedKey === 'hostsPerNet' ? 'is-copied' : ''}`}
                    type="button"
                    onClick={() => copyValue('hostsPerNet', result.hostsPerNet.toLocaleString())}
                  >
                    {copiedKey === 'hostsPerNet' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden={activeTab !== 'binary'}
            className={`result-tab-panel ${activeTab === 'binary' ? 'is-active' : ''}`}
          >
            <div className="binary-list">
              {IP_FIELDS.map(({ tKey, key }) => {
                const binVal = ipToBinaryOctets(result[key])
                const binKey = `bin-${key}`
                return (
                  <div className="binary-row" key={key}>
                    <span className="binary-label">{t(tKey)}</span>
                    <span className="binary-value">{binVal}</span>
                    <button
                      aria-label={`Copy ${t(tKey)} binary`}
                      className={`result-copy-btn ${copiedKey === binKey ? 'is-copied' : ''}`}
                      type="button"
                      onClick={() => copyValue(binKey, binVal)}
                    >
                      {copiedKey === binKey ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                )
              })}
              <div className="binary-row">
                <span className="binary-label">{t('result.fields.hostsPerNet')}</span>
                <span className="binary-value binary-value--decimal">
                  {result.hostsPerNet.toLocaleString()}
                </span>
                <button
                  aria-label={`Copy ${t('result.fields.hostsPerNet')}`}
                  className={`result-copy-btn ${copiedKey === 'bin-hostsPerNet' ? 'is-copied' : ''}`}
                  type="button"
                  onClick={() => copyValue('bin-hostsPerNet', result.hostsPerNet.toLocaleString())}
                >
                  {copiedKey === 'bin-hostsPerNet' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
