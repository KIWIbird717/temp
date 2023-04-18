import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUserState } from "./types"

const initialState: IUserState = {
  mail: null,
  id: null,
  isUserLogined: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserMail: (state, action: PayloadAction<string>) => {
      state.mail = action.payload
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.id = action.payload
    },
    setUserIsLogined: (state, action: PayloadAction<boolean>) => {
      state.isUserLogined = action.payload
    }
  }
})

export const {
  setUserMail,
  setUserId,
  setUserIsLogined,
} = userSlice.actions
export default userSlice.reducer