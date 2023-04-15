import { Application, Request, Response, NextFunction } from "express";
import path from 'path';
import fs from 'fs';
import util from 'util';

/**
 * Handling express error
 * @todo
 * 
 * Access system
 */

interface ErrorWithStatus extends Error {
  status?: number;
}

const appendFileAsync = util.promisify(fs.appendFile);

function asyncWrapper(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      logErrorToFile(err).then(() => {
        res.status(err.status || 500).send({ error: err.message });
      });
    });
  };
}

async function logErrorToFile(err: ErrorWithStatus): Promise<void> {
  try {
    const errorLogPath = path.join(__dirname, '../../../logs/errorExpress.txt');
    const errorMessage = Buffer.from(
      ` \n | Time: ${new Date()}\n | Error: ${err.message}\n | Stack: ${err.stack}\n\n`
    );
    if (process.env.DEBUG === "true") {
      console.log("\x1B[31m", `[ERROR]: ${errorMessage.toString()}`);
    }
    await appendFileAsync(errorLogPath, errorMessage);
  } catch (error) {
    console.error("\x1B[31m", `[ERROR] Error writing to log file: ${error}`);
  }
}

export { asyncWrapper };
