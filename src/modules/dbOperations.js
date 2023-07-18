import sqlite3 from "sqlite3";

export async function select(db, domain) {
  return await new Promise((resolve, reject) => {
    db.all(
      `SELECT url FROM history WHERE domain = ?`,
      [domain],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map((row) => row.url));
        }
      }
    );
  });
}

export async function insert(db, domain, url) {
  db.run(
    `INSERT INTO history(domain, url) VALUES(?, ?)`,
    [domain, url],
    (err) => {
      if (err) console.log(err);
    }
  );
}
