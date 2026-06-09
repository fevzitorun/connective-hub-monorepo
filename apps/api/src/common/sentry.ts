import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export function initSentry() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    release: process.env.npm_package_version,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    profilesSampleRate: 0.1,
    // PII verilerini otomatik gizle
    beforeSend(event) {
      if (event.request?.data) {
        const data = event.request.data as Record<string, unknown>
        if (data.password)  data.password = '[Filtered]'
        if (data.token)     data.token    = '[Filtered]'
        if (data.tcKimlik)  data.tcKimlik = '[Filtered]'
      }
      return event
    },
  })
}

export function captureException(err: unknown, context?: Record<string, unknown>) {
  if (!process.env.SENTRY_DSN) return
  Sentry.withScope((scope) => {
    if (context) scope.setExtras(context)
    Sentry.captureException(err)
  })
}
