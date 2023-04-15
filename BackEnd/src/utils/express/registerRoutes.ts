import { Application } from "express";
import { asyncWrapper } from "./errorHandler";
import fs from "fs";
import path from "path";

/**
 * Reading folder "routes" and add from that page 
 * @todo Add access system, and handler
 * 
 * How it work:
 * If you need to do "/test1/test"
 * Crete folder inside "routes" with name "test1", how it's look like:
 * 
 * routes/
 *  index.ts
 *  test1/
 *    test.ts
 * 
 */

const wrapRouteHandlers = (router) => {
  const routes = router.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route);

  routes.forEach((route) => {
    const methods = Object.keys(route.methods);

    methods.forEach((method) => {
      const originalHandler = route.stack[0].handle;
      route.stack[0].handle = asyncWrapper(originalHandler);
    });
  });
};


const registerRoutes = (app: Application, dirPath: string, prefix: string = "/", callback?: () => void): void => {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      // Init routes inside folder
      registerRoutes(app, filePath, path.join(prefix, file).replace(/\\/g, "/") + "/");
    } else {
      const routeModule = require(filePath);
      const router = routeModule.default;

      if (router) {
        wrapRouteHandlers(router);
        app.use(prefix, router);
      }
    }
  }

  if (callback) {
    callback();
  }
};

export default registerRoutes;