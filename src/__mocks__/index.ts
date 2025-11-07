const IS_BROWSER = typeof window !== 'undefined'
const USE_MSW = (import.meta as any).env?.VITE_USE_MSW === 'false'

export const setupMocks = async () => {
  if (!USE_MSW) return // <-- do nothing if mocks are off

  if (IS_BROWSER) {
    const { mswWorker } = await import('./mswWorker')
    await mswWorker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' }, // optional, explicit path
    })
  } else {
    const { mswServer } = await import('./mswServer')
    mswServer.listen({ onUnhandledRequest: 'bypass' })
  }
}
