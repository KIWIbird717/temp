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
}

export type smsServiciesDataType = {
  title: string,
  balance: number | null,
  counties: [{ id: number, name: string }] | null,
  cost: null,
  count: null
}
export interface IAppState {
  appPage: '1' | '2' | '3' | '4' | '5' | '6',
  accountsManagerFolder: React.Key | null,
  proxyManagerFolder: React.Key | null,
  userAvatar: string | null,
  smsServisies: smsServicesTypes[] | null,
  smsServiciesData: smsServiciesDataType[] | null
}

export interface IRootStoreState {
  user: IUserState
}