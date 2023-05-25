import { Authorization } from "./auth";
import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { LogLevel } from "telegram/extensions/Logger";
import type { UserSettings } from "./telegram";

export class Telegram extends Authorization {
  private apiId: number;
  private apiHash: string;
  private client: TelegramClient

  constructor(mail: string, params: UserSettings) {
    super(mail, this.apiId, this.apiHash);
    this.statistic = {
      userError: [],
      phone: "",
      utils: {
        sessionString: new StringSession(params.telegramUser.userString ?? ""),
      },
      userExists: false,
      tgUserStats: {
        username: "",
        firstName: "",
        lastName: "",
        description: "",
      },
    };
    this.statistic.manual =
      !params.manual && !params.phone.service ? true : params.manual;

    if (this.statistic.manual === true) {
      this.statistic.phone = params.phone.phone;
      this.statistic.utils.servicePhone = null;
    } else {
      this.statistic.utils.servicePhone = params.phone.service;
      this.statistic.utils.country = params.phone.country;
    }

    this.statistic.tgUserStats.firstName = params.telegramUser.firstName;
    this.statistic.tgUserStats.lastName = params.telegramUser.lastName;
    this.statistic.tgUserStats.username = params.telegramUser.userName;

    const deviceInfo = params.device ?? {
      os: os.release().toString(),
      device: os.type().toString(),
      appVersion: "",
    };
    const deviceModel = deviceInfo.device;
    const systemVersion = deviceInfo.os;

    const appVersion =
      deviceInfo.appVersion === "last" || deviceInfo.appVersion === ""
        ? "8.0.0"
        : deviceInfo.appVersion;

    const systemLanguage = params.language ?? "en";

    if (!params.proxy) {
      params.proxy = null;
    }

    let client = new TelegramClient(
      new StringSession(params.telegramUser.userString ?? ""),
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

    client.setLogLevel(LogLevel.ERROR);
  }

  public async changeUsername(username: string) {
    // Check if the username is available
    const usernameAvailable = await this.client.invoke(
      new Api.account.CheckUsername({
        username: username,
      })
    );

    // If the username is available, set it for the new user
    if (usernameAvailable) {
      await this.client.invoke(
        new Api.account.UpdateUsername({
          username: username,
        })
      );
    } else {
      await this.client.invoke(
        new Api.account.UpdateUsername({
          username: username + `_${Math.floor(Math.random() * 100)}`,
        })
      );
    }
  }
}
