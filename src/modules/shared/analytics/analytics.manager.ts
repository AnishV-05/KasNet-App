import amplitude, { AmplitudeClient } from 'amplitude-js'

import { ANALYTICS_API_KEY } from '@/config'

import { AnalyticsUserInfo } from './analytics.codes'

const amplitudeInstance: AmplitudeClient = amplitude.getInstance()

export interface AnalyticsProfile {
  country: string
  email: string
  lastName: string
  name: string
  network: string
  osName: string
  osVersion: string
  platform: string
}
export class AnalyticsManager {
  static init(): void {
    amplitudeInstance.init(ANALYTICS_API_KEY || '')
  }

  /**
   * Method to assign the Analytics ID
   * @param username Represent the username the application (patient code)
   *
   * Example:
   *    - AnalyticsManager.id('1000');
   */
  static id(username: string): void {
    // cuando se hace un login , // cuando se abre la aplicacion y esta logueado
    amplitudeInstance.setUserId(username)
  }

  /**
   * Method to assign the profile the Analytics Identity
   * @param profile The info the user profile
   */
  static user(profile: AnalyticsProfile): void {
    // TODO: Considerar los datos a capturar en el perfil de usuario y evaluar si tendrá sentido tenerlo aquí o en cada microfront

    // cuando se hace un login, abre la aplicacion y esta logueado
    const properties = {
      [AnalyticsUserInfo.COUNTRY]: profile.country,
      [AnalyticsUserInfo.EMAIL]: profile.email,
      [AnalyticsUserInfo.NETWORK]: profile.network,
      [AnalyticsUserInfo.OPERATING_SYSTEM]: profile.osName,
      [AnalyticsUserInfo.OS_VERSION]: profile.osVersion,
      [AnalyticsUserInfo.PLATFORM]: profile.platform,
      [AnalyticsUserInfo.USER_LAST_NAME]: profile.lastName,
      [AnalyticsUserInfo.USER_NAME]: profile.name,
    }

    amplitudeInstance.setUserProperties(properties)
  }

  /**
   * Mehtod to assing new property into the object identity
   * @param code User Property the session web or app
   * @param value represent the value to identify the property
   *
   * The properties that can be set are:
   * - NUMBER_SESSIONS
   * - NUMBER_SCHEDULES
   * - LAST_APPOINTMENT
   * - LAST_SEENDATE
   *
   * Examples:
   *    - AnalyticsManager.userProperty(AnalyticsUserInfo.NUMBER_SESSIONS, 10);
   *    - AnalyticsManager.userProperty(AnalyticsUserInfo.LAST_APPOINTMENT, '2020-10-10 14:15:20');
   */
  static userProperty(code: AnalyticsUserInfo, value: string | number): void {
    const identity = new amplitudeInstance.Identify().set(code.toString(), value)

    amplitudeInstance.identify(identity)
  }

  /**
   * Method to create new log event
   * @param code Event code to identity an event
   * @param data Represent an JSON Value
   *
   * Examples:
   *    - AnalyticsManager.event(AnalyticsEvents.LOGIN);
   *    - AnalyticsManager.event(AnalyticsEvents.PAYMENT_ERROR, { detalleerror: '<error message>' })
   */
  static event(code: string, data?: { [key: string]: unknown }): void {
    amplitudeInstance.logEvent(code.toString(), data)
  }
}
