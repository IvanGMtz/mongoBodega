import { con } from "../../config/connection.js";

export const siguienteId = async (coleccion) => {
  let db = await con();
  const sequenceDocument = await db.collection("counters").findOneAndUpdate(
    { id: `${coleccion}Id` },
    { $inc: { sequence_value: 1 } },
    { returnDocument: "after" }
  );

  return sequenceDocument.sequence_value;
};
