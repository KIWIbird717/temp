import express, { Router, Request, Response } from "express"
import CreateNewUser from '../../servises/RegisterUserDB/addRegisterUser.servise'
import { RegisterUserSchema, IUserRes, IRegisterUserSchema } from '../../servises/RegisterUserDB/registerUserSchema.servise';
import { customCompareDecription } from "../../utils/hooks/customCompareDecryption.util";

const router: Router = express.Router()

router.post('/registration', async (req: Request, res: Response) => {
  // Get the data from the request body
  const { nick, mail, password, defaultAppHash, defaultAppId, accountsManagerFolder, proxyManagerFolder, recentAutoregActivity }: IRegisterUserSchema = req.body

  // Check if user already exists
  const existingUser: IUserRes | null = await RegisterUserSchema.findOne({$or: [{ mail }]})

  if (existingUser) {
    if (await customCompareDecription(password, existingUser.password)) {
      return res.status(201).json({ message: 'User logined successfully' })
    } else {
      return res.status(400).json({ message: 'User with this email already exists' })
    }
  }

  // adding data about new User to MongoDB
  await CreateNewUser({
    nick, 
    mail, 
    password, 
    defaultAppHash,
    defaultAppId,
    accountsManagerFolder, 
    proxyManagerFolder, 
    recentAutoregActivity
  } as IRegisterUserSchema)
  const existingUserAfterReg: IUserRes = await RegisterUserSchema.findOne({$or: [{ mail }]})
  return res.status(201).json(
    { 
      message: 'User registered successfully',
      data: {
        id: existingUserAfterReg._id,
        nick: existingUserAfterReg.nick,
        mail: existingUserAfterReg.mail,
        defaultAppHash: existingUserAfterReg.defaultAppHash,
        defaultAppId: existingUserAfterReg.defaultAppId,
        accountsManagerFolder: existingUserAfterReg.accountsManagerFolder,
        proxyManagerFolder: existingUserAfterReg.proxyManagerFolder,
        recentAutoregActivity: existingUserAfterReg.recentAutoregActivity,
        createdAt: existingUserAfterReg.createdAt,
        updatedAt: existingUserAfterReg.updatedAt,
        __v: existingUserAfterReg.__v
      }
    })
})

export default router;