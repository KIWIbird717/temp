import express, { Express, Request, Response } from 'express';
import registerRoutes from "./utils/express/registerRoutes";
import Middleware from './middlewares/login.middleware';
import { dbConnection, dbDisconnection } from './servises/MongoDB/mongoDb.servise';

import dotenv from 'dotenv';
import path from "path";
import CreateNewUser from './servises/RegisterUserDB/addRegisterUser.servise';
import { IRegisterUserSchema, RegisterUserSchema } from './servises/RegisterUserDB/registerUserSchema.servise';

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

    app.post('/registration', async (req: Request, res: Response) => {
      const { mail, password } = req.body
    
      // Check if user already exists
      const existingUser: IRegisterUserSchema | null = await RegisterUserSchema.findOne({$or: [{ mail }]})

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' })
      }

      // adding data about new User to MongoDB
      await CreateNewUser({ mail, password })
      return res.status(201).json({ message: 'User registered successfully' })
    })
    
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
