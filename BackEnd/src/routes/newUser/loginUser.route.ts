import express, { Router, Request, Response } from "express"
import CreateNewUser from '../../servises/RegisterUserDB/addRegisterUser.servise'
import { IRegisterUserSchema, RegisterUserSchema } from '../../servises/RegisterUserDB/registerUserSchema.servise';
import { customCompareDecription } from "../../utils/hooks/customCompareDecryption.util";

const router: Router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
  const { mail, password } = req.body
    
  // Check if user already exists
  const existingUser: IRegisterUserSchema | null = await RegisterUserSchema.findOne({$or: [{ mail }]})

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' })
  }
  if (await customCompareDecription(password, existingUser.password)) {
    return res.status(201).json({ message: 'User logined successfully' })
  } else {
    return res.status(400).json({ message: 'Uncurrect password' })
  }
})

export default router;