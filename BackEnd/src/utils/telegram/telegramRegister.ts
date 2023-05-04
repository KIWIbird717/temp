import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { ProxyInterface } from "telegram/network/connection/TCPMTProxy";
import { getTelegramVersionSync } from "./utils";
import os from "os";

import {
  Service,
  rentPhoneRegistration,
  getRegistrationCode,
  Country,
  getTelegramCode,
} from "../smsService/smsActivate";

interface WaitingForVerify {
  phoneNumber: string;
  code: string | number;
}

interface DeviceInfo {
  os: string;
  device: string;
  appVersion: string | "last";
}

interface phoneVerify {
  service?: Service;
  manual?: boolean;
  phone?: string;
}

interface UserSettings {
  language?: "ru" | "en";
  device?: DeviceInfo;
  proxy?: ProxyInterface;
  phone: phoneVerify;
}

class telegramUser {
  private apiId: number;
  private apiHash: string;
  public statistic: {
    userError: string[];
    phone: string;
    utils: {
      phoneId?: string;
      servicePhone?: Service;
      country?: Country;
    };
    manual?: boolean;
    userExists: boolean;
    tgUserStats: {
      username: string;
      description: string;
    };
  };
  public client: TelegramClient;
  constructor(apiId: number, apiHash: string, params: UserSettings) {
    this.apiId = apiId;
    this.apiHash = apiHash;

    this.statistic.manual =
      !params.phone.manual && !params.phone.service
        ? true
        : params.phone.manual;


    if (this.statistic.manual == true){
      this.statistic.phone = params.phone.phone 
      this.statistic.utils.servicePhone = null 
    } else {
      this.statistic.utils.servicePhone = params.phone.service
    }

    const deviceInfo = params.device ?? {
      os: os.release().toString(),
      device: os.type().toString(),
      appVersion: "",
    };
    const deviceModel = deviceInfo.device;
    const systemVersion = deviceInfo.os;

    const last_version = getTelegramVersionSync(
      params.device.device ?? os.platform().toString()
    );

    const appVersion =
      deviceInfo.appVersion == "last" || deviceInfo.appVersion == ""
        ? last_version
        : deviceInfo.appVersion;

    const systemLanguage = params.language ?? "en";
    this.client = new TelegramClient(
      new StringSession(""),
      this.apiId,
      this.apiHash,
      {
        deviceModel: deviceModel,
        systemVersion: systemVersion,
        appVersion: appVersion,
        langCode: systemLanguage,
        systemLangCode: systemLanguage,
        proxy: params.proxy,
      }
    );
  }

  public async createTelegramUser() {
    if (this.statistic.manual == true) {
      const phone = await rentPhoneRegistration(
        this.statistic.utils.servicePhone,
        await getTelegramCode(this.statistic.utils.servicePhone),
        this.statistic.utils.country.id
      );
      this.statistic.utils.phoneId = phone.id;
      this.statistic.phone = phone.phoneNumber;
    }

    

    const isAvalible = await this.autoRegister();

    if (isAvalible == "reg-noacc") {
      this.statistic.userError.push(
        `User was registered with name: ${await this.client.getMe()}`
      );
    } else if (isAvalible == "val-code") {
      this.statistic.userError.push(
        `Valid sms code from service: ${this.statistic.utils.servicePhone} and phone number is: ${this.statistic.phone}`
      );
    }

    if (isAvalible == "reg") {
      try {
        const currentUser = (await this.client.getMe()) as Api.User;
        const inputPeer = new Api.InputPeerUser({
          userId: currentUser.id,
          accessHash: currentUser.accessHash!,
        });
        const userFull = await this.client.invoke(
          new Api.users.GetFullUser({ id: inputPeer })
        );
        this.statistic.tgUserStats.username = currentUser.username;
        this.statistic.tgUserStats.description = userFull.fullUser.about;

        this.statistic.userExists = true;
      } catch (err) {
        this.statistic.userError.push(`Error when fetch data from registered user, error: ${err}`);
      }
    } else if (isAvalible == "non-reg") {
      // Implemets for registration
    }
  }

  public async enableTwoFactor() {}

  private async autoRegister(): Promise<string> {
    return new Promise(async (res) => {
      try {
        await this.client.start({
          phoneNumber: async () => this.statistic.phone,
          password: async () => {
            throw new Error("PASSWORD_REQUIRED");
          },
          phoneCode: async (isCodeViaApp = false) => {
            if (isCodeViaApp) {
              throw new Error('CODE_VIA_APP');
            }
            if (this.statistic.manual) {
              const codeGenerator = waitForCode(this.statistic.phone);
              const code = await codeGenerator.next();
              return code.value;
            } else {
              const code = await getRegistrationCode(
                this.statistic.utils.servicePhone,
                {
                  id: this.statistic.utils.phoneId,
                  phoneNumber: this.statistic.phone,
                }
              );
              return code.code;
            }
          },
          onError: (err: Error) => {
            throw new Error(`Telegram register error: ${err}`);
          },
        });
        // Have access to user (Good)
        res("reg");
        await this.client.disconnect();
      } catch (err) {
        if (err.message.includes("PHONE_NUMBER_INVALID")) {
          // User not registered (Good)
          res("non-reg");
        } else if (err.message.includes("PHONE_CODE_INVALID")) {
          // Valid code from sms
          res("val-code");
          await this.client.disconnect();
        } else if (err.message === "PASSWORD_REQUIRED" || err.message === "CODE_VIA_APP") {
          res("reg-noacc");
          await this.client.disconnect();
        } else {
          throw new Error(`When checking user happend error: ${err}`);
        }
      }
    });
  }
}


let waitingForVerify: WaitingForVerify[] = [];

async function* waitForCode(phoneNumber: string): AsyncGenerator<string | number | undefined> {
  while (true) {
    const foundEntry = waitingForVerify.find(entry => entry.phoneNumber === phoneNumber);
    if (foundEntry) {
      // Remove the entry from the waitingForVerify list after using the code
      waitingForVerify = waitingForVerify.filter(entry => entry.phoneNumber !== phoneNumber);
      yield foundEntry.code;
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export function addCodeToWaitingForVerify(phoneNumber: string, code: string | number): void {
  waitingForVerify.push({ phoneNumber, code });
}