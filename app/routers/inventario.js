import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getInventarios, getInventario, insertOrUpdateInventario} from "../controllers/inventario.js"

const appInventario = express.Router();

appInventario.get("/", limitGet(), getInventarios);
appInventario.post("/", limitGet(), insertOrUpdateInventario);
appInventario.get("/:id", limitGet(), getInventario);

export default appInventario;