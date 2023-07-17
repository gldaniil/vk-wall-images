import sqlite3 from "sqlite3";
import fs from "fs";

export default (name) => {
  console.log("Проверяю наличие каталога изображений...");
  if (!fs.existsSync(process.env.FOLDER)) {
    fs.mkdirSync(process.env.FOLDER);
    console.log("Путь создан");
  } else {
    console.log("...каталог на месте");
  }

  if (!fs.existsSync(name)) {
    // check the database
    const db = new sqlite3.Database(
      name,
      sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) return console.log(err);
      }
    );
    console.log(`--------------\n${name} создан\n--------------`);
    // close the database connection
    db.close();
  }
};
