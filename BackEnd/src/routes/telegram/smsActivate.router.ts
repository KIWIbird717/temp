import express, { Router, Request, Response } from "express";
import * as smsService from "../../utils/telegram/smsActivate";

const router: Router = express.Router();

router.get("/get-service", async (req: Request, res: Response) => {
  res.status(200).json(smsService.serviceList);
});

router.get("/get-country", async (req: Request, res: Response) => {
  const service = await smsService.checkService(req.query.service as string);
  if (service === null){
    return res.status(400).json({ message: "Uncurrect service" });
  }

  const countries = await smsService.getCountry(service);
  res.status(200).json(countries);
});

router.get("/get-balance", async (req: Request, res: Response) => {
  const service = await smsService.checkService(req.query.service as string);
  if (service === null){
    return res.status(400).json({ message: "Uncurrect service" });
  }

  const balance = await smsService.getBalance(service);

  res.status(200).json(balance);
});

router.get("/get-available-phones", async (req: Request, res: Response) => {
  const service = await smsService.checkService(req.query.service as string);
  if (service === null) {
    return res.status(400).json({ message: "Incorrect service" });
  }

  const country: smsService.Country = {
    id: req.query.countryId as string,
    name: req.query.countryName as string || undefined,
  };

  if (country.id === '') {
    return res.status(400).json({ message: "Invalid or missing Country ID" });
  }

  const phones = await smsService.getAvailablePhones(service, country);
  res.status(200).json(phones);
});

export default router;
