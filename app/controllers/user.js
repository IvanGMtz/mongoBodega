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
    const id = Number(req.params.id);
    let db = await con();
    let collection = db.collection("users");
    let result = await collection.find({"id":id}).toArray();
    res.send(result);
}

export const addUser = async (req, res) => {
    if (!req.rateLimit) return;
    const {NOMBRE, EMAIL, ESTADO, PASSWORD} = req.body;
    let db = await con();
    let collection = db.collection("users");

    const newUserId = await siguienteId("users");
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

export const deleteUser = async (req, res) => {
  if (!req.rateLimit) return;
  const userIdToDelete = Number(req.params.id);
  if (!userIdToDelete) {
    res.status(400).json({ message: "User ID not provided" });
    return;
  }

  let db = await con();
  let collection = db.collection("users");

  try {
    const result = await collection.deleteOne({ id: userIdToDelete });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
}

export const updateUser = async (req, res) => {
  if (!req.rateLimit) return;
  const {NOMBRE, EMAIL, ESTADO, PASSWORD} = req.body;
  const userIdToUpdate = Number(req.params.id);
  if (!userIdToUpdate) {
    res.status(400).json({ message: "User ID not provided" });
    return;
  }

  const updatedUserData = {
    id: Number(req.params.id),
    nombre: NOMBRE,
    email: EMAIL,
    estado: ESTADO,
    password: PASSWORD
};
  if (!updatedUserData) {
    res.status(400).json({ message: "Updated user data not provided" });
    return;
  }

  let db = await con();
  let collection = db.collection("users");

  try {
    const result = await collection.updateOne(
      { id: userIdToUpdate },
      { $set: updatedUserData }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
}
