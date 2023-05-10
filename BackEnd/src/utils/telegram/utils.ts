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

import axios from "axios";

export async function testProxyConnectivity(proxySettings) {
  async function tryProtocol(protocol) {
    try {
      const response = await axios.get("https://api.ipify.org?format=json", {
        proxy: {
          protocol: protocol,
          host: proxySettings.ip,
          port: proxySettings.port,
          auth: {
            username: proxySettings.username,
            password: proxySettings.password,
          },
        },
        timeout: 5000, // Set a short timeout, e.g., 5 seconds
      });

      // If the request is successful, the proxy is working
      return true;
    } catch (error) {
      // If there's an error or timeout, the proxy is not working
      return false;
    }
  }

  // Try SOCKS4 and SOCKS5 protocols
  const protocols = ["socks4", "socks5"];
  for (const protocol of protocols) {
    const isConnected = await tryProtocol(protocol);
    if (isConnected) {
      // If the proxy is working with the current protocol, return true
      return true;
    }
  }

  // If none of the protocols worked, return false
  return false;
}
