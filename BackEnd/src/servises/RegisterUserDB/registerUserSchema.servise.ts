import { Schema, Model, model } from "mongoose";

export interface IRegisterUserSchema {
  nick: string,
  mail: string,
  password: string
}

interface IRegisterUserModel extends Model<IRegisterUserSchema> {}

const registerUserSchema: Schema = new Schema({
  nick: {type: String, require: true},
  mail: {type: String, require: true},
  password: {type: String, require: true}
}, { timestamps: true })

/**
 * New `User` DB schema 
 * 
 * @description
 * Registrate new user in application
 * 
 * @arguments
 * - `nick` required
 * - `mail` required
 * - `password` required
 */
export const RegisterUserSchema: IRegisterUserModel = model<IRegisterUserSchema>('RegisterUserSchema', registerUserSchema)