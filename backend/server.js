require('dotenv').config();

const express = require('express');
const cors = require('cors');

require('./config/db');

const usuarioRoutes = require('./routes/usuarios');
const consumoRoutes = require('./routes/consumos');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/consumos', consumoRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
    res.send('Servidor AquaControl funcionando 🚰');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});