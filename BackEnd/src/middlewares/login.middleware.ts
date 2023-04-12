import express, { Express } from "express"
import cors from "cors"

const Middleware = (app: Express): void => {
  /**
   * Allows server using json formating & unlock cors policy
   */
  app.use(express.json())
  app.use(cors({ origin: '*' }))
}

export default Middleware