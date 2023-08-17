import express from "express";
import {limitGet} from "../middlewares/limit.js";
import {getUsers, getUser, addUser, deleteUser, updateUser} from "../controllers/user.js"

const appuser = express.Router();

appuser.get("/", limitGet(), getUsers);
appuser.post("/", limitGet(), addUser);
appuser.get("/:id", limitGet(), getUser);
appuser.put("/:id", limitGet(), updateUser);
appuser.delete("/:id", limitGet(), deleteUser);

export default appuser;