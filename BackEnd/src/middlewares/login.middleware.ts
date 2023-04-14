import express, { Express } from "express"
import ErrorHandler from "../utils/express/errorHandler"
import cors from "cors"
import { error } from "console"

/**
 * Allows server using `json` formating & unlocks `cors` policy
 * 
 * @description
 * You can add more aditional settings to `Middleware`
 * 
 * @todo
 * Do not foget to remove `cors` policy by `release`
 * Make working Handler error for express
 */
const Middleware = (app: Express): void => {
  app.use(express.json())
  app.use(cors({ origin: '*' }))    // Do not foget to remove by release
  ErrorHandler(app) // Handler error
}

export default Middleware