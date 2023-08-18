import {con} from "../../config/connection.js";
import {siguienteId} from "./counter.js";

let db = await con();
let collection = db.collection("users");

export const getUsers = async (req, res)=>{
    if (!req.rateLimit) return;
    let result = await collection.find({}).toArray();
    res.send(result);
}

export const getUser = async (req, res)=>{
    if (!req.rateLimit) return;
    const id = Number(req.params.id);
    let result = await collection.find({"id":id}).toArray();
    res.send(result);
}

export const addUser = async (req, res) => {
  if (!req.rateLimit) return;

  const requiredFields = [
    { field: "NOMBRE", message: "User NOMBRE not provided" },
    { field: "EMAIL", message: "User EMAIL not provided" },
    { field: "ESTADO", message: "User ESTADO not provided" },
    { field: "PASSWORD", message: "User PASSWORD not provided" }
  ];

  for (const { field, message } of requiredFields) {
    if (req.body[field] === undefined) {
      return res.status(400).json({ message });
    }
  }

  const {
    NOMBRE, EMAIL, ESTADO, PASSWORD,
    CREATE_BY = 0,
    UPDATE_BY = 0,
    CREATE_AT = "0000-00-00",
    UPDATE_AT = "0000-00-00",
    DELETE_AT = "0000-00-00"
  } = req.body;

  const newUserId = await siguienteId("users");
  const newUser = {
    id: newUserId,
    nombre: NOMBRE,
    email: EMAIL,
    estado: ESTADO,
    password: PASSWORD,
    created_by: CREATE_BY,
    update_by: UPDATE_BY,
    created_at: new Date(CREATE_AT),
    updated_at: new Date(UPDATE_AT),
    deleted_at: new Date(DELETE_AT)};
    
  try {
    const result = await collection.insertOne(newUser);
    res.status(201).json({ message: "User added successfully", insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error: error.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0].description});
  }
};


export const deleteUser = async (req, res) => {
  if (!req.rateLimit) return;
  const userIdToDelete = Number(req.params.id);
  if (!userIdToDelete) {
    res.status(400).json({ message: "User ID not provided" });
    return;
  }

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
