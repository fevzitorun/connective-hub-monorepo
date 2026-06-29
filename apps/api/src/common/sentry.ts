let Sentry: typeof import('@sentry/node') | null = null

async function loadSentry() {
  if (Sentry) return Sentry
  try {
    Sentry = await import('@sentry/node')
  } catch {
    Sentry = null
  }
  return Sentry
}

export async function initSentry() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return

  const sentry = await loadSentry()
  if (!sentry) return

  let integrations: unknown[] = []
  try {
    const { nodeProfilingIntegration } = await import('@sentry/profiling-node')
    integrations = [nodeProfilingIntegration()]
  } catch {
    // profiling not available
  }

  sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    release: process.env.npm_package_version,
    integrations: integrations as Parameters<typeof sentry.init>[0]['integrations'],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    profilesSampleRate: 0.1,
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

export async function captureException(err: unknown, context?: Record<string, unknown>) {
  if (!process.env.SENTRY_DSN) return
  const sentry = await loadSentry()
  if (!sentry) return
  sentry.withScope((scope) => {
    if (context) scope.setExtras(context)
    sentry.captureException(err)
  })
}
