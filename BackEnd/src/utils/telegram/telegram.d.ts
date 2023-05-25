import { Service, Country } from "../smsService/smsActivate";
import { TelegramClient } from "telegram";

export interface WaitingForVerify {
  phoneNumber: string;
  code: string | number;
}
interface telegramUserShema {
    phone: string;
    utils: {
      phoneId?: string;
      servicePhone?: Service;
      country?: Country;
      sessionString?: any;
    };
    manual?: boolean;
    userExists: boolean;
    tgUserStats: {
      username: string;
      fisrtName: string;
      lastName: string;
      description: string;
    };
  }
  