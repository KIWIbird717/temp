import axios from 'axios';

const token = process.env.SMSMAN_TOKEN;
const baseUrl = 'http://api.sms-man.ru';

const getCountries = async () => {
    const response = await axios.get(`${baseUrl}/api/getCountries?token=${token}`);
    return response.data;
};

const getServices = async (countryId: number) => {
    const response = await axios.get(`${baseUrl}/api/getService?token=${token}&country=${countryId}`);
    return response.data;
};

const getPhoneNumber = async (countryId: number, serviceId: number) => {
    const response = await axios.get(`${baseUrl}/api/getNumber?token=${token}&country=${countryId}&service=${serviceId}`);
    return response.data.number;
};

const requestSmsCode = async (orderId: number) => {
    const response = await axios.get(`${baseUrl}/api/setStatus?token=${token}&id=${orderId}&status=1`);
    return response.data;
};

const getSmsCode = async (orderId: number) => {
    const response = await axios.get(`${baseUrl}/api/getStatus?token=${token}&id=${orderId}`);
    return response.data;
};

export const getTelegramCode = async () => {
    try {
        const countries = await getCountries();
        let telegramServiceId = null;
        let countryId = null;

        for (const country of countries) {
            const services = await getServices(country.id);
            const telegramService = services.find((service: any) => service.name.toLowerCase() === 'telegram');
            if (telegramService) {
                telegramServiceId = telegramService.id;
                countryId = country.id;
                break;
            }
        }

        if (!telegramServiceId) {
            console.log('Telegram service not available');
            return;
        }

        const phoneNumber = await getPhoneNumber(countryId, telegramServiceId);
        console.log('Phone number:', phoneNumber);

        const order = await requestSmsCode(phoneNumber);
        const orderId = order.id;

        let smsCode: string | null = null;
        while (!smsCode) {
            const status = await getSmsCode(orderId);
            if (status === 'STATUS_OK') {
                smsCode = status.sms;
                console.log('SMS Code:', smsCode);
            } else if (status === 'STATUS_WAIT_CODE') {
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
            } else {
                console.log('Error:', status);
                return;
            }
        }
    } catch (error) {
        console.error('Error in getTelegramCode:', error);
    }
};
