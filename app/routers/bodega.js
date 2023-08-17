import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getBodegas, getBodega, addBodega, deleteBodega, updateBodega} from "../controllers/bodega.js"

const appBodega = express.Router();

appBodega.get("/", limitGet(), getBodegas);
appBodega.post("/", limitGet(), addBodega);
appBodega.get("/:id", limitGet(), getBodega);
appBodega.put("/:id", limitGet(), updateBodega);
appBodega.delete("/:id", limitGet(), deleteBodega);

export default appBodega;