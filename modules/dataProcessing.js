import fetch from "node-fetch";
import fs from "fs";

const saveImages = async (values) => {
  for (const el of values) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    fetch(el)
      .then((res) => {
        const way = fs.createWriteStream(`output/${Date.now()}.jpg`);
        res.body.pipe(way);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const dataExtract = (result) => {
  if (result.error) {
    console.log(`Код ошибки - ${result.error.error_code}`);
    console.log(`Сообщение - ${result.error.error_msg}`);
    console.log(result.error.request_params);
    return;
  }
  if (result.response) {
    const arr = [];
    const items = result.response.items;
    for (const item of items) {
      for (const subitem of item.attachments) {
        if (subitem.type === "photo") {
          let height = 0,
            url;
          for (const img of subitem.photo.sizes) {
            if (img.height > height) {
              height = img.height;
              url = img.url;
            }
          }
          arr.push(url);
          continue;
        }
        if (subitem.type === "doc") {
          arr.push(subitem.doc.url);
        }
      }
    }
    saveImages(arr);
  }
};

const request = (body) => {
  const arr = Object.keys(body);
  let url = "https://api.vk.com/method/wall.get?";
  Object.keys(body).forEach((el, i) => {
    if (i !== arr.length - 1) {
      url = `${url}${el}=${body[el]}&`;
    } else {
      url = `${url}${el}=${body[el]}`;
    }
  });
  fetch(url)
    .then((response) => response.json())
    .then((json) => dataExtract(json))
    .catch((e) => console.log(e));
};

export default request;