import express, { Router, Request, Response } from "express";
import * as smsService from "../../utils/telegram/sms-activate";

const router: Router = express.Router();

router.get("/get-service", async (req: Request, res: Response) => {
  res.status(200).json(smsService.serviceList);
});

router.get("/get-country", async (req: Request, res: Response) => {
    const service = req.query.service as string;
    if (!service || !smsService.serviceList.includes(service)) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }
    const countries = await smsService.getCountry(service as smsService.Service);
    res.status(200).json(countries);
});
// router.get("/get-balance", async (req: Request, res: Response) => {
//   const { service } = req.query;

//   if (
//     !service ||
//     typeof service !== "string"
//   ) {
//     return res.status(400).json({ error: "Invalid query parameters" });
//   }

//   let balance: number;

//   switch (service) {
//     case "sms-man":
//       balance = await smsService.getBalanceSmsMan(process.env.API_KEY_SMS_MAN as string);
//       break;
//     case "5sim":
//       balance = await smsService.getBalance5Sim(process.env.API_KEY_5SIM as string);
//       break;
//     case "sms-acktiwator":
//       balance = await smsService.getBalanceSmsAcktiwator(process.env.API_KEY_SMS_ACKTIWATOR as string);
//       break;
//     case "sms-activate":
//       balance = await smsService.getBalanceSmsActivate(process.env.API_KEY_SMS_ACTIVATE as string);
//       break;
//     case "sms-activation-service":
//       balance = await smsService.getBalanceSmsActivationService(process.env.API_KEY_SMS_ACTIVATION_SERVICE as string);
//       break;
//     default:
//       return res.status(400).json({ error: "Invalid service name" });
//   }

//   res.status(200).json({ service, balance });
// });

// router.get("/get-country", async (req: Request, res: Response) => {
//   const { service } = req.query;

//   if (
//     !service ||
//     typeof service !== "string"
//   ) {
//     return res.status(400).json({ error: "Invalid query parameters" });
//   }

//   let countries: Array<{ id: string; name: string }>;

//   switch (service) {
//     case "sms-man":
//       countries = await smsService.getCountriesSmsMan(process.env.API_KEY_SMS_MAN as string);
//       break;
//     case "5sim":
//       countries = await smsService.getCountries5Sim(process.env.API_KEY_5SIM as string);
//       break;
//     case "sms-acktiwator":
//       countries = await smsService.getCountriesSmsAcktiwator(process.env.API_KEY_SMS_ACKTIWATOR as string);
//       break;
//     case "sms-activate":
//       countries = await smsService.getCountriesSmsActivate(process.env.API_KEY_SMS_ACTIVATE as string);
//       break;
//     case "sms-activation-service":
//       countries = await smsService.getCountriesSmsActivationService(process.env.API_KEY_SMS_ACTIVATION_SERVICE as string);
//       break;
//     default:
//       return res.status(400).json({ error: "Invalid service name" });
//   }

//   res.status(200).json(countries);
// });

export default router;
