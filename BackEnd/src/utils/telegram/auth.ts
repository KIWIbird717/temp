import { logErrorToFile } from "../errorHandler";
import type { WaitingForVerify, AuthInterface } from "./telegram";
import { TelegramClient } from "telegram";
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

export class Authorization {
private email: string;
public success: boolean; 
public statistic: AuthInterface;
private client: TelegramClient

  constructor(mail: string, clienter: TelegramClient) {
    this.email = mail;
    this.success = true;
    this.client = clienter
  }



  private async phoneCode(
    isCodeViaApp: boolean,
    manual: boolean
  ): Promise<string | null> {
    if (isCodeViaApp) {
      logErrorToFile(new Error("CODE_VIA_APP"), "telegram", "warn", this.email);
      this.success = false
      return null;
    }
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
      this.success = false
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
    logErrorToFile(new Error(`Telegram register error: ${err}`), "telegram", "warn");
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
