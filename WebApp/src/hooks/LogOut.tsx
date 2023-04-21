import { setUserIsLogined, setUserMail } from '../store/userSlice'
import { AnyAction, Dispatch } from '@reduxjs/toolkit'

/**
 * Log out user
 */
export const LogOut = (dispatch: Dispatch<AnyAction>) => {
  return (
    dispatch(setUserMail('')),
    dispatch(setUserIsLogined(false)),
    localStorage.setItem('sessionToken', '')
  )
}
