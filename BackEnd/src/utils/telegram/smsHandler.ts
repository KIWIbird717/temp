import { Service } from "./smsActivate";
import { AxiosResponse } from "axios";

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
    ["Отсутствует api ключ", "INVALID_API_KEY"],
  ]),
  "sms-activate": new Map([
    ["BAD_ACTION", "INVALID_ACTION"],
    ["BAD_KEY", "INVALID_API_KEY"],
    ["NO_KEY", "INVALID_API_KEY"],
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

const errorsKeys = {
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

const checkForError = async (
  response: string | object, // Change the type from 'string' to 'string | object'
  service: Service
): Promise<UniversalError | null> => {
  let errorString = "";
  try {
    if (typeof response === "string") {
      errorString = response;
    } else if (
      typeof response === "object" &&
      response.hasOwnProperty("message")
    ) {
      errorString = response["message"];
    }
    const errorList = errorsKeys[service];
    for (const error of errorList) {
      if (errorString.includes(error)) {
        return await mapErrorToUniversalError(service, error);
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const checkForErrorFromAxiosResponse = async (
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

  if (
    response.data &&
    typeof response.data === "object" &&
    response.data.message === "Отсутствует api ключ"
  ) {
    throw new Error(`Service: ${service}, Error: INVALID_API_KEY`);
  }

  const error = await checkForError(response.data, service);
  if (error) {
    throw new Error(`Service: ${service}, Error: ${error}`);
  }
};
