import { Request, Response, Express } from "express"
import CreateNewTgUser from "../servises/CreateTelegramUser/createNewTelegramUser.servise"


export const get = async (app: Express): Promise<void> => {
  try {
    app.get("/", (req: Request, res: Response) => {
      res.send({data: "Here will be json data from AutoregTD-bot BackEnd server"})
    })

    app.get("/info", (req: Request, res: Response) => {
      res.send({data: "Here more info from BackEnd server"})
    })
  } catch(err) {
    throw new Error(`Can not handle get method. ${err}`)
  }
}

export const post = async (app: Express): Promise<void> => {
  try {
    app.post("/create-new-tg-user", (req: Request, res: Response) => {
      try {
        const props = req.body()

        // adding data about new Telegram user to MongoDB
        const createNewTgUser = CreateNewTgUser({...props})
        res.json(createNewTgUser)
      } catch (err) {
        res.status(500).json(err)
        throw new Error(`Can not create new Telegram user in MongoDb. ${err}`)
      }
    })
  } catch(err) {
    throw err
  }
}