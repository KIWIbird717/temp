import * as path from "path";
import { promises as fs } from "fs";

export type ErrorService = "telegram" | "sms-service" | "express";

interface ErrorWithStatus extends Error {
    status?: number;
  }
  

export async function logErrorToFile(err: ErrorWithStatus, service: ErrorService): Promise<void> {
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
