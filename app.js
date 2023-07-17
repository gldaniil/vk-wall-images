import fs from "fs";
import path from "path";
import open from "open";
import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import request from "./src/modules/dataProcessing.js";
import initialization from "./src/modules/initialization.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "src")));

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
  console.log(`Сервер был запущен: http://localhost:${PORT}.`);
  initialization(process.env.DB_NAME);
  // open(`http://localhost:${PORT}/`);
});
