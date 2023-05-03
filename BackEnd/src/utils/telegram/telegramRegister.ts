import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { ProxyInterface } from "telegram/network/connection/TCPMTProxy";
import { getTelegramVersionSync } from "./utils";
import os from "os";

import * as speakeasy from "speakeasy";
import {
  Service,
  rentPhoneRegistration,
  getRegistrationCodes,
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

interface UserSettings {
  language?: "ru" | "en";
  device?: DeviceInfo;
  proxy?: ProxyInterface;
}

let waitingForVerify: WaitingForVerify[] = [];

class telegramUser {
  private apiId: number;
  private apiHash: string;
  public client: TelegramClient;
  constructor(apiId: number, apiHash: string, params: UserSettings) {
    this.apiId = apiId;
    this.apiHash = apiHash;
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

  public async createTelegramUser() {}

  public async enableTwoFactor() {}

  private async checkAndRegister() {
    try {
      const me = await this.client.getMe();
      console.log("User is registered:", me);
    } catch (err) {
      if (err instanceof Api.errors.PhoneNumberInvalid) {
      } else {
        throw new Error(`When checking user happend error: ${err}`);
      }
    } finally {
      await this.client.disconnect();
    }
  }
}
