
export interface IUserState {
  nick: string | null,
  mail: string | null,
  id: number | null,
  isUserLogined: boolean,
}

export interface IAppState {
  appPage: '1' | '2' | '3' | '4' | '5' | '6',
  accountsManagerFolder: React.Key | null,
  proxyManagerFolder: React.Key | null,
  userAvatar: string | null
}

export interface IRootStoreState {
  user: IUserState
}