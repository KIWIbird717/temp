import express, { Router, Request, Response } from "express";
import CreateNewTgUser from "../../servises/AddTelegramUserToBD/addNewTelegramUser.servise";

const router: Router = express.Router();


router.get('/create-new-tg-user', (req: Request, res: Response) => {
    try {
        const props = req.body()

        // adding data about new Telegram user to MongoDB
        const createNewTgUser = CreateNewTgUser({...props})
        res.json(createNewTgUser)
    } catch (err) {
        res.status(500).json(err)
        throw new Error(`Can not create new Telegram user in MongoDb. ${err}`)
    }
});
  

export default router;
