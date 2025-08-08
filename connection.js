const mongoose = require("mongoose");
require ('dotenv').config();

//variable de conexion
const mongoUrl=process.env.MONGO_URL;
mongoose.connect(mongoUrl);
//medicionesSchema
const medicionesSchema = new mongoose.Schema(
    {
        impacto: Boolean,
        gps: {
            latitud:Number,
            longitud: Number,
        },
        fecha: Date,
        id_dispositivo: String
    },
    { versionKey: false }
);
//dispositivos schema
const dispositivosSchema = new mongoose.Schema(
    {
        id: String
    },
    { versionKey: false }
);

const usuariosSchema = new mongoose.Schema(
    {
        nombre: String,
        apellido: String,
        correo: String,
        contrasenia: String,
        tipo: String,
        dispositivos: [String]
    },
    { versionKey: false }
);



module.exports =
{
   mediciones: mongoose.model("mediciones", medicionesSchema), 
   dispositivos: mongoose.model("dispositivos", dispositivosSchema), 
   usuarios: mongoose.model("usuarios", usuariosSchema)

} ;