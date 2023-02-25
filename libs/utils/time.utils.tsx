import { addHours, format } from 'date-fns';

const TimeUtils = {
  formatDate: (
    date: Date | null | undefined | string,
    options?: { noTime?: boolean }
  ): string => {
    if (!date) return '--';
    if (options?.noTime) return format(new Date(date), 'dd/MM/yyyy');
    return format(new Date(date), 'HH:mm:ss dd/MM/yyyy');
  },

  offsetTimeByTimezone: (date: Date | string) => {
    if (!date) date = new Date();

    if (typeof date === 'string') {
      date = new Date(date);
    }

    // get time zone and parse to offset hours
    const timezoneOffset = date.getTimezoneOffset();
    const offsetHours = timezoneOffset / 60;

    // shift time by offset hours
    const gmtTimeConverted = addHours(date, -offsetHours);

    return gmtTimeConverted;
  },

  formatTimeByNumberSeconds: (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    seconds = Math.floor(seconds % 60);

    const hoursString = hours < 10 ? `0${hours}` : hours;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const secondsString = seconds < 10 ? `0${seconds}` : seconds;

    return `${hours ? `${hoursString}:` : ''}${minutesString}:${secondsString}`;
  },
};

export default TimeUtils;
