import express, { Router, Request, Response } from "express";
import {
  addCodeToWaitingForVerify,
  telegramUser,
  UserSettings,
} from "../../utils/telegram/telegramRegister";
import { IUserRes } from "../../servises/RegisterUserDB/registerUserSchema.servise";
import { RegisterUserSchema } from "../../servises/RegisterUserDB/registerUserSchema.servise";
import { INewTgUserSchema, NewTgUserSchema } from "../../servises/AddTelegramUserToBD/newTgUserSchema.servise"

const router: Router = express.Router();

router.get("/info/device", async (req: Request, res: Response) => {});

/*
Need generate user profile

What need to containe inside body:
{
  telegramUser: {
        phone: "",     REQUIRED
        auto: true,    IF TRUE ANYTHING ELSE NOT REQUIRED, ONLY PHONE
        firstName: "", REQUIRED
        lastName: "",  REQUIRED
        userName: "",  NON REQUIRED
        photoUrl: "",  NON REQUIRED    
    }
    user: {
      email: "",
      folderKey: "",
      apiId: 0 | "me"
      apiHash: "" | "me"
    }
}
*/

router.post("/manual/register-user", async (req: Request, res: Response) => {
  const { mail, folderKey } = req.body.user;
  let apiId = 0;
  let apiHash = "";
  const userData: IUserRes = await RegisterUserSchema.findOne({
    $or: [{ mail }],
  }); // All data about user
  const folderData = userData.accountsManagerFolder.find(
    (folder) => folder.key === folderKey
  ); // Folder of user

  if (req.body.user.apiId === "me") {
    apiId = folderData.apiId;
  } else {
    apiId = req.body.user.apiId;
  }
  if (req.body.user.apiHash === "me") {
    apiHash = folderData.apiHash;
  } else {
    apiHash = req.body.user.apiHash;
  }

  const userSettings: UserSettings = {
    telegramUser: {
      firstName: req.body.telegramUser.firstName,
      lastName: req.body.telegramUser.lastName,
      userName:
        req.body.telegramUser.userName ??
        `${req.body.telegramUser.firstName}_${req.body.telegramUser.lastName}`,
      photoUrl: req.body.telegramUser.photoUrl ?? null,
    },
    phone: {
      phone: req.body.telegramUser.phone,
    },
    manual: true,
  };

  const autoGenerate = req.body.telegramUser.auto ?? true;

  if (autoGenerate === true) {
    // Implement for auto generating telegramUser
  }

  if (!/^[a-zA-Z_]+$/.test(userSettings.telegramUser.userName)) {
    throw new Error("Not correct username or it's containe non latin alphabet");
  }

  const newUser = new telegramUser(apiId, apiHash, userSettings);

  const sessionString = await newUser.createTelegramUser();

  const newTelegramUser = new NewTgUserSchema({

  })
  newTelegramUser.save()
});

router.post("/manual/add-code", async (req: Request, res: Response) => {
  const { code, phone } = req.query;

  if (code === null) {
    return res.status(400).json({ error: "No code" });
  }
  if (phone) {
    return res.status(400).json({ error: "No phone" });
  }

  await addCodeToWaitingForVerify(phone as string, code as string);

  return res.status(200).json({ message: "Success" });
});

export default router;
