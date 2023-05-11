import axios from "axios"
import { AnyAction, Dispatch } from "redux"
import { setUserManagerFolders } from "../../store/userSlice"


interface IProps {
  dispatch: Dispatch<AnyAction>
  userMail: string
  folderKey: React.Key
}

export const deleteAccountsFolderFromDb = async ({dispatch, userMail, folderKey}: IProps): Promise<number> => {
  try {
    const url = `${process.env.REACT_APP_SERVER_END_POINT}/newAccountsFolder/delete-accounts-folder`
    const res = await axios.post(url, { mail: userMail, folderKey: folderKey })
  
    if (res.status === 200) {
      const accounts = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/newAccountsFolder/get-accounts-folders/${userMail}`)
      if (accounts.status === 200) {
        dispatch(setUserManagerFolders(accounts.data))
      } else {
        throw new Error('Can not get folders from DB')
      }
      return 200
    } else {
      throw new Error('Can not delete folder from DB')
    }
  } catch(err) {
    console.error(err)
    return 500
  }
}