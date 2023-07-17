import fs from "fs";
import path from "path";
import open from "open";
import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

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

app.listen(PORT, () => {
  console.log(`Сервер был запущен, порт: ${PORT}...`);
  checkFolder();
  // open(`http://localhost:${PORT}/`);
});
