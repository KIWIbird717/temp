import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'


export default configureStore({
  reducer: {
    user: userSlice
  },
  /**
   * You cant set up more middlewares
   * Check instruction: @see https://redux-toolkit.js.org/api/serializabilityMiddleware
   */
  middleware: (gDM) => gDM({serializableCheck: false})
})