import { Country, Service } from "../smsService/smsActivate";
import { ProxyInterface } from "telegram/network/connection/TCPMTProxy";

export interface WaitingForVerify {
  phoneNumber: string;
  code: string | number;
}
export interface AuthInterface {
  phone: string;
  utils: {
    servicePhone?: Service;
    phoneId?: string;
  };
  manual?: boolean;
  userExists: boolean;
}
export interface telegramUserShema {
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

export interface UserSettings {
  language?: "ru" | "en";
  device?: DeviceInfo;
  proxy?: ProxyInterface;
  phone: phoneVerify;
  telegramUser: userStatistic;
  manual?: boolean;
}

interface DeviceInfo {
  os: string;
  device: string;
  appVersion: string | "last";
}

interface phoneVerify {
  service?: Service;
  country?: Country;
  phone?: string;
}

interface userStatistic {
  firstName: string;
  lastName: string;
  userName: string;
  userString?: string;
}
