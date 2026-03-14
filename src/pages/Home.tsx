import { Card, CardBody } from '@heroui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ErrorMessage from '../components/ErrorMessage'
import IpInput from '../components/IpInput'
import PrivateRangesTable from '../components/PrivateRangesTable'
import ResultTable from '../components/ResultTable'
import type { NetworkResult } from '../types/network'

interface HomeProps {
  onOpenHelp: () => void
}

export default function Home({ onOpenHelp }: HomeProps) {
  const { t } = useTranslation()
  const [result, setResult] = useState<NetworkResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <main className="app-shell">
      <header className="app-hero">
        <p className="app-kicker">{t('hero.kicker')}</p>
        <h1>{t('hero.title')}</h1>
        <p className="app-subtitle">{t('hero.subtitle')}</p>
      </header>

      <div className="app-columns">
        <div className="input-column">
          <IpInput onCalculated={setResult} onError={setError} onOpenHelp={onOpenHelp} />
          <ErrorMessage message={error} />
        </div>

        {result ? (
          <ResultTable result={result} />
        ) : (
          <Card className="panel-card">
            <CardBody className="hint-body card-body-padded">
              <p className="hint-title">{t('result.hint.title')}</p>
              <p className="hint-description">{t('result.hint.description')}</p>
              <div className="hint-examples">
                <code>{t('result.hint.example1')}</code>
                <code>{t('result.hint.example2')}</code>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <PrivateRangesTable />
    </main>
  )
}
