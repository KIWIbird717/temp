import { Application } from "express";
import fs from "fs";
import path from "path";

const registerRoutes = (app: Application, dirPath: string, prefix: string = "/"): void => {
  const files: string[] = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      registerRoutes(app, filePath, path.join(prefix, file));
    } else {
      const route = file.split(".")[0];
      const page = require(filePath).default;

      if (route === "index") {
        app.use(prefix, page);
      } else {
        app.use(path.join(prefix, route), page);
      }
    }
  }
}

export default registerRoutes;