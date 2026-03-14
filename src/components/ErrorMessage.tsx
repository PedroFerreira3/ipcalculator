import { Card, CardBody } from '@heroui/react'

interface ErrorMessageProps {
  message: string | null
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null
  }

  return (
    <Card className="error-card">
      <CardBody>
        <p role="alert">{message}</p>
      </CardBody>
    </Card>
  )
}
