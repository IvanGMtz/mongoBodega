import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getBodegas, addBodega} from "../controllers/bodega.js"

const appBodega = express.Router();

appBodega.get("/", limitGet(), getBodegas);
appBodega.post("/", limitGet(), addBodega);

export default appBodega;