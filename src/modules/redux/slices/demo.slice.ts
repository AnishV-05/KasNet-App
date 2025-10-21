import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { ReducerPathEnum } from '@/modules/redux/constants/reducer-path.constants'

export type DemoData = {
  name: string
}

export enum CountryEnum {
  PE = 'PE',
}

interface FormState {
  country: CountryEnum
  data?: DemoData
}

const initialState: FormState = {
  country: CountryEnum.PE,
  data: undefined,
}

const demoSlice = createSlice({
  initialState,
  name: ReducerPathEnum.demoSlice,
  reducers: {
    setCountry: (state, action: PayloadAction<CountryEnum>) => {
      state.country = action.payload
    },
    setData: (state, action: PayloadAction<DemoData | undefined>) => {
      state.data = action.payload
    },
  },
})

export const { setCountry, setData } = demoSlice.actions

export const { reducer: demoSliceReducer } = demoSlice
