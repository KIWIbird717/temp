import { Service, getTelegramCode, rentPhoneRegistration } from "./sms-activate";

export async function registerTelegram(
  service: Service,
  country: string,
  count: number
) {
  const telegramCode = await getTelegramCode(service);
  const rentedPhones = await Promise.all(
    Array.from({ length: count }, async () => {
      return await rentPhoneRegistration(service, telegramCode, country);
    })
  );
}