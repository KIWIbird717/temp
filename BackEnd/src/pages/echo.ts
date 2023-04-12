import express, { Router, Request, Response } from "express";

const router: Router = express.Router();


router.get('/echo', (req: Request, res: Response) => {
    res.send('Ok');
});
  

export default router;
