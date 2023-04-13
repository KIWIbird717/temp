import express, { Express } from 'express';
import registerRoutes from "./utils/express/registerRoutes";
import Middleware from './middlewares/login.middleware';
import { dbConnection, dbDisconnection } from './servises/MongoDB/mongoDb.servise';

import dotenv from 'dotenv';
import path from "path";

dotenv.config();


const app: Express = express();

const ServerInitPoint = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    /**
     * Connect to MongoDB (Currently unavailable, customer did not create one)
     * @todo need to change DB_URL in .env in order to `dbConnection()` start work. Function already done 
     * 
     * After that uncomment the line below and `dbDisconnection()` in the end of the file
     */
    // await dbConnection()

    // Start server
    app.listen(process.env.PORT, () => {
      console.log("\x1b[36m", `[SERVER]: Running at http://localhost:${process.env.PORT}`);
    });

    // Middlewares
    Middleware(app)

    
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
  // Disconnect from MongoDB (Currently unavailable, customer did not create one)
  // await dbDisconnection()
  console.error(err)
  process.exit(1)
})
