import express, { Router, Request, Response, NextFunction } from "express";
import fs from "fs";

const router: Router = express.Router();

router.get("/error-list", async (req: Request, res: Response, next: NextFunction) => {
  const errorLogPath = "./logs/errorExpress.txt";

  fs.readFile(errorLogPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).send("Error reading the file");
      return;
    }

    const errorBlocks = data
      .split("\n\n")
      .filter((block) => block.trim() !== "");
    const errorObjects = errorBlocks.map((block) => {
      const lines = block.split("\n").filter((line) => line.trim() !== "");
      const timeLine = lines[0].split("| Time: ")[1].trim();
      const errorLine = lines[1].split("| Error: ")[1].trim();
      const stackLines = lines.slice(2).join("\n").split("| Stack: ")[1].trim();

      return {
        time: timeLine,
        error: errorLine,
        stack: stackLines,
      };
    });

    res.status(200).send(errorObjects);
  });
});

export default router;
