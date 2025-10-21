import { createApi } from '@reduxjs/toolkit/query/react'

import { API_EXTERNAL_URL } from '@/config/envs'

import { ReducerPathEnum } from '../constants/reducer-path.constants'
import { getBaseQuery } from '../helpers/getBaseQuery'
import { TagsEnum } from '../constants/tags-types.constants'

export const emptyApi = createApi({
  baseQuery: (args, api, extraOptions) => getBaseQuery(args, { ...api, endpoint: API_EXTERNAL_URL }, extraOptions),
  endpoints: () => ({}),
  reducerPath: ReducerPathEnum.authBffApi,
  tagTypes: [TagsEnum.AppTag],
})
