import axios from 'axios';

const apiKey = process.env.FIVESIM_API_KEY;
const baseUrl = 'https://5sim.net/v1';
const telegramServiceName = 'tg';

const getCountries = async () => {
    const response = await axios.get(`${baseUrl}/countries`, { params: { apikey: apiKey } });
    return response.data;
};

const getServices = async (countryCode: string) => {
    const response = await axios.get(`${baseUrl}/services/${countryCode}`, { params: { apikey: apiKey } });
    return response.data;
};

const getPhoneNumber = async (countryCode: string, serviceName: string) => {
    const response = await axios.get(`${baseUrl}/buy`, {
        params: { apikey: apiKey, country: countryCode, service: serviceName },
    });
    return response.data.number;
};

const getSmsCode = async (orderId: number) => {
    const response = await axios.get(`${baseUrl}/status/${orderId}`, { params: { apikey: apiKey } });
    return response.data;
};

export const getTelegramCode = async () => {
    try {
        const countries = await getCountries();
        let countryCode = null;

        for (const country of countries) {
            const services = await getServices(country.code);
            const telegramService = services.find((service: any) => service.service.toLowerCase() === telegramServiceName);
            if (telegramService) {
                countryCode = country.code;
                break;
            }
        }

        if (!countryCode) {
            console.log('Telegram service not available');
            return;
        }

        const order = await getPhoneNumber(countryCode, telegramServiceName);
        console.log('Phone number:', order.number);
        const orderId = order.id;

        let smsCode: string | null = null;
        while (!smsCode) {
            const status = await getSmsCode(orderId);
            if (status.status === 'RECEIVED') {
                smsCode = status.sms;
                console.log('SMS Code:', smsCode);
            } else if (status.status === 'WAITING') {
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
            } else {
                console.log('Error:', status.status);
                return;
            }
        }
    } catch (error) {
        console.error('Error in getTelegramCode:', error);
    }
};
