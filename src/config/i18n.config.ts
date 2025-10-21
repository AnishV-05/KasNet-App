import { InitOptions } from 'i18next'

import translationGeneralES from '@/locales/es/general.i18n.json'

const DEFAULT_LANGUAGE = 'es'

const configurationI18n: InitOptions = {
  fallbackLng: [DEFAULT_LANGUAGE],
  interpolation: {
    escapeValue: false,
  },
  lng: DEFAULT_LANGUAGE,
  resources: {
    es: {
      translation: translationGeneralES,
    },
  },
}

export { configurationI18n }
