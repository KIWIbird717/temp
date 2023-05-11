import axios from "axios"
import { IHeaderType } from "../AccountsManager/Collumns"
import { generateRandomCountry, generateRandomDate, generateRandomName, generateRandomPhoneNumber, generateRandomResting, generateRandomStatus, generateRandomString } from "../../../utils/generateTempData"

export const addNewAccounts = async () => {
  const url = `${process.env.REACT_APP_SERVER_END_POINT}/newUser/add-accounts-to-user`
  const mail = 'test1@mail.ru'

  const accounts: IHeaderType[] = [{
    key: '1',
    folder: 'test1',
    dopTitle: 'test1',
    accountsAmount: 0,
    country: 'null',
    latestActivity: new Date(),
    banned: 0,
    accounts: [
      {
        key: '1',
        apiHash: generateRandomString(12),
        apiId: 1232432,
        avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
        phoneNumber: generateRandomPhoneNumber(),
        resting: generateRandomResting(),
        secondFacAith: generateRandomString(12),
        proxy: generateRandomCountry(),
        latestActivity: generateRandomDate(2023, 2023),
        status: generateRandomStatus(),
        userName: 'test user1',
        firstName: 'test',
        lastName: 'user1',
        telegramSession: generateRandomString(12),
      },
    ]
}]

await axios.post(url, { mail, accounts})
}
