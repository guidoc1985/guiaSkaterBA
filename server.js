const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");  
const app = express();
const multer = require('multer');
const path = require("path");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const methodOverride = require('method-override');
const verificarAutenticacion = require("./public/js/auth")
const nodemailer = require("nodemailer");
const { camelize } = require("sequelize/lib/utils");
require('dotenv').config();




app.use(cors());  
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/libs', express.static(path.join(__dirname, 'libs')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectTimeout: 20000, 
    ssl: false 
  };
  


  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('Port:', process.env.DB_PORT);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registrate.html'));
});

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).send('Acceso denegado');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Token no válido');
    }
};

app.get('/spots.html', verificarAutenticacion, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'spots.html')); 
  });


app.get("/api/spots", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT idspots, nonmbre_spot, ST_X(coordenada) AS latitud, ST_Y(coordenada) AS longitud, descripcion, imagen, enlace FROM spots');
        await connection.end();

        const spots = rows.map(row => ({
            id: row.idspots,
            nombre: row.nonmbre_spot,
            coords: [row.latitud, row.longitud],
            descripcion: row.descripcion,
            foto: row.imagen,
            enlace: row.enlace
        }));
        res.json(spots);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los spots" });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT idusuarios, nombre, apellido, email FROM usuarios');
        await connection.end();

        const users = rows.map(row => ({
            id: row.idusuarios,
            nombre: row.nombre,
            apellido: row.apellido,
            email: row.email,
        
        }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

app.get("/api/user/:id", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT idusuarios, nombre, apellido, email FROM usuarios');
        await connection.end();

        const users = rows.map(row => ({
            id: row.idusuarios,
            nombre: row.nombre,
            apellido: row.apellido,
            email: row.email,
        
        }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

app.get("/api/getUser/:id", async (req, res)=>{

    const userId = req.params.id;
    try{
        const connection = await mysql.createConnection(dbConfig)
        const [results]= await connection.execute('SELECT nombre, apellido, email FROM usuarios WHERE idusuarios = ?', [userId]);
        await connection.end()

        if(results.length >0){
            res.json(results[0])

        }else{
            res.status(404).json({error:"usuario no encontrado"})
        }
    }catch (error){
console.error("usuario no encontrado", error)
res.status(500).json({error: "erorr al obtener el usuario"})
    }
    

})

app.get("/api/getSpot/:nombre", async (req, res) => {
    const spotNombre = req.params.nombre.trim();
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute(
            'SELECT nonmbre_spot, ST_AsText(coordenada) AS coordenada, descripcion, imagen, enlace FROM spots WHERE nonmbre_spot = ?',
            [spotNombre]
        );
        await connection.end();

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: "spot no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el spot:", error);
        res.status(500).json({ error: "Error al obtener el spot" });
    }
});



app.post('/users/create', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        const [existingUser] = await connection.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [req.body.email]
        );

        if (existingUser.length > 0) {
            
            await connection.end();
            return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
        }


        const { contraseña } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;

        if (!passwordRegex.test(contraseña)) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos una letra mayúscula y una minúscula.' });
        }

   

        const hashedPassword = await bcrypt.hash(req.body.contraseña, 10);
        const verificationToken = jwt.sign({ email: req.body.email },process.env.JWT_SECRET, { expiresIn: '1h' });
  
        
      
        const [result] = await connection.execute(
            'INSERT INTO usuarios (nombre, apellido, email, contraseña, verificado) VALUES (?, ?, ?, ?, ?)',
            [req.body.nombre, req.body.apellido, req.body.email, hashedPassword, false]
        );

       


        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.GMAIL_USER,
                pass:process.env.GMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const verificationLink = `https://mighty-basin-21232-3982f0b02cea.herokuapp.com/verify?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: req.body.email,
            subject: 'Registro Mapa Skater',
            html: `<p>Por favor, haz clic en el siguiente enlace para verificar tu cuenta e ingresar a MAPA SKATER:</p>
                   <a href="${verificationLink}">Verificar cuenta</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error); 
                return res.status(500).json({ success: false, message: 'Error al enviar el correo de verificación' });
            }
            console.log('Correo enviado:', info.response);
            res.json({ success: true, message: 'Usuario registrado exitosamente' });
        });
  
        await connection.end();
        
       
        
    } catch (error) {
        console.error('Error al cargar el usuario:', error);
        res.status(500).json({ error: 'Error al cargar el usuario', details: error.message });
        
        
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'login.html'));
});


app.get('/verify', async (req, res) => {
    const { token } = req.query;

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const connection = await mysql.createConnection(dbConfig);
        const [user] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (user.length === 0) {
            await connection.end();
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

    
        await connection.execute('UPDATE usuarios SET verificado = ? WHERE email = ?', [true, email]);
        await connection.end();

        const loginLink = "https://mighty-basin-21232-3982f0b02cea.herokuapp.com/login";

     res.send(`Correo verificado con éxito! Ahora podés iniciar sesión en Mapa Skater siguiendo el link. <a href="${loginLink}">Iniciá sesión</a>`);
    } catch (error) {
        console.error('Error al verificar el token', error);
        res.status(400).send('Token inválido o expirado.');
    }
});





app.put('/api/userUpdate/:id', async (req, res) => {
    const userId = req.params.id; 
    const { nombre, apellido, email, contraseña } = req.body; 

    try {
        const connection = await mysql.createConnection(dbConfig);

        
        let query = 'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?';
        let params = [nombre, apellido, email];

        
        if (contraseña) {
            const hashedPassword = await bcrypt.hash(contraseña, 10);
            query += ', contraseña = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE idusuarios = ?'; 
        params.push(userId); 

        
        const [result] = await connection.execute(query, params);

        await connection.end();

        
        if (result.affectedRows > 0) {
            res.json({ message: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });
  
  const upload = multer({ storage: storage });



  app.post("/upload", upload.single("imagen"), async (req,res)=>{
    try{
        if (!req.file) {
            return res.status(400).json({ error: 'La imagen es obligatoria' });
        }
        const connection= await mysql.createConnection(dbConfig);

        const result = await connection.execute(
            'INSERT INTO spots (nonmbre_spot, coordenada, descripcion, imagen, enlace) VALUES (?, POINT(?, ?), ?, ?, ?)',
      [req.body.nonmbre_spot, req.body.lat, req.body.lng, req.body.descripcion, req.file.filename, req.body.enlace]
        );
        await connection.end();
        res.json({ success: true, message: 'spot registrado exitosamente' });
       
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,  
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: 'Nuevo spot creado',
            html: `<p>Se ha creado un nuevo spot con los siguientes detalles:</p>
                   <ul>
                       <li><strong>Nombre del spot:</strong> ${req.body.nonmbre_spot}</li>
                       <li><strong>Descripción:</strong> ${req.body.descripcion}</li>
                       <li><strong>Coordenadas:</strong> ${req.body.lat}, ${req.body.lng}</li>
                   </ul>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error); 
            } else {
                console.log('Correo enviado:', info.response);
            }
        });
        
      } catch (error) {
        console.error('Error al cargar el spot:', error);
        res.status(500).json({ error: 'Error al cargar el spot' });
        
    }
  })

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  //editar spots

  app.put("/api/spotUpdate/:nombre", upload.single("imagen"), async (req, res) => {
    const spotNombre = req.params.nombre;
    const { nonmbre_spot, lat, lng, descripcion, enlace } = req.body;
    const filename = req.file ? req.file.filename : null;

    if (!nonmbre_spot || !lat || !lng || !descripcion || !enlace) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        let query = 'UPDATE spots SET nonmbre_spot = ?, coordenada = ST_PointFromText(?), descripcion = ?, enlace = ? ';
        let params = [nonmbre_spot, `POINT(${lat} ${lng})`, descripcion, enlace];

        if (filename) {
            query += ', imagen = ?';
            params.push(filename);
        }

        query += ' WHERE nonmbre_spot = ?';
        params.push(spotNombre);

        const [result] = await connection.execute(query, params);

        await connection.end();

        if (result.affectedRows > 0) {
            res.json({ message: 'Spot actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Spot no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el spot:', error);
        res.status(500).json({ error: 'Error al actualizar el spot' });
    }
});



  app.post("/api/login", async (req, res) => {
    const { email, contraseña } = req.body;

    console.log("Email:", email, "Contraseña:", contraseña);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (results.length === 0) {
            console.log("Usuario no encontrado");
            return res.status(400).send('Usuario no encontrado');
        }

        const user = results[0];

        if (!user.verificado) {
            return res.status(400).json({ message: 'Debes verificar tu correo antes de iniciar sesión.' });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);

        if (!isMatch) {
            console.log("Contraseña incorrecta");
            return res.status(400).send('Contraseña incorrecta');
        }

        const token = jwt.sign({ id: user.idusuarios, nombre: user.nombre }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        console.log("Login exitoso, enviando token:", token);
        res.json({ token, nombre: user.nombre, idusuarios:user.idusuarios });

        await connection.end();

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});


app.post('/users/recPass', async (req, res) => {
    try {
        const {email}= req.body;
        const connection = await mysql.createConnection(dbConfig);
        
        const [existingUser] = await connection.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (existingUser.length === 0) {
            
            await connection.end();
            return res.status(400).json({ success: false, message: 'correo no registrado' });
        }

        const resetToken = jwt.sign({email},process.env.JWT_SECRET, {expiresIn: "1h"})
         const resetPassLink = `https://mighty-basin-21232-3982f0b02cea.herokuapp.com/resetPass.html?token=${resetToken}`;


        const transporter = nodemailer.createTransport({
            service: 'gmail', // Puedes cambiar el servicio de correo que prefieras
            auth: {
                user:process.env.GMAIL_USER,
                pass:process.env.GMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        
        const mailOptions = {
            from:process.env.GMAIL_USER,
            to: email,
            subject: 'Cambio contraseña Mapa Skater',
            html: `<p>Por favor, hacé clic en el siguiente enlace para cambiar la contraseña de  MAPA SKATER:</p>
                   <a href="${resetPassLink}">Cambiar contraseña</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error); // Agrega esto para ver el error completo
                return res.status(500).json({ success: false, message: 'Error al enviar el correo de verificación' });
            }
            console.log('Correo enviado:', info.response);
            res.json({ success: true, message: 'correo enviado' });
        });
  
        await connection.end();
        
       
        
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ error: 'Error', details: error.message });
        
        
    }
});


app.post("/users/changePassword", async (req, res)=>{
    const {token, newPassword} = req.body;

try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const connection = await mysql.createConnection(dbConfig)

        await connection.execute("UPDATE usuarios SET contraseña = ? WHERE email = ?", [hashedPassword, email])

        await connection.end();
        res.json({ success: true, message: "contraseña actualizada"})
}catch (error){
console.error("error al actualizar contraseña", error)
res.status(400).json({ success: false, message: 'Token inválido o expirado' })
}

})


 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
