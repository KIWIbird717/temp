import { Schema, Model, model } from "mongoose";

export interface IRegisterUserSchema {
  mail: string,
  password: string
}

interface IRegisterUserModel extends Model<IRegisterUserSchema> {}

const registerUserSchema: Schema = new Schema({
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
 * - `mail` required
 * - `password` required
 */
export const RegisterUserSchema: IRegisterUserModel = model<IRegisterUserSchema>('RegisterUserSchema', registerUserSchema)