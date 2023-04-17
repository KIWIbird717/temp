import express, { Router, Request, Response } from "express"
import CreateNewUser from '../../servises/RegisterUserDB/addRegisterUser.servise'
import { IRegisterUserSchema, RegisterUserSchema } from '../../servises/RegisterUserDB/registerUserSchema.servise';

const router: Router = express.Router()

router.post('/registration', async (req: Request, res: Response) => {
  const { mail, password } = req.body
    
  // Check if user already exists
  const existingUser: IRegisterUserSchema | null = await RegisterUserSchema.findOne({$or: [{ mail }]})

  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' })
  }

  // adding data about new User to MongoDB
  await CreateNewUser({ mail, password })
  return res.status(201).json({ message: 'User registered successfully' })
})

export default router;