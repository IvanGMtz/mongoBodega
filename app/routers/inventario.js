import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getInventarios, getInventario, addInventario, deleteInventario, updateInventario} from "../controllers/inventario.js"

const appInventario = express.Router();

appInventario.get("/", limitGet(), getInventarios);
appInventario.post("/", limitGet(), addInventario);
appInventario.get("/:id", limitGet(), getInventario);
appInventario.put("/:id", limitGet(), updateInventario);
appInventario.delete("/:id", limitGet(), deleteInventario);

export default appInventario;