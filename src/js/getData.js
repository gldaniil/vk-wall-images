const getTime = () => {
  const dateObj = new Date();

  let hour = dateObj.getHours();
  let minute = dateObj.getMinutes();
  let second = dateObj.getSeconds();

  if (hour < 10) hour = "0" + hour;

  if (minute < 10) minute = "0" + minute;

  if (second < 10) second = "0" + second;

  return `${hour}:${minute}:${second}`;
};

export default getTime