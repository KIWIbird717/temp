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
  account: Object;
}

interface DeviceInfo {
  os: string;
  device: string;
  appVersion: string | "last";
}

interface phoneVerify {
  service?: Service;
  manual?: boolean;
  phone?: number | string;
}

interface UserSettings {
  language?: "ru" | "en";
  device?: DeviceInfo;
  proxy?: ProxyInterface;
  phone: phoneVerify;
}

let waitingForVerify: WaitingForVerify[] = [];

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
  };
  public client: TelegramClient;
  constructor(apiId: number, apiHash: string, params: UserSettings) {
    this.apiId = apiId;
    this.apiHash = apiHash;

    this.statistic.manual =
      !params.phone.manual && !params.phone.service
        ? true
        : params.phone.manual;
    this.statistic.utils.servicePhone =
      params.phone.manual == true ? null : params.phone.service;

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
    const phone = rentPhoneRegistration(
      this.statistic.utils.servicePhone,
      await getTelegramCode(this.statistic.utils.servicePhone),
      this.statistic.utils.country.id
    );

    const isAvalible = await this.autoRegister();

    if (isAvalible == "reg") {
      this.statistic.userError.push(
        `User was registered with name: ${await this.client.getMe()}`
      );
    } else if (isAvalible == "val-code") {
      this.statistic.userError.push(``);
    }
  }

  public async enableTwoFactor() {}

  private async autoRegister(): Promise<string> {
    return new Promise(async (res) => {
      try {
        const user = await this.client.start({
          phoneNumber: async () => this.statistic.phone,
          password: async () => {
            throw new Error("PASSWORD_REQUIRED");
          },
          phoneCode: async () => {
            const code = await getRegistrationCode(
              this.statistic.utils.servicePhone,
              {
                id: this.statistic.utils.phoneId,
                phoneNumber: this.statistic.phone,
              }
            );
            return code.code;
          },
          onError: (err: Error) => {
            console.error(
              "An error occurred during the authentication process:",
              err
            );
          },
        });
        res("reg");
      } catch (err) {
        if (err.message.includes("PHONE_NUMBER_INVALID")) {
          // User not registered (Good)
          res("non-reg");
        } else if (err.message.includes("PHONE_CODE_INVALID")) {
          // Valid code from sms
          res("val-code");
        } else if (err.message === "PASSWORD_REQUIRED") {
          res("reg");
        } else {
          throw new Error(`When checking user happend error: ${err}`);
        }
      } finally {
        await this.client.disconnect();
      }
    });
  }
}
