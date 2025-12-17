import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_EXTERNAL_URL } from '@/config/envs'
import { ReducerPathEnum } from '../constants/reducer-path.constants'
import { TagsEnum } from '../constants/tags-types.constants'

/** Final, normalized external API base (no trailing slash) */
const API_BASE =
  (API_EXTERNAL_URL || 'https://kasnet-api-dev.azurewebsites.net').replace(/\/+$/, '')

export type SummaryResp = {
  total_transactions: { value: number; growth: number | null }
  favorite_operation: string
  peak_hour: { value: number; growth: number | null }
}

export type TimeseriesItem = {
  date: string
  transactions: number
  total_amount?: number
}

export type GroupByItem = {
  entity?: string
  channel?: string
  operation?: string
  transactions: number
  total_amount: number
}

export type SummaryArgs = { terminal_id: string; start: string; end: string }
export type TimeseriesArgs = SummaryArgs
export type GroupByArgs = SummaryArgs & { dimension: 'entity' | 'channel' | 'operation' }

export type HourlyDistributionItem = {
  hour: number
  transactions: number
  total_amount?: number
}
export type HourlyDistributionArgs = SummaryArgs

export type TerminalId = number | string;

export const emptyApi = createApi({
  // Keep your existing enum so other parts don’t break
  reducerPath: ReducerPathEnum.authBffApi,
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    // IMPORTANT: do not add custom headers unless truly needed,
    // to keep this as a CORS "simple request" in the browser.
    prepareHeaders: (headers) => {
      headers.delete('Aws-X-Authorization')
      headers.delete('Aws-X-Source')
      headers.delete('Authorization') // remove if you don’t need cookie/Authorization based auth
      return headers
    },
  }),
  tagTypes: [TagsEnum.AppTag],
  endpoints: (builder) => ({
    // List terminals, pick one terminal_id in the component
    getTerminals: builder.query<TerminalId[], void>({
      query: () => `/analytics/terminals`,
      providesTags: () => [{ type: TagsEnum.AppTag as never, id: 'terminals' }],
    }),

    getSummary: builder.query<SummaryResp, SummaryArgs>({
      query: ({ terminal_id, start, end }) =>
        `/analytics/summary?terminal_id=${encodeURIComponent(
          terminal_id
        )}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      providesTags: () => [{ type: TagsEnum.AppTag as never, id: 'summary' }],
    }),

    getTimeseries: builder.query<TimeseriesItem[], TimeseriesArgs>({
      query: ({ terminal_id, start, end }) =>
        `/analytics/timeseries?terminal_id=${encodeURIComponent(
          terminal_id
        )}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      providesTags: () => [{ type: TagsEnum.AppTag as never, id: 'timeseries' }],
    }),

    getGroupBy: builder.query<GroupByItem[], GroupByArgs>({
      query: ({ terminal_id, dimension, start, end }) =>
        `/analytics/group-by?dimension=${encodeURIComponent(
          dimension
        )}&terminal_id=${encodeURIComponent(
          terminal_id
        )}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      providesTags: (_r, _e, a) => [
        { type: TagsEnum.AppTag as never, id: `groupby-${a.dimension}` },
      ],
    }),

    getHourlyDistribution: builder.query<HourlyDistributionItem[], HourlyDistributionArgs>({
      query: ({ terminal_id, start, end }) =>
        `/analytics/hourly-distribution?terminal_id=${encodeURIComponent(
          terminal_id
        )}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      providesTags: () => [{ type: TagsEnum.AppTag as never, id: 'hourly-distribution' }],
    }),
  }),
})

export const {
  useGetTerminalsQuery,
  useGetSummaryQuery,
  useGetTimeseriesQuery,
  useGetGroupByQuery,
  useGetHourlyDistributionQuery,
} = emptyApi
