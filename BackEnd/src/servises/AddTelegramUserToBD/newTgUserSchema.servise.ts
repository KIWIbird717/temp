import { Schema, Document, Model, model } from "mongoose";


export interface INewTgUserSchema extends Document {
  phoneNumber: string,
  resting: number,
  fullName: string,
  twoFactorAuth: boolean,
  proxy?: string,
  status: number,
  latestActivity: Date,
  accountGroup?: string
}

interface INewTgUserModel extends Model<INewTgUserSchema> {}

const newTgUserSchema: Schema = new Schema({
  phoneNumber: {type: String, require: true},
  resting: {type: Number, require: true},
  fullName: {type: String, require: true},
  twoFactorAuth: {type: Boolean, require: true},
  proxy: {type: String, require: false},
  status: {type: Number, require: true},
  latestActivity: {type: Date, require: true},
  accountGroup: {type: String, require: false}
}, { timestamps: true })

/**
 * New `Telegram` account DB schema 
 * @description
 * `All described fields are also in Notion in technical task`
 * `The name of the field is indicated in brackets in accordance with the specification file`
 * 
 * @arguments
 * - `phoneNumber` (номер) required
 * - `resting` (отлёжка) required
 * - `fullName` (ФИО) required
 * - `twoFactorAuth` (2фа) required
 * - `proxy` (Привязанная группа прокси) optional
 * - `status` (статус) required
 * - `latestActivity` (Последняя активность) required
 * - `accountGroup` (группа аккаунтов) optional
 * 
 * @todo status (статус) Возможно изменим это поле, в зависимости от Telegram API
 * @todo latestActivity (Последняя активность) Возможно изменим это поле, в зависимости от Telegram API
 * @todo accountGroup (группа аккаунтов) Возможно изменим это поле
 */
export const NewTgUserSchema: INewTgUserModel = model<INewTgUserSchema>('NewTgUserSchema', newTgUserSchema)

