import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const saveImages = async (values) => {
  if (values.length !== 0) {
    for (const el of values) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      fetch(el)
        .then((res) => {
          const fileName = `${process.env.FOLDER}/${Date.now()}.jpg`;
          const way = fs.createWriteStream(fileName);
          res.body.pipe(way);
        })
        .catch((err) => {
          console.error(err);
        });
    }
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
            { height: process.env.MIN_HEIGHT }
          );
          return bestSize.url;
        }
      });
    return arr.filter(Boolean);
  }
};

async function fetchVKData(url) {
  const response = await fetch(url);
  const json = await response.json();
  const result = await dataExtract(json);
  return result;
}

export default async (body) => {
  const arr = Object.keys(body);
  const params = arr.map((el, i) => {
    if (i !== arr.length - 1) {
      return `${el}=${body[el]}&`;
    } else {
      return `${el}=${body[el]}`;
    }
  });
  const url = `https://api.vk.com/method/wall.get?${params.join("")}`;
  const urls = await fetchVKData(url);
  saveImages(urls);
  return urls.length;
};
