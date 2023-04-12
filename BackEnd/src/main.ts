import express, { Express } from 'express';
import registerRoutes from "./utils/registerRoutes";

import dotenv from 'dotenv';
import path from "path";

dotenv.config();

const app: Express = express();


// Auto-routing system
const pagesPath = path.join(__dirname, "pages");
registerRoutes(app, pagesPath);


app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});