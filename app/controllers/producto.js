import {con} from "../../config/connection.js";
import {siguienteId} from "./counter.js";

let db = await con();
let collection = db.collection("productos");

export const getProductos = async (req, res)=>{
    if (!req.rateLimit) return;
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

    let result = await collection.find({"id":id}).toArray();
    res.send(result);
}

export const addProducto = async (req,res) => {
  if (!req.rateLimit) return;

  const requiredFields = [
    { field: "NOMBRE", message: "User NOMBRE not provided" },
    { field: "DESCRIPCION", message: "User DESCRIPCION not provided" },
    { field: "ESTADO", message: "User ESTADO not provided" },
    { field: "CREATE_BY", message: "User CREATE_BY not provided" }
  ];

  for (const { field, message } of requiredFields) {
    if (req.body[field] === undefined) {
      return res.status(400).json({ message });
    }
  }

  const {
    NOMBRE, DESCRIPCION, ESTADO,
    CREATE_BY = 0,
    UPDATE_BY = 0,
    CREATE_AT = "0000-00-00",
    UPDATE_AT = "0000-00-00",
    DELETE_AT = "0000-00-00"
  } = req.body;
  const productoId = await siguienteId("productos");
  const newProducto={
    id: productoId,
    nombre: NOMBRE,
    descripcion:DESCRIPCION,
    estado: ESTADO,
    created_by: CREATE_BY,
    update_by: UPDATE_BY,
    created_at: new Date(CREATE_AT),
    updated_at: new Date(UPDATE_AT),
    deleted_at: new Date(DELETE_AT)
}
  try {
      let result = await collection.insertOne(newProducto);
      const newInventarioId = await siguienteId("inventarios");
      let inventario = db.collection("inventarios");
      await inventario.insertOne({
        id: newInventarioId,
        id_bodega: 1,
        id_producto: productoId,
        cantidad: 10
      })
      res.status(201).json({ message: "Producto added successfully", insertedId: result.insertedId })
  } catch (error) {
    res.status(500).json({ message: "Error adding producto", error: error.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0].description});
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
