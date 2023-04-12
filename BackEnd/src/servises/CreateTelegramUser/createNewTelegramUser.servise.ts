import { NewTgUserSchema, INewTgUserSchema } from "./newTgUserSchema.servise";

/**
 * Create new Telegram user 
 * 
 * @description
 * All described fields are also in Notion in technical task
 * The name of the field is indicated in brackets in accordance with the specification file
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
const CreateNewTgUser = async (props: INewTgUserSchema): Promise<INewTgUserSchema> => {
  const post = new NewTgUserSchema({...props})
  const savedPost = await post.save()

  return savedPost
}

export default CreateNewTgUser