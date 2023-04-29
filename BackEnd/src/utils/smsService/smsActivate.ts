import { checkForErrorFromAxiosResponse } from "./smsHandler";
import axios from "axios";

const API_KEYS = {
  sms_man: process.env.SMS_MAN_API_KEY,
  five_sim: process.env.FIVE_SIM_API_KEY,
  sms_activate: process.env.SMS_ACTIVATE_API_KEY,
  sms_activation_service: process.env.SMS_ACTIVATION_SERVICE_API_KEY,
  sms_acktiwator: process.env.SMS_ACKTIWATOR_API_KEY,
  sms_hub: process.env.SMS_HUB_API_KEY,
  vak_sms: process.env.VAK_SMS_API_KEY,
};

export type Service =
  | "sms-man"
  | "5sim"
  | "sms-activate"
  | "sms-activation-service"
  | "sms-acktiwator"
  | "sms-hub"
  | "vak-sms";

export const serviceList: Service[] = [
  "sms-man",
  "5sim",
  "sms-activate",
  "sms-activation-service",
  "sms-acktiwator",
  "sms-hub",
  "vak-sms",
];

export async function getTelegramCode(service: Service): Promise<string> {
  switch (service) {
    case "sms-man":
      const response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getServices&api_key=${API_KEYS.sms_man}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return response.data.find((s: any) => s.title === "Telegram").id;

    case "5sim":
    case "sms-acktiwator":
      return "telegram";

    case "sms-activate":
    case "sms-activation-service":
    case "sms-hub":
    case "vak-sms":
      return "tg";

    default:
      throw new Error(`Unsupported service: ${service}`);
  }
}

export interface Country {
  id: string;
  name?: string;
}

export async function getCountry(service: Service): Promise<Country[]> {
  let response: any;

  switch (service) {
    case "sms-man":
      response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getCountries&api_key=${API_KEYS.sms_man}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return Object.values(response.data).map((country: any) => ({
        id: country.id,
        name: country.name,
      }));

    case "5sim":
      response = await axios.get("https://5sim.biz/v1/guest/countries");

      await checkForErrorFromAxiosResponse(response, service);

      return Object.entries(response.data).map(([key, value]: any) => ({
        id: key,
        name: value.text_en,
      }));

    case "sms-acktiwator":
      response = await axios.get(
        `https://sms-acktiwator.ru/api/countries/${API_KEYS.sms_acktiwator}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return response.data.map((country: any) => ({
        id: country.code,
        name: country.name,
      }));

    case "sms-activate":
      response = await axios.get(
        `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getCountries`
      );
      await checkForErrorFromAxiosResponse(response, service);
      return Object.values(response.data).map((country: any) => ({
        id: country.id,
        name: country.rus,
      }));

    case "sms-activation-service":
      response = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getCountryAndOperators&lang=ru`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return response.data.map((country: any) => ({
        id: country.id,
        name: country.name,
      }));

    default:
      throw new Error("Invalid service.");
  }
}

export async function getBalance(service: Service): Promise<number> {
  let response: any;

  switch (service) {
    case "sms-man":
      response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getBalance&api_key=${API_KEYS.sms_man}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return parseFloat(response.data.split(":")[1]);

    case "5sim":
      response = await axios.get("https://5sim.biz/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${API_KEYS.five_sim}`,
          Accept: "application/json",
        },
      });

      await checkForErrorFromAxiosResponse(response, service);

      return response.data.balance;

    case "sms-acktiwator":
      response = await axios.get(
        `https://sms-acktiwator.ru/api/getbalance/${API_KEYS.sms_acktiwator}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return parseFloat(response.data);

    case "sms-activate":
      response = await axios.get(
        `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getBalance`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return parseFloat(response.data.split(":")[1]);

    case "sms-activation-service":
      response = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getBalance&lang=ru`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return parseFloat(response.data);

    case "sms-hub":
      response = await axios.get(
        `https://smshub.org/stubs/handler_api.php?api_key=${API_KEYS.sms_hub}&action=getBalance`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return parseFloat(response.data.split(":")[1]);

    case "vak-sms":
      response = await axios.get(
        `https://vak-sms.com/api/getBalance/?apiKey=${API_KEYS.vak_sms}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return response.data.balance;

    default:
      throw new Error("Invalid service.");
  }
}

export interface PhoneInfo {
  cost: number;
  count: number;
}

export async function getAvailablePhones(
  service: Service,
  country: Country
): Promise<Record<string, PhoneInfo>> {
  const telegramCode = await getTelegramCode(service);
  let response: any;

  switch (service) {
    case "sms-man":
      response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getPrices&api_key=${API_KEYS.sms_man}&country=${country.id}&service=${telegramCode}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return {
        telegram: {
          cost: parseInt(response.data[telegramCode].cost, 10),
          count: parseInt(response.data[telegramCode].count, 10),
        },
      };

    case "5sim":
      response = await axios.get(
        `https://5sim.biz/v1/guest/products/${country.id}/any`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      await checkForErrorFromAxiosResponse(response, service);

      return {
        telegram: {
          cost: parseInt(response.data.telegram.Price, 10),
          count: parseInt(response.data.telegram.Qty, 10),
        },
      };

    case "sms-activate":
      response = await axios.get(
        `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getPrices&country=${country.id}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      return {
        telegram: {
          cost: parseInt(response.data[country.id][telegramCode].cost, 10),
          count: parseInt(response.data[country.id][telegramCode].count, 10),
        },
      };

    case "sms-acktiwator":
      response = await axios.get(
        `https://sms-acktiwator.ru/api/numbersstatus/${API_KEYS.sms_acktiwator}?code=${country.id}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      const telegramService = response.data.find(
        (service: any) => service.name.toLowerCase() === telegramCode
      );

      return {
        telegram: {
          cost: parseInt(telegramService.cost, 10),
          count: parseInt(telegramService.count, 10),
        },
      };

    case "sms-activation-service":
      response = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getServicesAndCost&country=${country.id}&operator=any&lang=en`
      );

      await checkForErrorFromAxiosResponse(response, service);

      const tgService = response.data.find(
        (service: any) => service.id.toLowerCase() === telegramCode
      );

      return {
        telegram: {
          cost: parseFloat(tgService.price),
          count: parseInt(tgService.quantity, 10),
        },
      };

    // Cost is rounded value
    case "sms-hub":
      response = await axios.get(
        `https://smshub.org/stubs/handler_api.php?api_key=${API_KEYS.sms_hub}&action=getPrices&service=${telegramCode}&country=${country.id}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      const smsHubData: Record<string, number> =
        response.data[country.id][telegramCode];
      const totalPhones: number = Object.values(smsHubData).reduce(
        (sum: number, count: number) => sum + count,
        0
      );
      const averageCost: number =
        Object.keys(smsHubData).reduce(
          (sum: number, price: string) =>
            sum + parseFloat(price) * smsHubData[price],
          0
        ) / totalPhones;
      const roundedCost: number = Math.round(averageCost * 100) / 100;

      let lowestPriceOver20 = Number.MAX_VALUE;
      for (const price in smsHubData) {
        const count = smsHubData[price];
        if (count > 20 && parseFloat(price) < lowestPriceOver20) {
          lowestPriceOver20 = parseFloat(price);
        }
      }

      return {
        telegram: {
          cost:
            lowestPriceOver20 === Number.MAX_VALUE
              ? roundedCost
              : lowestPriceOver20,
          count: totalPhones,
        },
      };

    case "vak-sms":
      response = await axios.get(
        `https://vak-sms.com/api/getCountNumberList/?apiKey=${API_KEYS.vak_sms}&country=${country.id}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      const vakTelegramService = response.data[telegramCode];

      return {
        telegram: {
          cost: parseFloat(vakTelegramService.price),
          count: parseInt(vakTelegramService.count, 10),
        },
      };

    default:
      throw new Error("Invalid service.");
  }
}

export async function rentPhoneRegistration(
  service: Service,
  telegramCode: string,
  country: string
): Promise<{ id: string; phoneNumber: string }> {
  const serviceUrls = {
    "sms-man": `http://api.sms-man.ru/stubs/handler_api.php?action=getNumber&api_key=${API_KEYS.sms_man}&service=${telegramCode}&country=${country}&ref=${API_KEYS.sms_man}`,
    "5sim": `https://5sim.biz/v1/user/buy/activation/${country}/any/${telegramCode}`,
    "sms-activate": `https://sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getNumberV2&service=${telegramCode}&country=${country}`,
    "sms-activation-service": `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getNumber&service=${telegramCode}&operator=any&country=${country}&lang=ru`,
    "sms-acktiwator": `https://sms-acktiwator.ru/api/getnumber/${API_KEYS.sms_acktiwator}?id=${telegramCode}&code=${country}`,
    "sms-hub": `https://smshub.org/stubs/handler_api.php?api_key=${API_KEYS.sms_hub}&action=getNumber&service=${telegramCode}&country=${country}`,
    "vak-sms": `https://vak-sms.com/api/getNumber/?apiKey=${API_KEYS.vak_sms}&service=${telegramCode}&country=${country}`,
  };

  const url = serviceUrls[service];
  if (!url) {
    throw new Error(`Unsupported service: ${service}`);
  }

  let response;
  if (service === "5sim") {
    response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_KEYS.five_sim}`,
        Accept: "application/json",
      },
    });
  } else {
    response = await axios.get(url);
  }

  await checkForErrorFromAxiosResponse(response, service);

  let id, phoneNumber;
  switch (service) {
    case "sms-man":
    case "sms-hub":
      [, id, phoneNumber] = response.data.split(":");
      break;

    case "5sim":
      id = response.data.id;
      phoneNumber = response.data.phone;
      break;

    case "sms-activate":
      id = response.data.activationId;
      phoneNumber = response.data.phoneNumber;
      break;

    case "sms-activation-service":
      const [status, activationId, phone] = response.data.split(":");
      if (status === "ACCESS_NUMBER") {
        id = activationId;
        phoneNumber = phone;
      } else {
        throw new Error(`Failed to rent phone number: ${response.data}`);
      }
      break;

    case "sms-acktiwator":
      id = response.data.id;
      phoneNumber = response.data.number;
      break;

    case "vak-sms":
      id = response.data.idNum;
      phoneNumber = response.data.tel.toString();
      break;

    default:
      throw new Error(`Unsupported service: ${service}`);
  }

  return { id, phoneNumber };
}

export async function getRegistrationCodes(
  service: Service,
  rentedPhones: Array<any>
): Promise<{ [phone: string]: string }> {
  const codes: { [phone: string]: string } = {};

  for (const rentedPhone of rentedPhones) {
    let code: string | null = null;
    let attempts = 0;

    while (!code && attempts < 6) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      attempts++;

      switch (service) {
        case "sms-man":
          const response = await axios.get(
            `http://api.sms-man.ru/stubs/handler_api.php?action=getStatus&api_key=${API_KEYS.sms_man}&id=${rentedPhone.id}`
          );

          await checkForErrorFromAxiosResponse(response, service);

          if (response.data.startsWith("STATUS_OK")) {
            code = response.data.split(":")[1];
          }
          break;
        case "5sim":
          const response2 = await axios.get(
            `https://5sim.biz/v1/user/check/${rentedPhone.id}`,
            {
              headers: {
                Authorization: `Bearer ${API_KEYS.five_sim}`,
                Accept: "application/json",
              },
            }
          );

          await checkForErrorFromAxiosResponse(response2, service);

          if (
            response2.data.status === "RECEIVED" &&
            response2.data.sms &&
            response2.data.sms.length > 0
          ) {
            code = response2.data.sms[0].code;
          }
          break;

        case "sms-activate":
          const response3 = await axios.get(
            `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getStatus&id=${rentedPhone.id}`
          );

          await checkForErrorFromAxiosResponse(response3, service);

          if (response3.data.startsWith("STATUS_OK")) {
            code = response3.data.split(":")[1];
          }
          break;

        case "sms-activation-service":
          const response4 = await axios.get(
            `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getStatus&id=${rentedPhone.id}&lang=ru`
          );

          await checkForErrorFromAxiosResponse(response4, service);

          if (response4.data.startsWith("STATUS_OK")) {
            code = response4.data.split(":")[1];
          }
          break;

        case "sms-acktiwator":
          const response5 = await axios.get(
            `https://sms-acktiwator.ru/api/getlatestcode/${API_KEYS.sms_acktiwator}?id=${rentedPhone.id}`
          );

          await checkForErrorFromAxiosResponse(response5, service);

          if (response5.data) {
            code = response5.data;
          }
          break;

        default:
          throw new Error(`Unsupported service: ${service}`);
      }

      if (!code) {
        await submitPhone(service, rentedPhone.id);
      } else {
        codes[rentedPhone.phoneNumber] = code;
      }
    }
  }

  return codes;
}

async function submitPhone(
  service: Service,
  id: string | number
): Promise<void> {
  switch (service) {
    case "sms-man":
      const response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=setStatus&api_key=${API_KEYS.sms_man}&id=${id}&status=6`
      );

      await checkForErrorFromAxiosResponse(response, service);

      break;

    case "5sim":
      const response2 = await axios.get(
        `https://5sim.biz/v1/user/finish/${id}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEYS.five_sim}`,
            Accept: "application/json",
          },
        }
      );

      await checkForErrorFromAxiosResponse(response2, service);

      break;

    case "sms-activate":
      const response3 = await axios.get(
        `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=setStatus&status=6&id=${id}`
      );

      await checkForErrorFromAxiosResponse(response3, service);

      break;

    case "sms-activation-service":
      const response4 = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=setStatus&id=${id}&status=6&lang=ru`
      );

      await checkForErrorFromAxiosResponse(response4, service);

      break;

    case "sms-acktiwator":
      const response5 = await axios.get(
        `https://sms-acktiwator.ru/stubs/handler_api.php?api_key=${API_KEYS.sms_acktiwator}&action=setStatus&status=6&id=${id}`
      );

      await checkForErrorFromAxiosResponse(response5, service);

      break;

    default:
      throw new Error(`Unsupported service: ${service}`);
  }
}
