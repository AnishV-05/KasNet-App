import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { demoSliceReducer } from '@/modules/redux/slices/demo.slice'

import { emptyApi as externalBffApi } from './api/externalBffApi.empty-api'
import { ReducerPathEnum } from './constants/reducer-path.constants'

const reducers = combineReducers({
  [ReducerPathEnum.agentBffApi]: externalBffApi.reducer,
  [ReducerPathEnum.demoSlice]: demoSliceReducer,
})

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(externalBffApi.middleware as any),
  reducer: reducers,
})

export type RootStoreState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)

export default store
