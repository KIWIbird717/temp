import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
  IAccountsManagerFolder
} from "../../servises/RegisterUserDB/registerUserSchema.servise";

const router: Router = express.Router();

/**
 * request example:
 * {
 *  mail: string,
 *  accounts: [
    {
      key: string;
      avatar?: string;
      phoneNumber: string;
      resting: Date | number;
      userName: string;
      firstName?: string;
      lastName?: string;
      secondFacAith: string;
      proxy: string;
      latestActivity: Date;
      status: "success" | "warning" | "error" | string;
      telegramSession: string;
      apiId?: number;
      apiHash?: string;
    },
  ]
 * }
 */
router.post('/add-accounts-to-user', async (req: Request, res: Response) => {
  const { mail } = req.body
  const accounts: IAccountsManagerFolder["accounts"] = req.body.accounts

  const result = await RegisterUserSchema.updateOne(
    { mail: mail },
    { $push: { accountsManagerFolder: {...accounts} } }
  )

<<<<<<< HEAD
  console.log({result}) // Dev dep
=======
  // console.log({result})
>>>>>>> 06dbdfbbc87f31e44dfd146f5b0d1f13c85a7035
})

export default router