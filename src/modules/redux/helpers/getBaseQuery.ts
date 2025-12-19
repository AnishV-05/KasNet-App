import { KASNET_APPNAME } from '@/config/envs'
import { clearUserSession } from '@/modules/shared/storage/user-session'
import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

/** Environment-based external API endpoint */
const VITE_API_EXTERNAL_URL =
  process.env.VITE_API_EXTERNAL_URL?.replace(/\/+$/, '') 

/** Local session helper */
const readSession = (): any => {
  try {
    const raw = localStorage.getItem('user-session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Base query (uses FULL absolute URL -> fixes Vercel issue)
 */
const baseQuery = fetchBaseQuery({
  baseUrl: VITE_API_EXTERNAL_URL,
  prepareHeaders: (headers) => {
    const session = readSession();
    const idToken: string | undefined =
      session?.idToken && typeof session.idToken === 'string' && session.idToken.trim().length > 0
        ? session.idToken
        : undefined;

    if (idToken) {
      // Only add auth headers when token exists — avoids CORS preflight problems
      headers.set('aws-x-authorization', idToken);
      headers.set('aws-x-source', KASNET_APPNAME);
    } else {
      headers.delete('aws-x-authorization');
      headers.delete('aws-x-source');
      headers.delete('Authorization');
    }

    return headers;
  },
});

/**
 * Exported base query wrapper (handles logout on 401/403)
 */
export const getBaseQuery: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  try {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      clearUserSession();
      window.location.href = '/auth/login';
    }

    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};
