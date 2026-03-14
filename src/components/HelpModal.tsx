import { useTranslation } from 'react-i18next'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const STEP_ICONS = ['①', '②', '③', '④', '⑤', '⑥']

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { t } = useTranslation()
  const steps = t('help.steps', { returnObjects: true }) as Array<{ title: string; description: string }>

  if (!isOpen) return null

  return (
    <div className="help-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="help-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <span className="help-modal-title">{t('help.title')}</span>
          <button className="help-close-x" type="button" aria-label={t('help.close')} onClick={onClose}>✕</button>
        </div>
        <div className="help-modal-body">
          <ol className="help-steps">
            {steps.map((step, i) => (
              <li className="help-step" key={i}>
                <div className="help-step-icon">{STEP_ICONS[i]}</div>
                <div className="help-step-content">
                  <p className="help-step-title">{step.title}</p>
                  <p className="help-step-description">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="help-modal-footer">
          <button className="help-close-btn" type="button" onClick={onClose}>
            {t('help.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
