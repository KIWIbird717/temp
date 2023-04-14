import { Application, Request, Response, NextFunction } from "express";
import path from 'path';
import fs from 'fs';
import util from 'util';

/**
 * Handeling express error
 * @todo
 * 
 * Make it working
 */

interface ErrorWithStatus extends Error {
  status?: number;
}

const appendFileAsync = util.promisify(fs.appendFile);

function asyncWrapper(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

async function logErrorToFile(err: ErrorWithStatus): Promise<void> {
  try {
    const errorLogPath = path.join(__dirname, '../../../logs/errorExpress.txt');
    const errorMessage = `
      Time: ${new Date()}
      Error: ${err.message}
      Stack: ${err.stack}
      \n\n
    `;
    if (process.env.DEBUG === "true"){ 
      console.log("\x1B[31m", `[ERROR]: ${errorMessage}`);
    }
    await appendFileAsync(errorLogPath, errorMessage);
  } catch (error) {
    console.error("\x1B[31m", `[ERROR] Error writing to log file: ${error}`);
  } 
}

async function logErrors(err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): Promise<void> {
  await logErrorToFile(err);
  next(err);
}

const ErrorHandler = (app: Application): void => {
  app.use(logErrors);

  app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).send({ error: err.message });
  });
  
  process.on("unhandledRejection", async (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    await logErrorToFile(error);
  });

  process.on("uncaughtException", async (err) => {
    await logErrorToFile(err);
  });
};

export default ErrorHandler;
export { asyncWrapper };