import { IHeaderType } from "../pages/ApplicationPages/AccountsManager/Collumns"
import type { smsServicesTypes } from '../globalTypes'

export interface IUserState {
  nick: string | null,
  mail: string | null,
  id: number | null,
  isUserLogined: boolean,
  userManagerFolders: IHeaderType[] | null
}

export type smsServicesTypes = {
  title: string,
  type: "error" | "warning" | "success" | "service"
}
export interface IAppState {
  appPage: '1' | '2' | '3' | '4' | '5' | '6',
  accountsManagerFolder: React.Key | null,
  proxyManagerFolder: React.Key | null,
  userAvatar: string | null,
  smsServisies: smsServicesTypes[] | null,
}

export interface IRootStoreState {
  user: IUserState
}