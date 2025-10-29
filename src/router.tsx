import "@/assets/styles/app.scss";

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { configurationI18n, ROUTES } from '@/config'
import { Provider } from 'react-redux'
import { AnalyticsManager } from './modules/shared/analytics'
import store from './modules/redux/store'
import { AppProvider } from './modules/shared/context/app-provider'
import { HomeScreen, DashboardScreen } from './modules/screens'
 
AnalyticsManager.init()
i18next.use(initReactI18next).init(configurationI18n)
 
const DashboardRouter = () => (
  <BrowserRouter basename="/">
    <AppProvider>
      <Provider store={store}>
        <Routes>
          {/* main home route */}
          <Route path="/" element={<HomeScreen />} />
          {/* dashboard and detail routes */}
          <Route path={ROUTES.dashboard} element={<DashboardScreen />} />
          <Route path={ROUTES.detail} element={<HomeScreen />} />
          {/* fallback -> go home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Provider>
    </AppProvider>
  </BrowserRouter>
)
 
export default DashboardRouter