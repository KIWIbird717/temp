import express, { Router, Request, Response } from "express";
import CreateNewTgUser from "../../servises/AddTelegramUserToBD/addNewTelegramUser.servise";

const router: Router = express.Router();


router.get('/create-new-tg-user', async (req: Request, res: Response) => {
    const props = req.body()

    // adding data about new Telegram user to MongoDB
    const createNewTgUser = CreateNewTgUser({...props})
    res.json(createNewTgUser)
});
  

export default router;
