import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { ProxyInterface } from "telegram/network/connection/TCPMTProxy";
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
import { LogLevel } from "telegram/extensions/Logger";

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

    this.client.setLogLevel(LogLevel.ERROR);
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

    if (this.statistic.userError.length === 0) {
      await submitPhone(
        this.statistic.utils.servicePhone,
        this.statistic.utils.phoneId,
        true
      ); // Code received, complete activation
    } else {
      const lastError =
        this.statistic.userError[this.statistic.userError.length - 1];

      if (lastError === "reg-noacc") {
        await submitPhone(
          this.statistic.utils.servicePhone,
          this.statistic.utils.phoneId,
          false,
          false
        ); // No access for account, deny

        this.statistic.userError.push(
          `User was registered with name: ${await this.client.getMe()}`
        );
      } else if (ERROR_TYPES.includes(lastError)) {
        await submitPhone(
          this.statistic.utils.servicePhone,
          this.statistic.utils.phoneId,
          false
        );

        this.statistic.userError.push(
          `Valid SMS code from service: ${this.statistic.utils.servicePhone}, and phone number is: ${this.statistic.phone}`
        );
      }
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

  public async getError(): Promise<{ error: string[]; fatalError: boolean }> {
    return {
      error: this.statistic.userError,
      fatalError:
        this.statistic.userError instanceof Array &&
        this.statistic.userError.some((err) => ERROR_TYPES.includes(err)),
    };
  }

  private async autoRegister(): Promise<string> {
    let signInResult: string = "";

    try {
      const sendCodeResult = (await this.client.invoke(
        new Api.auth.SendCode({
          phoneNumber: await this.phoneNumber(),
          apiId: this.apiId,
          apiHash: this.apiHash,
          settings: new Api.CodeSettings({
            allowFlashcall: false, // Force SMS by disabling flashcall
            currentNumber: true, // Indicate that the phoneNumber is the current number of the user
            allowAppHash: true,
          }),
        })
      )) as Api.auth.TypeSentCode;

      let phoneCodeHash = sendCodeResult["phoneCodeHash"];
      let isCodeViaApp =
        sendCodeResult["type"].className === "auth.SentCodeTypeApp";
      let phoneCode;
      let isRegistrationRequired = false;
      let termsOfService;

      while (true) {
        try {
          phoneCode = await this.phoneCode(isCodeViaApp);

          console.log(phoneCode + "asdasdasdasdasdas");

          const result = await this.client.invoke(
            new Api.auth.SignIn({
              phoneNumber: await this.phoneNumber(),
              phoneCodeHash,
              phoneCode,
            })
          );

          if (result instanceof Api.auth.AuthorizationSignUpRequired) {
            isRegistrationRequired = true;
            termsOfService = result.termsOfService;
            break;
          }

          signInResult = "successful";
          await submitPhone(
            this.statistic.utils.servicePhone,
            this.statistic.utils.phoneId,
            true
          );
          return signInResult;
        } catch (err: any) {
          if (err.message.includes("SESSION_PASSWORD_NEEDED")) {
            // Implement signInWithPassword logic here.
            // return this.signInWithPassword(apiCredentials, authParams);
          } else {
            const shouldWeStop = await this.handleError(err);
            if (shouldWeStop) {
              throw new Error("AUTH_USER_CANCEL");
            }
          }
        }
      }

      if (isRegistrationRequired) {
        while (true) {
          try {
            let [firstName, lastName] = await this.firstAndLastNames();

            if (!firstName) {
              throw new Error("First name is required");
            }

            const { user } = (await this.client.invoke(
              new Api.auth.SignUp({
                phoneNumber: await this.phoneNumber(),
                phoneCodeHash,
                firstName,
                lastName,
              })
            )) as Api.auth.Authorization;

            if (termsOfService) {
              await this.client.invoke(
                new Api.help.AcceptTermsOfService({
                  id: termsOfService.id,
                })
              );
            }

            signInResult = "successful";
            await submitPhone(
              this.statistic.utils.servicePhone,
              this.statistic.utils.phoneId,
              true
            );
            return signInResult;
          } catch (err: any) {
            const shouldWeStop = await this.handleError(err);
            if (shouldWeStop) {
              throw new Error("AUTH_USER_CANCEL");
            }
          }
        }
      }

      await this.handleError(new Error("Auth failed"));
      return signInResult;
    } catch (err) {
      signInResult = err.message;

      if (err.message.includes("Code is empty")) {
        // Valid code from SMS
        await submitPhone(
          this.statistic.utils.servicePhone,
          this.statistic.utils.phoneId,
          false
        );
        await this.client.disconnect();
      } else if (
        err.message === "CODE_VIA_APP" ||
        err.message === "AUTH_USER_CANCEL"
      ) {
        await submitPhone(
          this.statistic.utils.servicePhone,
          this.statistic.utils.phoneId,
          false,
          false
        );
        await this.client.disconnect();
      } else {
        this.statistic.userError.push(err);
      }
    }

    return signInResult;
  }

  // Helper functions
  private async firstAndLastNames(): Promise<string[]> {
    this.statistic.userExists = false;
    return [
      this.statistic.tgUserStats.fisrtName,
      this.statistic.tgUserStats.lastName,
    ];
  }

  private async phoneNumber(): Promise<string> {
    try {
      return (
        formatPhoneNumber(this.statistic.phone) ?? this.statistic.phone ?? ""
      );
    } catch {
      return this.statistic.phone ?? "";
    }
  }

  private async phoneCode(isCodeViaApp: boolean): Promise<string | null> {
    if (isCodeViaApp) {
      this.statistic.userError.push("CODE_VIA_APP");
      return null;
    }
    if (this.statistic.manual === true) {
      const codeGenerator = waitForCode(this.statistic.phone);
      const code = await codeGenerator.next();
      return code.value;
    }

    const code = await getRegistrationCode(this.statistic.utils.servicePhone, {
      id: this.statistic.utils.phoneId,
      phoneNumber: this.statistic.phone,
    });
    if (code === null) {
      this.statistic.userError.push("PHONE_CODE_INVALID");
      return null;
    }
    return code.code;
  }

  private async handleError(err: Error): Promise<boolean> {
    // Log the error for debugging
    console.error(err);

    // Define error messages
    const errorMessages = [
      "PHONE_CODE_EMPTY",
      "PHONE_CODE_EXPIRED",
      "PHONE_CODE_INVALID",
      "PHONE_NUMBER_INVALID",
      "PHONE_NUMBER_UNOCCUPIED",
      "SIGN_IN_FAILED",
      "PHONE_NUMBER_BANNED",
      "AUTH_KEY_UNREGISTERED", // Add this line
    ];

    // Check if error message is in the defined error messages
    for (const errorMessage of errorMessages) {
      if (err.message.includes(errorMessage)) {
        // Handle specific error
        switch (errorMessage) {
          case "PHONE_NUMBER_BANNED":
          case "PHONE_CODE_EMPTY":
            await submitPhone(
              this.statistic.utils.servicePhone,
              this.statistic.utils.phoneId,
              false,
              false
            );
            this.statistic.userError.push(errorMessage);
            break;

          case "PHONE_CODE_INVALID":
            await submitPhone(
              this.statistic.utils.servicePhone,
              this.statistic.utils.phoneId,
              false
            );
            this.statistic.userError.push(errorMessage);
            break;

          case "PHONE_NUMBER_INVALID":
            await this.autoRegister();
            this.statistic.userError.push(errorMessage);
            break;

          case "AUTH_KEY_UNREGISTERED": // Add this case
            // Implement your error handling logic for AUTH_KEY_UNREGISTERED here
            // For example, log the error and retry the registration process
            this.statistic.userError.push(errorMessage);
            break;

          default:
            this.statistic.userError.push(errorMessage);
            break;
        }

        // Stop running `autoRegister`
        return true;
      }
    }

    // If we don't recognize the error message, log it and continue running `autoRegister`
    this.statistic.userError.push(`Telegram register error: ${err}`);
    return false;
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

const ERROR_TYPES = [
  "PHONE_CODE_EMPTY",
  "PHONE_CODE_EXPIRED",
  "PHONE_CODE_INVALID",
  "PHONE_NUMBER_INVALID",
  "PHONE_NUMBER_UNOCCUPIED",
  "SIGN_IN_FAILED",
  "AUTH_KEY_UNREGISTERED", // Add this line
];
