export function GetRemainDays(currentTime, endTime) {
  const remainTime = endTime - currentTime;

  if (remainTime <= 0) {
    return { day: 0, hour: 0, minute: 0 };
  }

  const day = Math.floor(remainTime / (86400 * 1000));
  const dayTime = remainTime - day * 86400 * 1000;

  const hour = Math.floor(dayTime / (3600 * 1000));
  const minute = Math.floor((dayTime - hour * 3600 * 1000) / (60 * 1000));

  return {
    day,
    hour,
    minute,
  };
}

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

const dateOptionsWithWeekDay = {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
} as const;

const timeOptions = {
  hour12: true,
  hour: "2-digit",
  minute: "2-digit",
} as const;

export const convertDateString = (dateStr) => {
  const stamp = parseDate(dateStr).getTime();
  const date = new Date(stamp);

  return date.toLocaleDateString("en-US", dateOptions);
};

export const convertDateString2 = (dateStr) => {
  const stamp = Date.parse(dateStr);
  const date = new Date(stamp);

  return date.toLocaleDateString("en-US", dateOptions);
};

export const convertDateStringWithWeekDay = (dateStr, toLocal = false) => {
  const stamp = toLocal
    ? convertUTCtoLocalTime(parseDate(dateStr))
    : parseDate(dateStr).getTime();
  const date = new Date(stamp);

  return date.toLocaleDateString("en-US", dateOptionsWithWeekDay);
};

export const convertTimeString = (dateStr, toLocal = false) => {
  const stamp = toLocal
    ? convertUTCtoLocalTime(parseDate(dateStr).getTime())
    : parseDate(dateStr).getTime();

  const date = new Date(stamp);

  if (date === null) {
    return "";
  } else {
    return date.toLocaleDateString("en-US", timeOptions).split(",")[1].trim();
  }
};

export const getHourOffsetLocalTimezone = () => {
  var date = new Date();
  const offset = date.getTimezoneOffset() / 60;

  return offset; // offset Hours: if value is 4, it means UTC-4
};

export const convertUTCtoLocalTime = (utcTime) => {
  return utcTime - getHourOffsetLocalTimezone() * 3600 * 1000;
};

export const parseDate = (str) => {
  const dateStr = str.split(" ")[0];
  const timeStr = str.split(" ")[1];

  const year = Number(dateStr.split("-")[0]);
  const month = Number(dateStr.split("-")[1]) - 1;
  const day = Number(dateStr.split("-")[2]);

  const hour = Number(timeStr.split(":")[0]);
  const minute = Number(timeStr.split(":")[1]);

  return new Date(year, month, day, hour, minute);
};
