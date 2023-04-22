import express, { Router, Request, Response } from "express";
import {
  RegisterUserSchema,
  IUserRes
} from "../../servises/RegisterUserDB/registerUserSchema.servise";
import { customCompareDecription } from "../../utils/hooks/customCompareDecryption.util";

const router: Router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { mail, password } = req.body;

  if (
    !password ||
    typeof password !== "string" ||
    !mail ||
    typeof mail !== "string"
  ) {
    return res.status(400).json({ message: "Uncurrect user" });
  }

  // Check if user already exists
  const existingUser: IUserRes = await RegisterUserSchema.findOne({ $or: [{ mail }] });

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' })
  }
  if (await customCompareDecription(password, existingUser.password)) {
    return res.status(201).json(
      { 
        message: "User logined successfully", 
        data: {
          id: existingUser._id,
          nick: existingUser.nick,
          mail: existingUser.mail,
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt,
          __v: existingUser.__v
        } 
      })
  } else {
    return res.status(400).json({ message: "Uncurrect password" });
  }
});

export default router;
