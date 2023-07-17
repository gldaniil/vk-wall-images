import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const saveImages = async (values) => {
  for (const el of values) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    fetch(el)
      .then((res) => {
        const way = fs.createWriteStream(
          `${process.env.FOLDER}/${Date.now()}.jpg`
        );
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
    const arr = result.response.items
      .flatMap((item) => item.attachments)
      .filter((subitem) => subitem.type === "photo" || subitem.type === "doc")
      .map((subitem) => {
        if (subitem.type === "doc") {
          return subitem.doc.url;
        }
        if (subitem.type === "photo") {
          const bestSize = subitem.photo.sizes.reduce(
            (acc, img) => (img.height > acc.height ? img : acc),
            { height: process.env.MINHEIGHT }
          );
          return bestSize.url;
        }
      });
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
