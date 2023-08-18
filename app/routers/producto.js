import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getProductos, getProducto, addProducto} from "../controllers/producto.js"

const appProducto = express.Router();

appProducto.get("/", limitGet(), getProductos);
appProducto.post("/", limitGet(), addProducto);
appProducto.get("/:id", limitGet(), getProducto);

export default appProducto;