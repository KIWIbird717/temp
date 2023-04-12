import express, { Express } from 'express';
import registerRoutes from "./utils/express/registerRoutes";
import Middleware from './middlewares/login.middleware';

import dotenv from 'dotenv';
import path from "path";

dotenv.config();


const app: Express = express();

const ServerInitPoint = async (): Promise<void> => {
  try {
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

ServerInitPoint().catch((err: any) => {
  console.error(err)
  process.exit(1)
})