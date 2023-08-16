import {con} from "../../config/connection.js";
import {siguienteId} from "./counter.js";

export const getUsers = async (req, res)=>{
    if (!req.rateLimit) return;
    let db = await con();
    let collection = db.collection("users");
    let result = await collection.find({}).toArray();
    res.send(result);
}

export const getUser = async (req, res)=>{
    if (!req.rateLimit) return;
    let id = req.params.id
    let db = await con();
    let collection = db.collection("users");
    let result = await collection.find({"ID":id}).toArray();
    res.send(result);
}
export const addUser = async (req, res) => {
    if (!req.rateLimit) return;
    const {NOMBRE, EMAIL, ESTADO, PASSWORD} = req.body;
    let db = await con();
    let collection = db.collection("users");

    const newUserId = await siguienteId("users");
    console.log(newUserId);

    const newUser = {
        id: newUserId,
        nombre: NOMBRE,
        email: EMAIL,
        estado: ESTADO,
        password: PASSWORD
    };

    try {
      const result = await collection.insertOne(newUser);
      res.status(201).json({ message: "User added successfully", insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: "Error adding user", error: error.message });
    }
}