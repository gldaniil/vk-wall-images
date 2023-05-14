import open from "open";
import path from "path";
import express from "express";
import { fileURLToPath } from 'url';
import router from "./routes/index.js";

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

app.listen(PORT, async () => {
  console.log(`Сервер был запущен на ${process.env.DOMAIN}:${PORT}...`);
  await open(`http://localhost:${PORT}/`);
});