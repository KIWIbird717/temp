import express, { Router, Request, Response, NextFunction } from "express";

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    // Example of handle error
    throw new Error('This is a sample error')
    res.send('Express + TypeScript Server');
});

export default router;
