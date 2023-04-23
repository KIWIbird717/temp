import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAppState } from "./types"

const initialState: IAppState = {
  appPage: '1',
  accountsManagerFolder: null
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    /**
     * Need to set current Application page
     * Set pages in `SiderComponent`
     * 
     * @param '1' | '2' | '3' | '4' | '5' | '6'
     */
    setAppPage: (state, action: PayloadAction<IAppState["appPage"]>) => {
      state.appPage = action.payload
    },
    setAccountsManagerFolder: (state, action: PayloadAction<IAppState["accountsManagerFolder"]>) => {
      state.accountsManagerFolder = action.payload
    }
  }
})

export const {
  setAppPage,
  setAccountsManagerFolder
} = appSlice.actions
export default appSlice.reducer