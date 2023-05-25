import { Authorization } from "./auth";
import { TelegramClient } from "telegram";

class Telegram extends Authorization {
    private client: TelegramClient
    constructor () {
        this.client = new TelegramClient(
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
      
          this.client.setLogLevel(LogLevel.ERROR);
    }
    public changeUsername(username: string) {
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
            username:
            username +
              `_${Math.floor(Math.random() * 100)}`,
          })
        );
    }
}