import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
  IAccountsManagerFolder,
  IUserRes
} from "../../servises/RegisterUserDB/registerUserSchema.servise";

const router: Router = express.Router();

/**
 * request example:
 * {
 *  mail: string,
 *  folder: [
      key: string;
      apiHash: string;
      apiId: number;
      folder: string;
      dopTitle: string;
      accountsAmount: number;
      country: string;
      latestActivity: Date;
      banned: number;
      accounts: []
 * }
 */
router.post('/add-new-folder', async (req: Request, res: Response) => {
  try {
    const { mail } = req.body
    const folder = req.body.folder
    console.log(folder)
    const result = await RegisterUserSchema.updateOne(
      { mail: mail },
      { $push: { accountsManagerFolder: folder } }
    )
    if (result.modifiedCount > 0) {
      return res.status(200).json(result)
    } else {
      return res.status(501).json('Ошибка при создании новой папки')
    }
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.get('/get-accounts-folders/:mail', async (req: Request, res: Response) => {
  try{
    const { mail } = req.params

    const user: IUserRes = await RegisterUserSchema.findOne({ $or: [{ mail }] })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const accountFolders = user.accountsManagerFolder
    res.status(200).json(accountFolders)
  } catch(err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to get account folders' })
  }
})

export default router