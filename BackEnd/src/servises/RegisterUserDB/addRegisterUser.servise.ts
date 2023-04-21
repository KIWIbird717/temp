import { RegisterUserSchema, IRegisterUserSchema } from './registerUserSchema.servise'
import { customEncryption } from '../../utils/hooks/customEncryption.util'

/**
 * New `User` DB schema 
 * 
 * @description
 * Registrate new user in application
 * 
 * @arguments
 * - `nick` required
 * - `mail` required
 * - `password` required (need to be encrypted by `customEncryption` hook)
 */
const CreateNewUser = async (props: IRegisterUserSchema): Promise<IRegisterUserSchema> => {
  const post = new RegisterUserSchema({ 
    nick: props.nick,
    mail: props.mail, 
    password: customEncryption(props.password)
  })
  const savePost = await post.save()

  return savePost
}

export default CreateNewUser