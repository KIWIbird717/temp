import express, { Request, Response } from "express";
import {
  IAccountsManagerFolder,
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise";
import multer from 'multer';

const router = express.Router()

// Configure Multer storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

interface IJsonAccountData {
  app_hash: string
  app_id: number
  app_version: string
  avatar: string
  device: string
  first_name: string
  ipv6: boolean
  lang_pack: string
  last_check_time: Date
  last_name: string
  phone: string
  proxy: string
  register_time: Date
  sdk: string
  session_file: string
  sex: number
  system_lang_pack: string
  twoFA: string
  username: string
}

interface IUploadedFiles {
  buffer: Buffer
  encoding: string
  fieldname: string
  mimetype: string
  originalname: string,
  size: number
}

router.post('/add-new-account-handwrite', upload.array('files'), async (req: Request, res: Response) => {
  /**
   * From Raw files data create pair of phone_number.session & phone_number.json file:
   * {
   *    session: 'phone_number.session',
   *    json: 'phone_number.json'
   * }
   */
  const handleToPairs = (files: IUploadedFiles[]) => {
    const filesPairs = files.map((file, _, array) => {
      if (file.originalname.includes('.session')) {
        const pairFile = array.filter((secondFile) => secondFile.originalname == file.originalname.replace(/\.session$/i, '.json'))
        return { session: file, json: pairFile[0] }
      }
    }).filter((pair) => pair !== undefined)

    return filesPairs
  }

  try {
    const { mail, folderKey } = req.body
    const files = req.files

    // chek fields
    if (!mail) return res.status(400).json({ message: 'Bad request. Select mail' })
    if (!folderKey) return res.status(400).json({ message: 'Bad request. Select folder key' })
    if (!files.length) return res.status(400).json({ message: 'Bad request. No new files data' })    

    // Found user
    const user = await RegisterUserSchema.findOne({ mail })
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Found folder
    const folder: IAccountsManagerFolder = user.accountsManagerFolder.find((folder) => folder.key == folderKey)
    if (!folder) return res.status(404).json({ message: `Folder with key: ${folderKey} was not found` })

    // Find the lates key for accoun
    let dinamicKey = Math.max(...folder.accounts.map((account) => Number(account.key)))
    if (dinamicKey < 0) dinamicKey = 0

    // Configure new accounts data
    handleToPairs(files as unknown as IUploadedFiles[]).forEach((account) => {
      const jsonFile: IJsonAccountData = JSON.parse(account.json.buffer.toString()) // Account data from json file
      const newAccount: IAccountsManagerFolder['accounts'][0] = {
        key: (dinamicKey++).toString(),
        avatar: "Null",
        phoneNumber: jsonFile.phone,
        resting: 0,
        userName: jsonFile.username,
        firstName: jsonFile.first_name ? jsonFile.first_name : 'Test',
        lastName: jsonFile.last_name ? jsonFile.last_name : 'Testovich',
        secondFacAith: jsonFile.twoFA,
        proxy: jsonFile.proxy,
        latestActivity: jsonFile.last_check_time,
        status: "sucssess",
        telegramSession: { originalname: account.json.originalname, buffer: account.json.buffer },
        sessionPath: { originalname: account.session.originalname, buffer: account.session.buffer },
        apiId: jsonFile.app_id,
        apiHash: jsonFile.app_hash,
      }

      // Push new account to user`s acoounts
      folder.accounts.push(newAccount)
    })

    // Update user
    const updatedUser = await RegisterUserSchema.findOneAndUpdate(
      { mail: mail, 'accountsManagerFolder.key': folderKey },
      { $set: { 'accountsManagerFolder.$': folder } },
      { new: true }
    )

    return res.status(200).json({ message: "Accounts successfully added.", accountsManagerFolder: updatedUser.accountsManagerFolder })
  } catch (err) {
    return res.status(500).json({ message: `${err}` })
  }
})

export default router