import { logErrorToFile } from "../errorHandler";
import type { WaitingForVerify, AuthInterface } from "./telegram";
import { TelegramClient, Api } from "telegram";
import {
  IAccountsManagerFolder,
  RegisterUserSchema,
} from "../../servises/RegisterUserDB/registerUserSchema.servise";

import {
  rentPhoneRegistration,
  getRegistrationCode,
  getTelegramCode,
  submitPhone,
} from "../smsService/smsActivate";

import { Service, Country } from "../smsService/smsActivate";

interface UserAuth {
  manual?: boolean;
  servicePhone?: Service;
  country?: Country;
  phoneNumber?: string;
}
export class Authorization {
  private email: string;
  public success: boolean;
  public statistic: AuthInterface;
  private client: TelegramClient;
  private apiId: number;
  private apiHash: string;

  constructor(
    mail: string,
    apiId: number,
    apiHash: string
  ) {
    this.email = mail;
    this.success = true;
    this.apiHash = apiHash;
    this.apiId = apiId;
  }

  public async authorization(params: UserAuth): Promise<boolean> {
    if ((params.manual ?? false) === true) {
      this.statistic.phone = params.phoneNumber;
    } else {
      const telegram_code = await getTelegramCode(params.servicePhone);
      const phone = await rentPhoneRegistration(
        params.servicePhone,
        telegram_code,
        params.country.id
      );
      this.statistic.utils.servicePhone = params.servicePhone;
      this.statistic.utils.phoneId = phone.id;
      this.statistic.phone = phone.phoneNumber;
    }

    let isRegistrationRequired = false;
    let termsOfService;

    try {
      const sendCodeResult = await this.client.invoke(
        new Api.auth.SendCode({
          phoneNumber: this.statistic.phone,
          apiId: this.apiId,
          apiHash: this.apiHash,
          settings: new Api.CodeSettings({
            allowFlashcall: false, // Force SMS by disabling flashcall
            currentNumber: true, // Indicate that the phoneNumber is the current number of the user
            allowAppHash: true,
          }),
        })
      );

      let phoneCodeHash = sendCodeResult["phoneCodeHash"];
      let isCodeViaApp =
        sendCodeResult["type"].className === "auth.SentCodeTypeApp";
      const phoneCode = await this.phoneCode(params.manual ?? false);

      if (phoneCode === null) {
        logErrorToFile(
          { message: "Code is empty" },
          "telegram",
          "error",
          this.email
        );
        // Implement your handling logic here
        return;
      }

      const result = await this.client.invoke(
        new Api.auth.SignIn({
          phoneNumber: this.statistic.phone,
          phoneCodeHash,
          phoneCode,
        })
      );

      if (result instanceof Api.auth.AuthorizationSignUpRequired) {
        isRegistrationRequired = true;
        termsOfService = result.termsOfService;
      }

      if (isRegistrationRequired) {
        let [firstName, lastName] = ["User", ""]; // Replace with logic to get user's first and last names

        const { user } = (await this.client.invoke(
          new Api.auth.SignUp({
            phoneNumber: this.statistic.phone,
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

        logErrorToFile(
          { status: "success", details: { user: this.statistic.phone } },
          "telegram",
          "completed",
          this.email
        );
      } else {
        logErrorToFile(
          { status: "success", details: { user: this.statistic.phone } },
          "telegram",
          "completed",
          this.email
        );
      }
    } catch (err) {
      logErrorToFile(err, "telegram", "error", this.email);

      const errorMessages = [
        "PHONE_CODE_EMPTY",
        "PHONE_CODE_EXPIRED",
        "PHONE_CODE_INVALID",
        "PHONE_NUMBER_INVALID",
        "PHONE_NUMBER_UNOCCUPIED",
        "SIGN_IN_FAILED",
        "PHONE_NUMBER_BANNED",
        "AUTH_KEY_UNREGISTERED",
      ];

      for (const errorMessage of errorMessages) {
        if (err.message.includes(errorMessage)) {
          switch (errorMessage) {
            case "PHONE_NUMBER_BANNED":
            case "PHONE_NUMBER_INVALID":
            case "PHONE_CODE_EMPTY":
              await submitPhone(
                this.statistic.utils.servicePhone,
                this.statistic.utils.phoneId,
                false,
                false
              );
              break;

            case "PHONE_CODE_INVALID":
              await submitPhone(
                this.statistic.utils.servicePhone,
                this.statistic.utils.phoneId,
                false
              );
              break;

            case "AUTH_KEY_UNREGISTERED":
              break;

            default:
              break;
          }
          return false;
        }
      }
      return true;
    }
  }

  private async phoneCode(manual: boolean): Promise<string | null> {
    // if (isCodeViaApp) {
    //   logErrorToFile(new Error("CODE_VIA_APP"), "telegram", "warn", this.email);
    //   this.success = false
    // }
    if (manual === true) {
      const codeGenerator = waitForCode(this.statistic.phone);
      const code = await codeGenerator.next();
      return code.value;
    }
    const code = await getRegistrationCode(this.statistic.utils.servicePhone, {
      id: this.statistic.utils.phoneId,
      phoneNumber: this.statistic.phone,
    });
    if (code === null) {
      logErrorToFile(
        new Error("PHONE_CODE_INVALID"),
        "telegram",
        "warn",
        this.email
      );
      this.success = false;
      // Valid code from SMS
      await submitPhone(
        this.statistic.utils.servicePhone,
        this.statistic.utils.phoneId,
        false
      );
      return null;
    }
    return code.code;
  }

  private async handleError(err: Error): Promise<boolean> {
    // Log the error for debugging
    console.error(err);

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
            logErrorToFile(new Error(errorMessage), "telegram", "warn");
            break;

          case "AUTH_KEY_UNREGISTERED": // Add this case
            // Implement your error handling logic for AUTH_KEY_UNREGISTERED here
            // For example, log the error and retry the registration process
            logErrorToFile(new Error(errorMessage), "telegram", "warn");
            break;

          default:
            logErrorToFile(new Error(errorMessage), "telegram", "warn");
            break;
        }

        // Stop running `autoRegister`
        return true;
      }
    }

    // If we don't recognize the error message, log it and continue running `autoRegister`
    logErrorToFile(
      new Error(`Telegram register error: ${err}`),
      "telegram",
      "warn"
    );
    return false;
  }
}

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
