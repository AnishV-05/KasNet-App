import ReactDOM from 'react-dom/client'

import { App } from './app'
import { API_MOCKING } from './config'

async function main() {
  if (API_MOCKING === 'true') {
    const { setupMocks } = await import('@/__mocks__/index')
    await setupMocks()
  }
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

  root.render(<App />)
}
main()
