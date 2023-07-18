import sqlite3 from "sqlite3";
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
import { getDate } from "../js/datetime.js";
import { insert, select } from "./dbOperations.js";

dotenv.config();

const checkDirectory = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, {
      recursive: true,
    });
  }
};

const saveFile = async (urls, domain) => {
  const filePath = `${process.env.FOLDER}/${getDate()}/${domain}`;
  checkDirectory(filePath);
  const db = new sqlite3.Database(process.env.DB_NAME);
  const existingUrls = await select(db, domain);
  for (const url of urls) {
    if (existingUrls.includes(url)) continue;
    await new Promise((resolve) => setTimeout(resolve, 500));
    const fileName = `${filePath}/${Date.now()}.jpg`;
    const response = await fetch(url);
    if (response.status === 200) {
      const way = fs.createWriteStream(fileName);
      response.body.pipe(way);
      await insert(db, domain, url);
    } else break;
  }
  db.close();
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

export default async (body, res) => {
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
  res.send(urls);
  if (urls.length !== 0) {
    saveFile(urls, body.owner_id || body.domain);
  }
};
