import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getUsers, getUser, addUser} from "../controllers/user.js"

const appuser = express.Router();

appuser.get("/", limitGet(), getUsers);
appuser.post("/", limitGet(), addUser);
appuser.get("/:id", limitGet(), getUser);

export default appuser;