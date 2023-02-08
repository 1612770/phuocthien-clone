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
};

export default TimeUtils;
