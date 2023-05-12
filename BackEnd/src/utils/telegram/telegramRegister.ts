import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { ProxyInterface } from "telegram/network/connection/TCPMTProxy";
import { signInUser } from "telegram/client/auth";
import { CustomFile } from "telegram/client/uploads";
import { formatPhoneNumber } from "./utils";
import {
  IAccountsManagerFolder,
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise";
import os from "os";

import {
  Service,
  rentPhoneRegistration,
  getRegistrationCode,
  Country,
  getTelegramCode,
  submitPhone,
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
  country?: Country;
  phone?: string;
}

interface userStatistic {
  firstName: string;
  lastName: string;
  userName: string;
  userString?: string;
}

export interface UserSettings {
  language?: "ru" | "en";
  device?: DeviceInfo;
  proxy?: ProxyInterface;
  phone: phoneVerify;
  telegramUser: userStatistic;
  manual?: boolean;
}

export class telegramUser {
  private apiId: number;
  private apiHash: string;
  public statistic: {
    userError: string[];
    phone: string;
    utils: {
      phoneId?: string;
      servicePhone?: Service;
      country?: Country;
      sessionString: any;
    };
    manual?: boolean;
    userExists: boolean;
    tgUserStats: {
      username: string;
      fisrtName: string;
      lastName: string;
      description: string;
    };
  };
  public client: TelegramClient;
  constructor(apiId: number, apiHash: string, params: UserSettings) {
    this.apiId = apiId;
    this.apiHash = apiHash;

    this.statistic = {
      userError: [],
      phone: "",
      utils: {
        sessionString: new StringSession(params.telegramUser.userString ?? ""),
      },
      userExists: false,
      tgUserStats: {
        username: "",
        fisrtName: "",
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

    this.statistic.tgUserStats.fisrtName = params.telegramUser.firstName;
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

    this.client = new TelegramClient(
      this.statistic.utils.sessionString,
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

    this.statistic.userExists = true;
  }

  public async createTelegramUser() {
    await this.client.connect();

    if (this.statistic.manual === false) {
      const telegram_code = await getTelegramCode(
        this.statistic.utils.servicePhone
      );
      const phone = await rentPhoneRegistration(
        this.statistic.utils.servicePhone,
        telegram_code,
        this.statistic.utils.country.id
      );
      this.statistic.utils.phoneId = phone.id;
      this.statistic.phone = phone.phoneNumber;
    }

    let isAvalible;

    try {
      isAvalible = await this.autoRegister();
    } catch (err) {
      this.statistic.userError.push(
        `Error when fetch data from registered user, error: ${err}`
      );
    }

    if (this.statistic.userExists === true) {
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
      } catch (err) {
        this.statistic.userError.push(
          `Error when fetch data from registered user, error: ${err}`
        );
      }
    } else {
      // Check if the username is available
      const usernameAvailable = await this.client.invoke(
        new Api.account.CheckUsername({
          username: this.statistic.tgUserStats.username,
        })
      );

      // If the username is available, set it for the new user
      if (usernameAvailable) {
        await this.client.invoke(
          new Api.account.UpdateUsername({
            username: this.statistic.tgUserStats.username,
          })
        );
      } else {
        await this.client.invoke(
          new Api.account.UpdateUsername({
            username:
              this.statistic.tgUserStats.username +
              `_${Math.floor(Math.random() * 100)}`,
          })
        );
      }
    }

    if (
      this.statistic.userError === undefined ||
      this.statistic.userError.length === 0
    ) {
      await submitPhone(
        this.statistic.utils.servicePhone,
        this.statistic.utils.phoneId,
        true
      ); // Code received, complete activation
    } else if (isAvalible === "reg-noacc") {
      await submitPhone(
        this.statistic.utils.servicePhone,
        this.statistic.utils.phoneId,
        false,
        false
      ); // No access for acount, deny

      this.statistic.userError.push(
        `User was registered with name: ${await this.client.getMe()}`
      );
    } else if (isAvalible === "val-code") {
      await submitPhone(
        this.statistic.utils.servicePhone,
        this.statistic.utils.phoneId,
        false
      );
      this.statistic.userError.push(
        `Valid sms code from service: ${this.statistic.utils.servicePhone} and phone number is: ${this.statistic.phone}`
      );
    }
  }

  public async changeAvatar(url: string): Promise<void> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    const result = await this.client.invoke(
      new Api.photos.UploadProfilePhoto({
        file: await this.client.uploadFile({
          file: new CustomFile(
            "image.jpg",
            imageBuffer.length,
            "image.jpg",
            imageBuffer
          ),
          workers: 1,
        }),
      })
    );
  }

  public async saveUser(): Promise<IAccountsManagerFolder["accounts"][0]> {
    let userId =
      Number(
        RegisterUserSchema.findOne()
          .sort({ "accounts.key": -1 })
          .limit(1)
          .exec()
      ) + 1;

    await this.client.connect();
    const sessionString = this.statistic.utils.sessionString.save();
    await this.client.disconnect();

    return {
      key: userId.toString(),
      phoneNumber: this.statistic.phone,
      resting: 0,
      userName: this.statistic.tgUserStats.username,
      firstName: this.statistic.tgUserStats.fisrtName ?? null,
      lastName: this.statistic.tgUserStats.lastName ?? null,
      secondFacAith: "",
      proxy: "",
      latestActivity: new Date(),
      status: "",
      telegramSession: sessionString,
    };
  }

  public async getError(): Promise<string[]> {
    return this.statistic.userError;
  }

  private async autoRegister(): Promise<string> {
    return new Promise(async (res) => {
      try {
        await signInUser(
          this.client,
          { apiHash: this.apiHash, apiId: this.apiId },
          {
            firstAndLastNames: async () => {
              this.statistic.userExists = false;
              return [
                this.statistic.tgUserStats.fisrtName,
                this.statistic.tgUserStats.lastName,
              ];
            },
            phoneNumber: async () => {
              try {
                return (
                  formatPhoneNumber(this.statistic.phone) ??
                  this.statistic.phone ??
                  ""
                );
              } catch {
                return this.statistic.phone ?? "";
              }
            },
            phoneCode: async (isCodeViaApp = false) => {
              if (isCodeViaApp) {
                this.statistic.userError.push("CODE_VIA_APP");
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
              this.statistic.userError.push(`Telegram register error: ${err}`);
            },
          }
        );
      } catch (err) {
        if (err.message.includes("Code is empty")) {
          // Valid code from sms
          res("val-code");
          await this.client.disconnect();
        } else if (
          err.message === "CODE_VIA_APP" ||
          err.message === "AUTH_USER_CANCEL"
        ) {
          res("reg-noacc");
          await this.client.disconnect();
        } else {
          this.statistic.userError.push(err);
        }
      }
    });
  }
}

let maxIdValue;

maxIdValue = RegisterUserSchema.findOne()
  .sort({ "accounts.key": -1 })
  .limit(1)
  .exec();

let waitingForVerify: WaitingForVerify[] = [];

async function* waitForCode(
  phoneNumber: string
): AsyncGenerator<string | number | undefined> {
  while (true) {
    const foundEntry = waitingForVerify.find(
      (entry) => entry.phoneNumber === phoneNumber
    );
    if (foundEntry) {
      // Remove the entry from the waitingForVerify list after using the code
      waitingForVerify = waitingForVerify.filter(
        (entry) => entry.phoneNumber !== phoneNumber
      );
      yield foundEntry.code;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export function addCodeToWaitingForVerify(
  phoneNumber: string,
  code: string | number
): void {
  waitingForVerify.push({ phoneNumber, code });
}
