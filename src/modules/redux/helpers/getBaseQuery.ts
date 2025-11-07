import { KASNET_APPNAME } from '@/config/envs'
import { clearUserSession } from '@/modules/shared/storage/user-session'
import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

/** Safely parse JSON from localStorage */
const readSession = (): any => {
  try {
    const raw = localStorage.getItem('user-session')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * NOTE:
 * - Do NOT set custom headers when token is missing.
 *   Custom headers trigger a CORS preflight (OPTIONS) and your backend returns 405 for OPTIONS.
 * - If you actually need auth later, ensure backend handles CORS/OPTIONS, then enable below.
 */
const baseQuery =
  ({ endpoint = '' }: BaseQueryApi): BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> =>
    fetchBaseQuery({
      baseUrl: endpoint,
      prepareHeaders: async (headers) => {
        const session = readSession()

        const idToken: string | undefined =
          session?.idToken && typeof session.idToken === 'string' && session.idToken.trim().length > 0
            ? session.idToken
            : undefined

        if (idToken) {
          // If your backend expects Authorization, uncomment this and ensure CORS supports it.
          // headers.set('Authorization', `Bearer ${idToken}`)

          // Original custom headers — only set when a token truly exists.
          headers.set('aws-x-authorization', idToken)
          headers.set('aws-x-source', KASNET_APPNAME)
        } else {
          // Ensure nothing leaks as "undefined" (prevents preflight).
          headers.delete('aws-x-authorization')
          headers.delete('aws-x-source')
          headers.delete('Authorization')
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
      // Redirect to login on auth failure
      window.location.href = '/auth/login'
    }

    return result
  } catch (error) {
    // Optional: publish logout / telemetry here
    return Promise.reject(error)
  }
}
