import '@/assets/styles/app.scss'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { configurationI18n } from './config'
import { AnalyticsManager } from './modules/shared/analytics'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './modules/shared/context/app-provider'
import { Provider } from 'react-redux'
import store from './modules/redux/store'
import { HomeScreen } from './modules/screens'

AnalyticsManager.init()
i18next.use(initReactI18next).init(configurationI18n)

export const App = () => {
  return (
    <BrowserRouter basename="/">
      <AppProvider>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </Provider>
      </AppProvider>
    </BrowserRouter>
  )
}
