export const generateRandomNumber = (num: number): string => {
  const randomNum1 = Math.floor(Math.random() * 1000).toString().padStart(num, '0')
  return `${randomNum1}`
}

export const generateRandomResting = (): string => {
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${randomNum}`
}

export const generateRandomName = () => {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Isabella', 'James']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor']
  const randomIndex1 = Math.floor(Math.random() * firstNames.length);
  const randomIndex2 = Math.floor(Math.random() * lastNames.length);
  const firstName = firstNames[randomIndex1];
  const lastName = lastNames[randomIndex2];
  return `${firstName} ${lastName}`;
}

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const generateRandomCountry = (): string => {
  const countries = ['USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'France', 'Germany', 'Italy', 'Spain', 'China'];
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
}

function formatDate(date: Date): string {
  const options: any = { month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric' };
  return new Intl.DateTimeFormat('ru-US', options).format(date);
}

export const generateRandomDate = (startYear: number, endYear: number): string => {
  const year = Math.floor(Math.random() * 100) + 1920;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 31) + 1;
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return formatDate(new Date(year, month - 1, day, hours, minutes))
}

export const generateRandomStatus = (): string => {
  const options = ['работает', 'не работает']
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}