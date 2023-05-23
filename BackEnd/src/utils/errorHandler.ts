import * as path from "path";
import { promises as fs } from "fs";

export type ErrorService = "telegram" | "sms-service" | "express";
export type ErrorType = "error" | "warn" | "completed";

interface ErrorWithStatus extends Error {
    status?: number;
}

export async function logErrorToFile(err: ErrorWithStatus, service: ErrorService, type: ErrorType): Promise<void> {
  try {
    const logsDir = path.join(__dirname, "../../../logs");
    const errorLogPath = path.join(logsDir, `${type}${service.charAt(0).toUpperCase() + service.slice(1)}.txt`);
    const errorMessage = Buffer.from(
      ` \n | Time: ${new Date()}\n | Error: ${err.message}\n | Stack: ${err.stack || ""}\n\n`
    );
    if (process.env.DEBUG === "true") {
      console.log("\x1B[31m", `[${type.toUpperCase()}]: ${errorMessage.toString()}`);
    }
    await fs.mkdir(logsDir, { recursive: true });
    await fs.appendFile(errorLogPath, errorMessage, "utf-8");
  } catch (error) {
    console.error("\x1B[31m", `[ERROR] Error writing to log file: ${error}`);
  }
}
