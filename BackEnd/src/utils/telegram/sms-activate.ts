import axios, { AxiosResponse } from "axios";

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

interface Country {
  id: string;
  name: string;
}

export async function getTelegramCode(service: Service): Promise<string> {
  switch (service) {
    case "sms-man":
      const response = await axios.get(
        `http://api.sms-man.ru/stubs/handler_api.php?action=getServices&api_key=${API_KEYS.sms_man}`
      );

      await checkForErrorFromAxiosResponse(response, service);

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

      await checkForErrorFromAxiosResponse(response2, service);

      const telegramService2 = response2.data.find(
        (s: any) => s.name === "Telegram"
      );
      return telegramService2.id;

    case "sms-activate":
    case "sms-activation-service":
      return "tg";

    default:
      throw new Error(`Unsupported service: ${service}`);
  }
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

export type UniversalError =
  | "INVALID_API_KEY"
  | "NO_NUMBERS_AVAILABLE"
  | "INSUFFICIENT_BALANCE"
  | "INVALID_ACTIVATION"
  | "INVALID_STATUS"
  | "INVALID_ACTION"
  | "SYSTEM_ERROR"
  | "UNKNOWN_ERROR";

const errorApiMap: Record<Service, Map<string, UniversalError>> = {
  "sms-man": new Map([
    ["BAD_KEY", "INVALID_API_KEY"],
    ["NO_NUMBERS", "NO_NUMBERS_AVAILABLE"],
    ["NO_BALANCE", "INSUFFICIENT_BALANCE"],
    ["NO_ACTIVATION", "INVALID_ACTIVATION"],
    ["BAD_STATUS", "INVALID_STATUS"],
  ]),
  "5sim": new Map([
    ["Status Code: 401 Unauthorized", "INVALID_API_KEY"],
    ["Status Code 400: order not found", "INVALID_ACTIVATION"],
    ["Status Code 400: order expired", "INVALID_ACTIVATION"],
    ["Status Code 400: order has sms", "INVALID_STATUS"],
    ["Status Code 400: hosting order", "INVALID_ACTION"],
    ["Status Code 400: order no sms", "INVALID_STATUS"],
    ["Status Code: 500 internal error", "SYSTEM_ERROR"],
    ["no free phones", "NO_NUMBERS_AVAILABLE"],
    ["select operator", "INVALID_ACTION"],
    ["not enough user balance", "INSUFFICIENT_BALANCE"],
    ["bad country", "INVALID_ACTION"],
    ["bad operator", "INVALID_ACTION"],
    ["server offline", "SYSTEM_ERROR"],
    ["not enough rating", "UNKNOWN_ERROR"],
    ["no product", "INVALID_ACTION"],
    ["reuse not possible", "INVALID_ACTION"],
    ["reuse false", "INVALID_ACTION"],
    ["reuse expired", "INVALID_ACTION"],
    ["Status Code: 400 country is incorrect", "INVALID_ACTION"],
    ["Status Code: 400 product is incorrect", "INVALID_ACTION"],
  ]),
  "sms-activation-service": new Map([
    ["NO_BALANCE", "INSUFFICIENT_BALANCE"],
    ["NO_NUMBERS", "NO_NUMBERS_AVAILABLE"],
    ["ACCESS_CANCEL", "INVALID_ACTIVATION"],
    ["ACCESS_RETRY_GET", "UNKNOWN_ERROR"],
    ["ACCESS_ACTIVATION", "UNKNOWN_ERROR"],
    ["CANNOT_BEFORE_2_MIN", "UNKNOWN_ERROR"],
    ["STATUS_WAIT_CODE", "UNKNOWN_ERROR"],
    ["STATUS_CANCEL", "INVALID_ACTIVATION"],
    ["BAD_ACTION", "INVALID_ACTION"],
    ["BAD_KEY", "INVALID_API_KEY"],
    ["BAD_LANG", "UNKNOWN_ERROR"],
    ["NO_ACTIVATION", "INVALID_ACTIVATION"],
    ["ERROR_SQL", "SYSTEM_ERROR"],
    ["ERROR_API", "SYSTEM_ERROR"],
  ]),
  "sms-acktiwator": new Map([
    ["101", "INVALID_ACTION"],
    ["102", "INSUFFICIENT_BALANCE"],
    ["103", "NO_NUMBERS_AVAILABLE"],
    ["201", "UNKNOWN_ERROR"],
    ["202", "INVALID_API_KEY"],
    ["203", "UNKNOWN_ERROR"],
  ]),
  "sms-activate": new Map([
    ["BAD_ACTION", "INVALID_ACTION"],
    ["BAD_KEY", "INVALID_API_KEY"],
    ["BAD_SERVICE", "INVALID_ACTION"],
    ["BAD_STATUS", "INVALID_STATUS"],
    ["ERROR_SQL", "SYSTEM_ERROR"],
    ["OPERATORS_NOT_FOUND", "UNKNOWN_ERROR"],
    ["NO_ACTIVATIONS", "UNKNOWN_ERROR"],
    ["NO_ACTIVATION", "INVALID_ACTIVATION"],
    ["BANNED", "UNKNOWN_ERROR"],
    ["WRONG_EXCEPTION_PHONE", "INVALID_ACTION"],
    ["RENEW_ACTIVATION_NOT_AVAILABLE", "INVALID_ACTION"],
    ["WRONG_ACTIVATION_ID", "INVALID_ACTION"],
    ["NEW_ACTIVATION_IMPOSSIBLE", "INVALID_ACTION"],
    ["NO_BALANCE", "INSUFFICIENT_BALANCE"],
    ["INVALID_ACTIVATION_ID", "INVALID_ACTIVATION"],
  ]),
};

const mapErrorToUniversalError = async (
  service: Service,
  error: string
): Promise<UniversalError> => {
  return errorApiMap[service].get(error) || "UNKNOWN_ERROR";
};

const checkForError = async (
  response: string,
  service: Service
): Promise<UniversalError | null> => {
  const errors = {
    "sms-man": [
      "BAD_KEY",
      "NO_NUMBERS",
      "NO_BALANCE",
      "NO_ACTIVATION",
      "BAD_STATUS",
    ],
    "5sim": [
      "Status Code: 401 Unauthorized",
      "Status Code 400: order not found",
      "Status Code 400: order expired",
      "Status Code 400: order has sms",
      "Status Code 400: hosting order",
      "Status Code 400: order no sms",
      "Status Code: 500 internal error",
      "no free phones",
      "select operator",
      "not enough user balance",
      "bad country",
      "bad operator",
      "server offline",
      "not enough rating",
      "no product",
      "reuse not possible",
      "reuse false",
      "reuse expired",
      "Status Code: 400 country is incorrect",
      "Status Code: 400 product is incorrect",
    ],
    "sms-activation-service": [
      "NO_BALANCE",
      "NO_NUMBERS",
      "ACCESS_CANCEL",
      "ACCESS_RETRY_GET",
      "ACCESS_ACTIVATION",
      "CANNOT_BEFORE_2_MIN",
      "STATUS_WAIT_CODE",
      "STATUS_CANCEL",
      "BAD_ACTION",
      "BAD_KEY",
      "BAD_LANG",
      "NO_ACTIVATION",
      "ERROR_SQL",
      "ERROR_API",
    ],
    "sms-acktiwator": ["101", "102", "103", "201", "202", "203"],
    "sms-activate": [
      "BAD_ACTION",
      "BAD_KEY",
      "BAD_SERVICE",
      "BAD_STATUS",
      "ERROR_SQL",
      "OPERATORS_NOT_FOUND",
      "NO_ACTIVATIONS",
      "NO_ACTIVATION",
      "BANNED",
      "WRONG_EXCEPTION_PHONE",
      "RENEW_ACTIVATION_NOT_AVAILABLE",
      "WRONG_ACTIVATION_ID",
      "NEW_ACTIVATION_IMPOSSIBLE",
      "NO_BALANCE",
      "INVALID_ACTIVATION_ID",
    ],
  };
  const errorList = errors[service];

  try{
    for (const error of errorList) {
      if (response.includes(error)) {
        return await mapErrorToUniversalError(service, error);
      }
    }
  } catch {return null;}

  return null;
};

const checkForErrorFromAxiosResponse = async (
  response: AxiosResponse,
  service: Service
): Promise<void> => {
  if (response.status !== 200) {
    const error = await mapErrorToUniversalError(
      service,
      `Status Code: ${response.status}`
    );
    if (error !== "UNKNOWN_ERROR") {
      throw new Error(`Service: ${service}, Error: ${error}`);
    } else {
      throw new Error("SYSTEM_ERROR");
    }
  }

  console.log(response.data)

  const error = await checkForError(response.data, service);
  if (error) {
    throw new Error(`Service: ${service}, Error: ${error}`);
  }
};
