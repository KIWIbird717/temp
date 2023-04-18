
export interface IUserState {
  mail: string | null,
  id: number | null,
  isUserLogined: boolean,
}

export interface IRootStoreState {
  user: IUserState
}