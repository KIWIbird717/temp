import express, { Express } from "express"
import cors from "cors"

/**
 * Allows server using `json` formating & unlocks `cors` policy
 * 
 * @description
 * You can add more aditional settings to `Middleware`
 * 
 * @todo
 * Do not foget to remove `cors` policy by `release`
 */
const Middleware = (app: Express): void => {
  app.use(express.json())
  app.use(cors({ origin: '*' }))    // Do not foget to remove by release
}

export default Middleware