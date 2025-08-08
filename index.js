const express= require ('express');
const app = express();
app.use(express.json());
const cors = require ('cors');
app.use (cors());

const mongo= require ('./connection');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


// Obtener las últimas mediciones por id del dispositivo
async function obtenerUltimasMedicionesPorDispositivo(req, res) {
  try {
    const dispositivoId = req.params.id;

    const data = await mongo.mediciones
      .find({ "dispositivos.id": dispositivoId })
      .sort({ fechaHora: -1 })
      .limit(10); 

    res.json(data);
  } catch (err) {
    console.error("Error al obtener mediciones por dispositivo:", err);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
}


  async function obtenerUsuarios(req, res) {
        try {
            const data = await mongo.usuarios.find({});
            res.json(data); 
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    }

    async function obtenerUsuariosId(req, res) {
        try {
            const id = req.params.id;
            const data = await mongo.usuarios.findOne({ _id: id }); 
            res.json(data); 
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    }
    
    
    
    async function insertarUsuarios(req, res) {
        try {
            const data = req.body;
            const datos = await mongo.usuarios.create(data);

            res.json(datos); 
        } catch (err) {
            console.error("Error al insertar datos:", err);   
        }
    }


    async function actualizarDatosUsuarios(req, res) {
        try {
            const ID = req.params.id;
            const datosActualizar = req.body; 
    
            const resultado = await mongo.usuarios.updateOne(
                {_id: ID}, 
                { $set: datosActualizar } 
            );
            res.json(resultado);
        } catch (err) {
            console.error("Error al actualizar datos:", err);
        }
    }
    
    async function eliminarUsuarios(req, res) {
        try {
            const id = req.params.id;
            const resultado = await mongo.usuarios.deleteOne({_id: id});
            res.json(resultado);
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
        }
    }

    //dispositivos

    async function obtenerDispositivos(req, res) {
        try {
            const data = await mongo.dispositivos.find({});
            res.json(data); 
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    }

    async function obtenerDispositivosId(req, res) {
        try {
            const id = req.params.id;
            const data = await mongo.dispositivos.findOne({ id }); 
            res.json(data); 
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    }
    
    
    
    async function insertarDispositivos(req, res) {
        try {
            const data = req.body;
            const datos = await mongo.dispositivos.create(data);

            res.json(datos); 
        } catch (err) {
            console.error("Error al insertar datos:", err);   
        }
    }


    async function actualizarDatosDispositivos(req, res) {
        try {
            const ID = req.params.id;
            const datosActualizar = req.body; 
    
            const resultado = await mongo.dispositivos.updateOne(
                {_id: ID}, 
                { $set: datosActualizar } 
            );
            res.json(resultado);
        } catch (err) {
            console.error("Error al actualizar datos:", err);
        }
    }
    
    async function eliminarDispositivos(req, res) {
        try {
            const id = req.params.id;
            const resultado = await mongo.dispositivos.deleteOne({_id: id});
            res.json(resultado);
        } catch (err) {
            console.error("Error al eliminar dispositivo:", err);
        }
    }

    async function obtenerMediciones(req, res) {
        try {
            const data = await mongo.mediciones.find({});
            res.json(data); 
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    }

        async function obtenerMedicionesId(req, res) {
        try {
            const id = req.params.id;
            const data = await mongo.mediciones.findOne({ _id: id }); 
            res.json(data); 
        } catch (err) {
            console.error("Error al obtener datos:", err);
        }
    }
    
    
    
    async function insertarMediciones(req, res) {
    try {
        const data = req.body;

        
        data.fechaHora = new Date();

        const datos = await mongo.mediciones.create(data);

        res.json(datos);
    } catch (err) {
        console.error("Error al insertar datos:", err);
        res.status(500).json({ error: err.message });
    }
}

    

 async function login(req, res) {
  try {
    const { correo, contrasenia } = req.body;

    
    const usuario = await mongo.usuarios.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    
    if (usuario.contrasenia !== contrasenia) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    
    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    
    res.json({
      token,
      usuarioId: usuario._id,
      correo: usuario.correo
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

app.get("/api/mediciones/ultimasPorDispositivo/:id", obtenerUltimasMedicionesPorDispositivo);

app.post('/api/login', login);

//Api para obtener datos sin filtro
app.get("/api/usuarios/todos", obtenerUsuarios);

//Api para buscar por id 

app.get("/api/usuarios/:id", obtenerUsuariosId);

//Api para insertar registros en mi coleccion
app.post("/api/usuarios/insertar", insertarUsuarios);

//Api para actualizar registros en mi colecion

app.put("/api/usuarios/actualizarUsuarios/:id", actualizarDatosUsuarios);

//Api para eliminar 

app.delete("/api/usuarios/eliminarUsuarios/:id", eliminarUsuarios);

app.get("/api/mediciones/todos", obtenerMediciones);

app.get("/api/mediciones/:id", obtenerMedicionesId)

app.post("/api/mediciones/insertar", insertarMediciones);

app.get("/api/dispositivos/todos", obtenerDispositivos);

//Api para buscar por id 

app.get("/api/dispositivos/:id", obtenerDispositivosId);

//Api para insertar registros en mi coleccion
app.post("/api/dispositivos/insertar", insertarDispositivos);

//Api para actualizar registros en mi colecion

app.put("/api/dispositivos/actualizarUsuarios/:id", actualizarDatosDispositivos);

//Api para eliminar 

app.delete("/api/dispositivos/eliminarUsuarios/:id", eliminarDispositivos);






app.listen(4000,(err)=>{
    console.log("Si escucha el puerto 4000");
})