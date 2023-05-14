import express from "express";
import request from "../modules/dataProcessing.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Параметры парсера",
  });
});

router.post("/", (req, res) => {
  const body = req.body;
  request(body);
  res.sendStatus(200);
});

export default router;