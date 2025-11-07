import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_EXTERNAL_URL } from '@/config/envs'
import { ReducerPathEnum } from '../constants/reducer-path.constants'
import { TagsEnum } from '../constants/tags-types.constants'

export type SummaryResp = {
  total_transactions: { value: number; growth: number | null }
  favorite_operation: string
  peak_hour: { value: number; growth: number | null }
}
export type TimeseriesItem = { date: string; transactions: number; total_amount?: number }
export type GroupByItem = { entity?: string; channel?: string; operation?: string; transactions: number; total_amount: number }

export type SummaryArgs = { terminal_id: string; start: string; end: string }
export type TimeseriesArgs = SummaryArgs
export type GroupByArgs = SummaryArgs & { dimension: 'entity' | 'channel' | 'operation' }

export const emptyApi = createApi({
  reducerPath: ReducerPathEnum.authBffApi,
  baseQuery: fetchBaseQuery({
    baseUrl: API_EXTERNAL_URL,
    // IMPORTANT: strip ALL custom headers so preflight is not triggered
    prepareHeaders: (headers) => {
      // ensure no leftovers
      headers.delete('Aws-X-Authorization')
      headers.delete('Aws-X-Source')
      headers.delete('Authorization') // if not needed, also remove
      return headers
    },
    // no credentials, no extra params — keep it a "simple request"
  }),
  tagTypes: [TagsEnum.AppTag],
  endpoints: (builder) => ({
    getSummary: builder.query<SummaryResp, SummaryArgs>({
      query: ({ terminal_id, start, end }) =>
        `/analytics/summary?terminal_id=${encodeURIComponent(terminal_id)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      providesTags: () => [{ type: TagsEnum.AppTag as never, id: 'summary' }],
    }),
    getTimeseries: builder.query<TimeseriesItem[], TimeseriesArgs>({
      query: ({ terminal_id, start, end }) =>
        `/analytics/timeseries?terminal_id=${encodeURIComponent(terminal_id)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      providesTags: () => [{ type: TagsEnum.AppTag as never, id: 'timeseries' }],
    }),
    getGroupBy: builder.query<GroupByItem[], GroupByArgs>({
      query: ({ terminal_id, dimension, start, end }) =>
        `/analytics/group-by?dimension=${encodeURIComponent(dimension)}&terminal_id=${encodeURIComponent(terminal_id)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      providesTags: (_r, _e, a) => [{ type: TagsEnum.AppTag as never, id: `groupby-${a.dimension}` }],
    }),
  }),
})

export const {
  useGetSummaryQuery,
  useLazyGetSummaryQuery,
  useGetTimeseriesQuery,
  useLazyGetTimeseriesQuery,
  useGetGroupByQuery,
  useLazyGetGroupByQuery,
} = emptyApi
