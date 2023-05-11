import { Application, Request, Response, NextFunction } from "express";
import * as path from "path";
import { promises as fs } from "fs";
import util from "util";

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
    try {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        logErrorToFile(err);
        res.status(err.status || 500).send({ error: err.message });
      });
    } catch (err) {
      logErrorToFile(err);
      res.status(err.status || 500).send({ error: err.message });
    }
  };
}

async function logErrorToFile(err: ErrorWithStatus): Promise<void> {
  try {
    const logsDir = path.join(__dirname, "../../../logs");
    const errorLogPath = path.join(logsDir, "errorExpress.txt");
    const errorMessage = Buffer.from(
      ` \n | Time: ${new Date()}\n | Error: ${err.message}\n | Stack: ${
        err.stack
      }\n\n`
    );
    if (process.env.DEBUG === "true") {
      console.log("\x1B[31m", `[ERROR]: ${errorMessage.toString()}`);
    }
    await fs.mkdir(logsDir, { recursive: true });
    await fs.appendFile(errorLogPath, errorMessage, "utf-8");
  } catch (error) {
    console.error("\x1B[31m", `[ERROR] Error writing to log file: ${error}`);
  }
}

export { asyncWrapper };
