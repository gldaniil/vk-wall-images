export const getTime = () => {
  const date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  if (hour < 10) hour = "0" + hour;

  if (minute < 10) minute = "0" + minute;

  if (second < 10) second = "0" + second;

  return `${hour}:${minute}:${second}`;
};

export const getDate = () => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();

  if (month < 10) month = `0${++month}`;

  if (day < 10) day = `0${month}`;

  return `${day}-${month}-${year}`;
};
