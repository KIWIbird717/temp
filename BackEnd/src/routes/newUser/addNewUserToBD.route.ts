import express, { Router, Request, Response } from "express"
import CreateNewUser from '../../servises/RegisterUserDB/addRegisterUser.servise'

const router: Router = express.Router()

router.post('/registration', async (req: Request, res: Response) => {
  const props = req.body()

  console.log(props)
  // adding data about new User to MongoDB
  const createNewUser = CreateNewUser({...props})
  res.json(createNewUser)
})

export default router;