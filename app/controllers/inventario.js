import {con} from "../../config/connection.js";
import {siguienteId} from "./counter.js";

export const getInventarios = async (req, res)=>{
    if (!req.rateLimit) return;
    let db = await con();
    let collection = db.collection("inventarios");
    let result = await collection.find({}).toArray();
    res.send(result);
}

export const getInventario = async (req, res)=>{
    if (!req.rateLimit) return;
    const id = Number(req.params.id);
    let db = await con();
    let collection = db.collection("inventarios");
    let result = await collection.find({"id":id}).toArray();
    res.send(result);
}

export const addInventario = async (req, res) => {
    if (!req.rateLimit) return;
    const {ID_BODEGA, ID_PRODUCTO, CREATE_BY, CREATE_AT} = req.body;
    let {CANTIDAD} = req.body
    let db = await con();
    let collection = db.collection("inventarios");
    (CANTIDAD== (undefined || 0))? CANTIDAD: CANTIDAD=10;
    console.log(CANTIDAD);
    const newInventarioId = await siguienteId("inventarios");
    try {
      const result = await collection.insertOne({
        id: newInventarioId,
        id_bodega: ID_BODEGA,
        id_producto: ID_PRODUCTO,
        cantidad: CANTIDAD,
        created_by: CREATE_BY,
        created_at: CREATE_AT
    });
      res.status(201).json({ message: "Inventario added successfully", insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: "Error adding inventario", error: error.message });
    }
}

export const deleteInventario = async (req, res) => {
  if (!req.rateLimit) return;
  const inventarioIdToDelete = Number(req.params.id);
  if (!inventarioIdToDelete) {
    res.status(400).json({ message: "inventario ID not provided" });
    return;
  }

  let db = await con();
  let collection = db.collection("inventarios");

  try {
    const result = await collection.deleteOne({ id: inventarioIdToDelete });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Inventario deleted successfully" });
    } else {
      res.status(404).json({ message: "Inventario not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventario", error: error.message });
  }
}

export const updateInventario = async (req, res) => {
  if (!req.rateLimit) return;
  const {ID_BODEGA, ID_PRODUCTO, CANTIDAD, CREATE_BY, CREATE_AT} = req.body;
  const inventarioIdToUpdate = Number(req.params.id);
  if (!inventarioIdToUpdate) {
    res.status(400).json({ message: "Inventario ID not provided" });
    return;
  }

  const updatedinventarioData = {
    id: Number(req.params.id),
    id_bodega: ID_BODEGA,
    id_producto: ID_PRODUCTO,
    cantidad: CANTIDAD,
    created_by: CREATE_BY,
    created_at: CREATE_AT
};
  if (!updatedinventarioData) {
    res.status(400).json({ message: "Updated inventario data not provided" });
    return;
  }

  let db = await con();
  let collection = db.collection("inventarios");

  try {
    const result = await collection.updateOne(
      { id: inventarioIdToUpdate },
      { $set: updatedinventarioData }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: "Inventario updated successfully" });
    } else {
      res.status(404).json({ message: "Inventario not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating inventario", error: error.message });
  }
}
