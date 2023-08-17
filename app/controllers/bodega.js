import {con} from "../../config/connection.js";
import {siguienteId} from "./counter.js";

export const getBodegas = async (req, res)=>{
    if (!req.rateLimit) return;
    let db = await con();
    let collection = db.collection("bodegas");
    let result = await collection.find({}).sort({ nombre: 1 }).toArray();
    res.send(result);
}

export const getBodega = async (req, res)=>{
    if (!req.rateLimit) return;
    const id = Number(req.params.id);
    let db = await con();
    let collection = db.collection("bodegas");
    let result = await collection.find({"id":id}).toArray();
    res.send(result);
}

export const addBodega = async (req, res) => {
    if (!req.rateLimit) return;
    const {NOMBRE, ID_RESPONSABLE, ESTADO, CREATE_BY, CREATE_AT} = req.body;
    let db = await con();
    let collection = db.collection("bodegas");
    const newbodegaId = await siguienteId("bodegas");    
    try {
      const result = await collection.insertOne({
        id: newbodegaId,
        nombre: NOMBRE,
        id_responsable: ID_RESPONSABLE,
        estado: ESTADO,
        created_by: CREATE_BY,
        created_at: new Date(CREATE_AT)
    });
      res.status(201).json({ message: "Bodega added successfully", insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: "Error adding bodega", error: error.message });
    }
}

export const deleteBodega = async (req, res) => {
  if (!req.rateLimit) return;
  const bodegaIdToDelete = Number(req.params.id);
  if (!bodegaIdToDelete) {
    res.status(400).json({ message: "Bodega ID not provided" });
    return;
  }

  let db = await con();
  let collection = db.collection("bodegas");

  try {
    const result = await collection.deleteOne({ id: bodegaIdToDelete });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Bodega deleted successfully" });
    } else {
      res.status(404).json({ message: "Bodega not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting bodega", error: error.message });
  }
}

export const updateBodega = async (req, res) => {
  if (!req.rateLimit) return;
  const {NOMBRE, ID_RESPONSABLE, ESTADO, CREATE_BY, CREATE_AT} = req.body;
  const bodegaIdToUpdate = Number(req.params.id);
  if (!bodegaIdToUpdate) {
    res.status(400).json({ message: "Bodega ID not provided" });
    return;
  }

  const updatedbodegaData = {
    id: Number(req.params.id),
    nombre: NOMBRE,
    id_responsable: ID_RESPONSABLE,
    estado: ESTADO,
    created_by: CREATE_BY,
    created_at: new Date(CREATE_AT)
};
  if (!updatedbodegaData) {
    res.status(400).json({ message: "Updated bodega data not provided" });
    return;
  }

  let db = await con();
  let collection = db.collection("bodegas");

  try {
    const result = await collection.updateOne(
      { id: bodegaIdToUpdate },
      { $set: updatedbodegaData }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: "Bodega updated successfully" });
    } else {
      res.status(404).json({ message: "Bodega not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating bodega", error: error.message });
  }
}
