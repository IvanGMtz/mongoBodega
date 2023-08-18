import {con} from "../../config/connection.js";
import {siguienteId} from "./counter.js";

let db = await con();
let collection = db.collection("inventarios");

export const getInventarios = async (req, res)=>{
    if (!req.rateLimit) return;
    let result = await collection.find({}).toArray();
    res.send(result);
}

export const getInventario = async (req, res)=>{
    if (!req.rateLimit) return;
    const id = Number(req.params.id);
    let result = await collection.find({"id":id}).toArray();
    res.send(result);
}

export const deleteInventario = async (req, res) => {
  if (!req.rateLimit) return;
  const inventarioIdToDelete = Number(req.params.id);
  if (!inventarioIdToDelete) {
    res.status(400).json({ message: "inventario ID not provided" });
    return;
  }

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

export const insertOrUpdateInventario = async (req, res) => {
    if (!req.rateLimit) return;
    const requiredFields = [
      { field: "ID_BODEGA", message: "User ID_BODEGA not provided" },
      { field: "ID_PRODUCTO", message: "User ID_PRODUCTO not provided" },
      { field: "CANTIDAD", message: "User CANTIDAD not provided" }
    ];
  
    for (const { field, message } of requiredFields) {
      if (req.body[field] === undefined) {
        return res.status(400).json({ message });
      }
    }
  
    const { ID_BODEGA, ID_PRODUCTO, CANTIDAD, CREATE_BY} = req.body;
  
    try {
      const existingInventario = await collection.findOne({
        id_bodega: ID_BODEGA,
        id_producto: ID_PRODUCTO
      });
  
      if (existingInventario) {
        const updatedCantidad = existingInventario.cantidad + CANTIDAD;
        await collection.updateOne(
          { id_bodega: ID_BODEGA, id_producto: ID_PRODUCTO },
          { $set: { cantidad: updatedCantidad } }
        );
        res.status(200).json({ message: "Inventario updated successfully" });
      } else {
        if (CREATE_BY === undefined) {
          return res.status(400).json({ message: "User CREATE_BY not provided" });
        }
        const newInventarioId = await siguienteId("inventarios");
        await collection.insertOne({
          id: newInventarioId,
          id_bodega: ID_BODEGA,
          id_producto: ID_PRODUCTO,
          cantidad: CANTIDAD,
          created_by: CREATE_BY
        });
        res.status(201).json({ message: "Inventario added successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error inserting/updating inventario", error: error.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0].description });
    }
}
  
  