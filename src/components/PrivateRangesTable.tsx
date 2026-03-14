import { Card, CardBody } from '@heroui/react'
import { useTranslation } from 'react-i18next'

const PRIVATE_RANGES = [
  { class: 'Class A', start: '10.0.0.0',    end: '10.255.255.255',  mask: '255.0.0.0' },
  { class: 'Class B', start: '172.16.0.0',  end: '172.31.255.255',  mask: '255.255.0.0' },
  { class: 'Class C', start: '192.168.0.0', end: '192.168.255.255', mask: '255.255.255.0' },
]

export default function PrivateRangesTable() {
  const { t } = useTranslation()

  return (
    <Card className="panel-card">
      <CardBody className="card-body-padded">
        <p className="ranges-section-label">{t('ranges.title')}</p>
        <table aria-label={t('ranges.ariaLabel')} className="ranges-table">
          <thead>
            <tr>
              <th> </th>
              <th>{t('ranges.colStart')}</th>
              <th>{t('ranges.colEnd')}</th>
              <th>{t('ranges.colMask')}</th>
            </tr>
          </thead>
          <tbody>
            {PRIVATE_RANGES.map((row) => (
              <tr key={row.class}>
                <td>{row.class}</td>
                <td className="ranges-ip">{row.start}</td>
                <td className="ranges-ip">{row.end}</td>
                <td className="ranges-mask">{row.mask}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  )
}
