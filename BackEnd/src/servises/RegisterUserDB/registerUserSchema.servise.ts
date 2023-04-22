import { Schema, Model, model } from "mongoose";

export interface IRegisterUserSchema {
  nick: string,
  mail: string,
  password: string
}

/**
 * User info 
 * `Response from MongoDB`
 */
export interface IUserRes {
  _id: string,
  nick: string,
  mail: string,
  password: string,
  createdAt: Date,
  updatedAt: Date,
  __v: number
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