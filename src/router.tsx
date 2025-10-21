import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { configurationI18n, ROUTES } from '@/config'
import { Provider } from 'react-redux'
import { AnalyticsManager } from './modules/shared/analytics'
import store from './modules/redux/store'
import { AppProvider } from './modules/shared/context/app-provider'
import { HomeScreen } from './modules/screens'

AnalyticsManager.init()
i18next.use(initReactI18next).init(configurationI18n)

const DashboardRouter = () => (
  <AppProvider>
    <Provider store={store}>
      <Routes>
        <Route path={`${ROUTES.detail}`} element={<HomeScreen />} /> 
      </Routes>
    </Provider>
  </AppProvider>
)

export default DashboardRouter
