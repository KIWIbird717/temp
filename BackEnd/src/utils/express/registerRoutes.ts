import express from "express";
import fs from "fs";
import path from "path";

function registerRoutes(app: express.Application, dirPath: string, prefix: string = "/", callback?: () => void) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    
    if (isDirectory) {
      registerRoutes(app, filePath, path.join(prefix, file).replace(/\\/g, "/") + "/" );
    } else {
      app.use(prefix, require(filePath).default);
    }
  }

  if (callback) {
    callback();
  }
}

export default registerRoutes;