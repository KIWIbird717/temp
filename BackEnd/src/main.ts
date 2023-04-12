import express, { Express } from 'express';
import registerRoutes from "./utils/express/registerRoutes";
import Middleware from './middlewares/login.middleware';
import { dbConnection, dbDisconnection } from './servises/mongoDb.servise';

import dotenv from 'dotenv';
import path from "path";

dotenv.config();


const app: Express = express();

const ServerInitPoint = async (): Promise<void> => {
  try {
    // Connect to MongoDB (Currently unavailable, customer did not create one)
    // await dbConnection()

    // Start server
    app.listen(process.env.PORT, () => {
      console.log(`[SERVER]: Running at http://localhost:${process.env.PORT}`);
    });

    // Middlewares
    Middleware(app)
    
    // Auto-routing system
    const pagesPath: string = path.join(__dirname, "pages");
    registerRoutes(app, pagesPath, "/", () => {
      console.log("[SERVER]: Pages loaded")
    });

  } catch(err) {
    throw err
  }
}

ServerInitPoint().catch( async (err: any) => {
  // Disconnect from MongoDB (Currently unavailable, customer did not create one)
  // await dbDisconnection()
  console.error(err)
  process.exit(1)
})