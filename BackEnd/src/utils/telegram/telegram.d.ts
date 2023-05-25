import { Service, Country } from "../smsService/smsActivate";


export interface WaitingForVerify {
  phoneNumber: string;
  code: string | number;
}
export interface AuthInterface {
    phone: string;
    utils: {
      phoneId?: string;
      servicePhone?: Service;
      country?: Country;
    };
    manual?: boolean;
    userExists: boolean;
  }
  