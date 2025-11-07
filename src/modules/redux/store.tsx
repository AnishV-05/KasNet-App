import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { demoSliceReducer } from '@/modules/redux/slices/demo.slice'
import { emptyApi as externalBffApi } from './api/externalBffApi.empty-api'
import { ReducerPathEnum } from './constants/reducer-path.constants'

const reducers = combineReducers({
  // ✅ register RTK Query reducer using its actual reducerPath
  [externalBffApi.reducerPath]: externalBffApi.reducer,
  [ReducerPathEnum.demoSlice]: demoSliceReducer,
})

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(externalBffApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootStoreState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)

export default store
