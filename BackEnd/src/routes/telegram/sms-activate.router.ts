import express, { Router, Request, Response } from "express";
import * as smsService from "../../utils/telegram/sms-activate";

const router: Router = express.Router();

router.get("/get-service", async (req: Request, res: Response) => {
  res.status(200).json(smsService.serviceList);
});

router.get("/get-country", async (req: Request, res: Response) => {
    const service = await smsService.checkService(req.query.service as string);
    
    const countries = await smsService.getCountry(service);
    res.status(200).json(countries);
});

router.get("/get-balance", async (req: Request, res: Response) => {
  const service = await smsService.checkService(req.query.service as string);

  const balance = await smsService.getBalance(service)

  res.status(200).json(balance);
})


export default router;
