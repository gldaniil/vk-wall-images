import fs from "fs";
import path from "path";
import open from "open";
import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import request from "./src/modules/dataProcessing.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "src")));

const checkFolder = () => {
  console.log("Проверяю наличие каталога изображений...");
  fs.access(process.env.FOLDER, (e) => {
    if (e) {
      console.log("Путь не найден, создаю каталог");
      fs.mkdirSync(process.env.FOLDER, (e) => {
        if (e) throw e;
      });
    } else console.log("...каталог на месте");
  });
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

console.log(__dirname);

app.post("/", (req, res) => {
  const body = req.body;
  request(body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Сервер был запущен, порт: ${PORT}...`);
  checkFolder();
  // open(`http://localhost:${PORT}/`);
});
