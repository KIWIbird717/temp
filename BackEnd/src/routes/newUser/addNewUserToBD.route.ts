import express, { Router, Request, Response } from "express"
import CreateNewUser from '../../servises/RegisterUserDB/addRegisterUser.servise'

const router: Router = express.Router()

router.post('/registration', async (req: Request, res: Response) => {
  try {
    const props = req.body()
  
    // adding data about new User to MongoDB
    const createNewUser = CreateNewUser({...props})
    res.json(createNewUser)
  } catch(err) {
    console.error(err)
    throw err
  }
})