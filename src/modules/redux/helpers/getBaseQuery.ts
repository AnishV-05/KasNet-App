import { KASNET_APPNAME } from '@/config/envs'
import { clearUserSession } from '@/modules/shared/storage/user-session'
import { BaseQueryApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query'

const baseQuery = ({ endpoint = '' }: BaseQueryApi): BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> =>
  fetchBaseQuery({
    baseUrl: endpoint,
    prepareHeaders: async headers => {
      const jsonSession = localStorage.getItem('user-session')
      const session = JSON.parse(jsonSession ?? '{}')
      if (session) {
        // headers.set('Authorization', `Bearer ${session.accessToken}`)
        headers.set('aws-x-authorization', session.idToken)
        headers.set('aws-x-source', KASNET_APPNAME)
      }
      return headers
    },
  })

export const getBaseQuery: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  try {
    const result = await baseQuery(api)(args, api, extraOptions)
    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      clearUserSession()
      window.location.href = '/auth/login'
      // await refreshToken({apiUrlBase: AUTH_API_URL});
      // result = await baseQuery(api)(args, api, extraOptions);
    }
    return result
  } catch (error) {
    // EventBus.publish(AliasEventBus.Logout, {});
    return Promise.reject(error)
  }
}
