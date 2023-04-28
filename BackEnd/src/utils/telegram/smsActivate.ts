import { checkForErrorFromAxiosResponse } from "./smsHandler";
import axios from "axios";

const API_KEYS = {
  sms_man: process.env.SMS_MAN_API_KEY,
  five_sim: process.env.FIVE_SIM_API_KEY,
  sms_activate: process.env.SMS_ACTIVATE_API_KEY,
  sms_activation_service: process.env.SMS_ACTIVATION_SERVICE_API_KEY,
  sms_acktiwator: process.env.SMS_ACKTIWATOR_API_KEY,
};

export type Service =
  | "sms-man"
  | "5sim"
  | "sms-activate"
  | "sms-activation-service"
  | "sms-acktiwator";

type CheckerService = Service | string;

export const serviceList: Service[] = [
  "sms-man",
  "5sim",
  "sms-activate",
  "sms-activation-service",
  "sms-acktiwator",
];

export async function checkService(
  service: CheckerService
): Promise<Service | null> {
  if (!service || !serviceList.includes(service as Service)) {
    return null;
  }

  return service as Service;
}

export async function getTelegramCode(service: Service): Promise<string> {
  switch (service) {
    case "sms-man":
      const response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getServices&api_key=${API_KEYS.sms_man}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      const telegramService = response.data.find(
        (s: any) => s.title === "Telegram"
      );

      return telegramService.id;

    case "5sim":
    case "sms-acktiwator":
      return "telegram";

    case "sms-activate":
    case "sms-activation-service":
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
  let countries: Country[] = [];

  switch (service) {
    case "sms-man":
      response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getCountries&api_key=${API_KEYS.sms_man}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      countries = Object.keys(response.data).map((key) => ({
        id: response.data[key].id,
        name: response.data[key].name,
      }));
      break;
    case "5sim":
      response = await axios.get("https://5sim.biz/v1/guest/countries");

      await checkForErrorFromAxiosResponse(response, service);

      countries = Object.keys(response.data).map((key) => ({
        id: key,
        name: response.data[key].text_en,
      }));
      break;
    case "sms-acktiwator":
      response = await axios.get(
        `https://sms-acktiwator.ru/api/countries/${API_KEYS.sms_acktiwator}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      countries = response.data.map((country: any) => ({
        id: country.code,
        name: country.name,
      }));
      break;
    case "sms-activate":
      response = await axios.get(
        `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getCountries`
      );

      await checkForErrorFromAxiosResponse(response, service);

      countries = Object.keys(response.data).map((key) => ({
        id: response.data[key].id,
        name: response.data[key].rus,
      }));
      break;
    case "sms-activation-service":
      response = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getCountryAndOperators&lang=ru`
      );

      await checkForErrorFromAxiosResponse(response, service);

      countries = response.data.map((country: any) => ({
        id: country.id,
        name: country.name,
      }));
      break;
    default:
      throw new Error("Invalid service.");
  }

  return countries;
}

export async function getBalance(service: Service): Promise<number> {
  let response: any;
  let balance: number;

  switch (service) {
    case "sms-man":
      response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getBalance&api_key=${API_KEYS.sms_man}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      balance = parseFloat(response.data.split(":")[1]);
      break;
    case "5sim":
      response = await axios.get("https://5sim.biz/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${API_KEYS.five_sim}`,
          Accept: "application/json",
        },
      });

      await checkForErrorFromAxiosResponse(response, service);

      balance = response.data.balance;
      break;
    case "sms-acktiwator":
      response = await axios.get(
        `https://sms-acktiwator.ru/api/getbalance/${API_KEYS.sms_acktiwator}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      balance = parseFloat(response.data);
      break;
    case "sms-activate":
      response = await axios.get(
        `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getBalance`
      );

      await checkForErrorFromAxiosResponse(response, service);

      balance = parseFloat(response.data.split(":")[1]);
      break;
    case "sms-activation-service":
      response = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getBalance&lang=ru`
      );

      await checkForErrorFromAxiosResponse(response, service);

      balance = parseFloat(response.data);
      break;
    default:
      throw new Error("Invalid service.");
  }
  return balance;
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
  let phones: Record<string, PhoneInfo> = {};

  switch (service) {
    case "sms-man":
      response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getPrices&api_key=${API_KEYS.sms_man}&country=${country.id}&service=${telegramCode}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      Object.keys(response.data).forEach((key) => {
        phones["telegram"] = {
          cost: parseInt(response.data[key].cost, 10),
          count: parseInt(response.data[key].count, 10),
        };
      });
      break;

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

      phones = {
        telegram: {
          cost: parseInt(response.data.telegram.Price, 10),
          count: parseInt(response.data.telegram.Qty, 10),
        },
      };
      break;

    case "sms-activate":
      response = await axios.get(
        `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getPrices&country=${country.id}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      phones["telegram"] = {
        cost: parseInt(response.data[country.id][telegramCode].cost, 10),
        count: parseInt(response.data[country.id][telegramCode].count, 10),
      };
      break;

    case "sms-acktiwator":
      response = await axios.get(
        `https://sms-acktiwator.ru/api/numbersstatus/${API_KEYS.sms_acktiwator}?code=${country.id}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      response.data.forEach((service: any) => {
        if (service.name.toLowerCase() === telegramCode) {
          phones["telegram"] = {
            cost: parseInt(service.cost, 10),
            count: parseInt(service.count, 10),
          };
        }
      });
      break;

    case "sms-activation-service":
      response = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getServicesAndCost&country=${country.id}&operator=any&lang=en`
      );

      await checkForErrorFromAxiosResponse(response, service);

      response.data.forEach((service: any) => {
        if (service.id.toLowerCase() === telegramCode) {
          phones["telegram"] = {
            cost: parseFloat(service.price),
            count: parseInt(service.quantity, 10),
          };
        }
      });
      break;

    default:
      throw new Error("Invalid service.");
  }

  return phones;
}

export async function rentPhoneRegistration(
  service: Service,
  telegramCode: string,
  country: string
): Promise<{ id: string; phoneNumber: string }> {
  switch (service) {
    case "sms-man":
      const response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getNumber&api_key=${API_KEYS.sms_man}&service=${telegramCode}&country=${country}&ref=${API_KEYS.sms_man}`
      );

      await checkForErrorFromAxiosResponse(response, service);

      const [_, id, number] = response.data.split(":");
      return { id, phoneNumber: number };

    case "5sim":
      const response2 = await axios.get(
        `https://5sim.biz/v1/user/buy/activation/${country}/any/${telegramCode}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEYS.five_sim}`,
            Accept: "application/json",
          },
        }
      );

      await checkForErrorFromAxiosResponse(response2, service);

      return { id: response2.data.id, phoneNumber: response2.data.phone };

    case "sms-activate":
      const response3 = await axios.get(
        `https://sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getNumberV2&service=${telegramCode}&country=${country}`
      );

      await checkForErrorFromAxiosResponse(response3, service);

      return {
        id: response3.data.activationId,
        phoneNumber: response3.data.phoneNumber,
      };

    case "sms-activation-service":
      const response4 = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getNumber&service=${telegramCode}&operator=any&country=${country}&lang=ru`
      );

      await checkForErrorFromAxiosResponse(response4, service);

      const [status, activationId, phoneNumber] = response4.data.split(":");
      if (status === "ACCESS_NUMBER") {
        return { id: activationId, phoneNumber };
      }
      throw new Error(`Failed to rent phone number: ${response4.data}`);

    case "sms-acktiwator":
      const response5 = await axios.get(
        `https://sms-acktiwator.ru/api/getnumber/${API_KEYS.sms_acktiwator}?id=${telegramCode}&code=${country}`
      );

      await checkForErrorFromAxiosResponse(response5, service);

      return { id: response5.data.id, phoneNumber: response5.data.number };

    default:
      throw new Error(`Unsupported service: ${service}`);
  }
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
