const express = require('express');
const router = express.Router();

const db = require('../config/db');

router.post('/registrar', (req, res) => {

    const { litros } = req.body;

    const sql = `
        INSERT INTO consumos (usuario_id, litros, fecha)
        VALUES (1, ?, NOW())
    `;

    db.query(sql, [litros], (error, result) => {

        if(error){
            console.log(error);
            res.status(500).json({
                mensaje: 'Error al guardar consumo'
            });
        } else {
            res.json({
                mensaje: 'Consumo registrado correctamente'
            });
        }

    });

});

router.get('/listar', (req, res) => {

    const sql = `
        SELECT * FROM consumos
        ORDER BY fecha DESC
    `;

    db.query(sql, (error, result) => {

        if(error){

            console.log(error);

            res.status(500).json({
                mensaje:'Error obteniendo consumos'
            });

        } else {

            res.json(result);

        }

    });

});

module.exports = router;