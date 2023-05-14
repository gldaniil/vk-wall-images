const getDatetime = () => {
  const dateObj = new Date();

  let hour = dateObj.getHours();
  let minute = dateObj.getMinutes();
  let second = dateObj.getSeconds();

  if (minute < 10) minute = "0" + minute;

  if (second < 10) second = "0" + second;

  return `${hour}:${minute}:${second}`;
};

export default getDatetime