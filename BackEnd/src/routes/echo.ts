import express, { Router, Request, Response } from "express";

const router: Router = express.Router();


router.get('/echo', (req: Request, res: Response) => {
    res.status(200).send('Ok');
});
  

export default router;
