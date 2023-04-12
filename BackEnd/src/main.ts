import express, { Express } from 'express';
import registerRoutes from "./utils/express/registerRoutes";

import dotenv from 'dotenv';
import path from "path";

dotenv.config();

const app: Express = express();


// Auto-routing system
const pagesPath: string = path.join(__dirname, "pages");
registerRoutes(app, pagesPath, "/", () => {
  console.log("[SERVER]: Pages loaded")
});


app.listen(process.env.PORT, () => {
  console.log(`[SERVER]: Running at http://localhost:${process.env.PORT}`);
});