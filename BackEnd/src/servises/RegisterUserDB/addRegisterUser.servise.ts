import { RegisterUserSchema, IRegisterUserSchema } from './registerUserSchema.servise'
import { customEncryption } from '../../utils/hooks/customEncryption.util'

/**
 * New `User` DB schema 
 * 
 * @description
 * Registrate new user in application
 * 
 * @arguments
 * - `mail` required
 * - `password` required (need to be encrypted by `customEncryption` hook)
 */
const CreateNewUser = async (props: IRegisterUserSchema): Promise<IRegisterUserSchema> => {
  const post = new RegisterUserSchema({ 
    mail: props.mail, 
    // password: customEncryption(props.password)
    password: props.password
  })
  const savePost = await post.save()

  return savePost
}

export default CreateNewUser