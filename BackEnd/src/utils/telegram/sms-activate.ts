import axios from "axios";

const API_KEYS = {
  sms_man: process.env.SMS_MAN_API_KEY,
  five_sim: process.env.FIVE_SIM_API_KEY,
  sms_activate: process.env.SMS_ACTIVATE_API_KEY,
  sms_activation_service: process.env.SMS_ACTIVATION_SERVICE_API_KEY,
  sms_acktiwator: process.env.SMS_ACKTIWATOR_API_KEY,
};

export const serviceList = [
  "sms-man",
  "5sim",
  "sms-activate",
  "sms-activation-service",
  "sms-acktiwator",
];

export type Service =
  | "sms-man"
  | "5sim"
  | "sms-activate"
  | "sms-activation-service"
  | "sms-acktiwator";

export async function getTelegramCode(service: Service): Promise<string> {
  switch (service) {
    case "sms-man":
      const response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getServices&api_key=${API_KEYS.sms_man}`
      );
      const telegramService = response.data.find(
        (s: any) => s.name === "Telegram"
      );
      return telegramService.id;

    case "5sim":
      return "telegram";

    case "sms-acktiwator":
      const response2 = await axios.get(
        `https://sms-acktiwator.ru/api/getservices/${API_KEYS.sms_acktiwator}`
      );
      const telegramService2 = response2.data.find(
        (s: any) => s.name === "Telegram"
      );
      return telegramService2.id;

    case "sms-activate":
      return "tg";

    case "sms-activation-service":
      return "tg";

    default:
      throw new Error(`Unsupported service: ${service}`);
  }
}

interface Country {
  id: string;
  name: string;
}

export async function getCountry(service: Service): Promise<Country[]> {
  let response: any;
  let countries: Country[] = [];

  try {
    switch (service) {
      case "sms-man":
        response = await axios.get(
          `http://api.sms-man.ru/stubs/handler_api.php?action=getCountries&api_key=${API_KEYS.sms_man}`
        );
        countries = response.data.map((country: any) => ({
          id: country.id,
          name: country.name,
        }));
        break;
      case "5sim":
        response = await axios.get("https://5sim.biz/v1/guest/countries");
        countries = Object.keys(response.data).map((key) => ({
          id: key,
          name: response.data[key].text_en,
        }));
        break;
      case "sms-acktiwator":
        response = await axios.get(
          `https://sms-acktiwator.ru/api/countries/${API_KEYS.sms_acktiwator}`
        );
        countries = response.data.map((country: any) => ({
          id: country.code,
          name: country.name,
        }));
        break;
      case "sms-activate":
        response = await axios.get(
          `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getCountries`
        );
        countries = Object.keys(response.data).map((key) => ({
          id: response.data[key].id,
          name: response.data[key].rus,
        }));
        break;
      case "sms-activation-service":
        response = await axios.get(
          `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getCountryAndOperators&lang=ru`
        );
        countries = response.data.map((country: any) => ({
          id: country.id,
          name: country.name,
        }));
        break;
      default:
        throw new Error("Invalid service.");
    }
  } catch (error) {
    console.error("Error fetching countries:", error);
  }

  return countries;
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
      return { id: response2.data.id, phoneNumber: response2.data.phone };

    case "sms-activate":
      const response3 = await axios.get(
        `https://sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=getNumberV2&service=${telegramCode}&country=${country}`
      );
      return {
        id: response3.data.activationId,
        phoneNumber: response3.data.phoneNumber,
      };

    case "sms-activation-service":
      const response4 = await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getNumber&service=${telegramCode}&operator=any&country=${country}&lang=ru`
      );
      const [status, activationId, phoneNumber] = response4.data.split(":");
      if (status === "ACCESS_NUMBER") {
        return { id: activationId, phoneNumber };
      }
      throw new Error(`Failed to rent phone number: ${response4.data}`);

    case "sms-acktiwator":
      const response5 = await axios.get(
        `https://sms-acktiwator.ru/api/getnumber/${API_KEYS.sms_acktiwator}?id=${telegramCode}&code=${country}`
      );
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
          if (response3.data.startsWith("STATUS_OK")) {
            code = response3.data.split(":")[1];
          }
          break;

        case "sms-activation-service":
          const response4 = await axios.get(
            `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=getStatus&id=${rentedPhone.id}&lang=ru`
          );
          if (response4.data.startsWith("STATUS_OK")) {
            code = response4.data.split(":")[1];
          }
          break;

        case "sms-acktiwator":
          const response5 = await axios.get(
            `https://sms-acktiwator.ru/api/getlatestcode/${API_KEYS.sms_acktiwator}?id=${rentedPhone.id}`
          );
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
      await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=setStatus&api_key=${API_KEYS.sms_man}&id=${id}&status=6`
      );
      break;

    case "5sim":
      await axios.get(`https://5sim.biz/v1/user/finish/${id}`, {
        headers: {
          Authorization: `Bearer ${API_KEYS.five_sim}`,
          Accept: "application/json",
        },
      });
      break;

    case "sms-activate":
      await axios.get(
        `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEYS.sms_activate}&action=setStatus&status=6&id=${id}`
      );
      break;

    case "sms-activation-service":
      await axios.get(
        `https://sms-activation-service.com/stubs/handler_api?api_key=${API_KEYS.sms_activation_service}&action=setStatus&id=${id}&status=6&lang=ru`
      );
      break;

    case "sms-acktiwator":
      await axios.get(
        `https://sms-acktiwator.ru/stubs/handler_api.php?api_key=${API_KEYS.sms_acktiwator}&action=setStatus&status=6&id=${id}`
      );
      break;

    default:
      throw new Error(`Unsupported service: ${service}`);
  }
}
