import express, { Express, Request, Response } from 'express';
import registerRoutes from "./utils/express/registerRoutes";
import Middleware from './middlewares/login.middleware';
import { dbConnection, dbDisconnection } from './servises/MongoDB/mongoDb.servise';

import dotenv from 'dotenv';
import path from "path";

dotenv.config();


const app: Express = express();

const ServerInitPoint = async (): Promise<void> => {
  try {
    /**
     * Connect to MongoDB
     * @todo need to change DB_URL in .env in order to `dbConnection()` start work. Function already done 
     */
    await dbConnection()

    // Middlewares
    Middleware(app)

    // Start server
    app.listen(process.env.PORT as string, () => {
      console.log("\x1b[36m", `[SERVER]: Running at ${process.env.URL}`);
    });
    
    // Auto-routing system
    const pagesPath: string = path.join(__dirname, "routes");
    registerRoutes(app, pagesPath, "/", () => {
      console.log("\x1b[36m", "[SERVER]: Pages loaded")
    });
  } catch(err) {
    throw err
  }
}

ServerInitPoint().catch( async (err: any) => {
  // Disconnect from MongoDB
  await dbDisconnection()
  console.error(err)
  process.exit(1)
})
