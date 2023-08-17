import {con} from "../../config/connection.js";
import {siguienteId} from "./counter.js";

export const getProductos = async (req, res)=>{
    if (!req.rateLimit) return;
    let db = await con();
    let collection = db.collection("productos");
    let result = await collection.aggregate([
        {
            $lookup: {
                from: 'inventarios',
                localField: 'id',
                foreignField: 'id_producto',
                as: 'inventarios',
            }
        },
        {
            $unwind: '$inventarios',
        },
        {
            $group: {
                _id: '$_id',
                nombre: { $first: '$nombre' },
                estado: { $first: '$estado' },
                created_by: { $first: '$created_by' },
                total: { $sum: '$inventarios.cantidad' }
            }
        },
        {
            $sort: { total: -1 }
        },
        {
            $project: {
                _id: 0,
                id: 1,
                nombre: 1,
                estado: 1,
                created_by: 1,
                total: 1,
            }
        }
    ]).toArray();
    res.send(result);
}

export const getProducto = async (req, res)=>{
    if (!req.rateLimit) return;
    const id = Number(req.params.id);
    let db = await con();
    let collection = db.collection("productos");
    let result = await collection.find({"id":id}).toArray();
    res.send(result);
}

export const addProducto = async (req, res) => {
    if (!req.rateLimit) return;
    const {NOMBRE, DESCRIPCION, ESTADO, CREATE_BY} = req.body;
    let db = await con();
    let collection = db.collection("productos");
    const newproductoId = await siguienteId("productos");    
    try {
      const result = await collection.insertOne({
        id: newproductoId,
        nombre: NOMBRE,
        descripcion: DESCRIPCION,
        estado: ESTADO,
        created_by: CREATE_BY
    });
      res.status(201).json({ message: "producto added successfully", insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: "Error adding producto", error: error.message });
    }
}

export const deleteProducto = async (req, res) => {
  if (!req.rateLimit) return;
  const productoIdToDelete = Number(req.params.id);
  if (!productoIdToDelete) {
    res.status(400).json({ message: "producto ID not provided" });
    return;
  }

  let db = await con();
  let collection = db.collection("productos");

  try {
    const result = await collection.deleteOne({ id: productoIdToDelete });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Producto deleted successfully" });
    } else {
      res.status(404).json({ message: "Producto not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting producto", error: error.message });
  }
}

export const updateProducto = async (req, res) => {
  if (!req.rateLimit) return;
  const {NOMBRE, DESCRIPCION, ESTADO, CREATE_BY} = req.body;
  const productoIdToUpdate = Number(req.params.id);
  if (!productoIdToUpdate) {
    res.status(400).json({ message: "Producto ID not provided" });
    return;
  }

  const updatedproductoData = {
    id: Number(req.params.id),
    nombre: NOMBRE,
    descripcion: DESCRIPCION,
    estado: ESTADO,
    created_by: CREATE_BY
};
  if (!updatedproductoData) {
    res.status(400).json({ message: "Updated producto data not provided" });
    return;
  }

  let db = await con();
  let collection = db.collection("productos");

  try {
    const result = await collection.updateOne(
      { id: productoIdToUpdate },
      { $set: updatedproductoData }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: "Producto updated successfully" });
    } else {
      res.status(404).json({ message: "Producto not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating producto", error: error.message });
  }
}
