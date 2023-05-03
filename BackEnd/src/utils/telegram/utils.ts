import * as puppeteer from "puppeteer";
import * as async from "async";

async function getTelegramVersion(os: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let url: string;
  let versionSelector: string;

  switch (os.toLowerCase()) {
    case "android":
      url =
        "https://play.google.com/store/apps/details?id=org.telegram.messenger";
      versionSelector = "span.htlgb > div:nth-child(1)";
      break;
    case "ios":
      url = "https://apps.apple.com/us/app/telegram-messenger/id686449807";
      versionSelector = "div.whats-new__latest__version";
      break;
    case "windows":
    case "linux":
      url = "https://github.com/telegramdesktop/tdesktop/releases";
      versionSelector = 'a[href*="/telegramdesktop/tdesktop/releases/tag/"]';
      break;
    default:
      await browser.close();
      return "8.0.0";
  }

  await page.goto(url);

  const versionElement = await page.$(versionSelector);
  let versionText = await page.evaluate((el) => el.textContent, versionElement);

  if (os.toLowerCase() === "windows" || os.toLowerCase() === "linux") {
    versionText = versionText.replace("v", "");
  }

  await browser.close();
  return versionText.trim();
}

export function getTelegramVersionSync(os: string): string {
  let version: string;
  async.sync(() => {
    getTelegramVersion(os).then((result) => {
      version = result;
    });
  });
  return version;
}

export function generateRandomPassword(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
