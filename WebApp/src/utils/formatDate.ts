
/**
 * Returns formated date `dd month в hh:mm`
 */
export const formatDate = (date: Date): string => {
  const options: any = { month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric' };
  return new Intl.DateTimeFormat('ru-US', options).format(date);
}
