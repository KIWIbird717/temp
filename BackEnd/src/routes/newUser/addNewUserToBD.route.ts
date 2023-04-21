import express, { Router, Request, Response } from "express"
import CreateNewUser from '../../servises/RegisterUserDB/addRegisterUser.servise'
import { IRegisterUserSchema, RegisterUserSchema } from '../../servises/RegisterUserDB/registerUserSchema.servise';
import { customCompareDecription } from "../../utils/hooks/customCompareDecryption.util";

const router: Router = express.Router()

router.post('/registration', async (req: Request, res: Response) => {
  const { nick, mail, password } = req.body
    
  // Check if user already exists
  const existingUser: IRegisterUserSchema | null = await RegisterUserSchema.findOne({$or: [{ mail }]})

  if (existingUser) {
    if (await customCompareDecription(password, existingUser.password)) {
      return res.status(201).json({ message: 'User logined successfully' })
    } else {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

  }

  // adding data about new User to MongoDB
  await CreateNewUser({ nick, mail, password })
  return res.status(201).json({ message: 'User registered successfully' })
})

export default router;