const express = require('express');
const router = express.Router();

const db = require('../config/db');

router.post('/registro', (req, res) => {

    const { nombre, correo, password } = req.body;

    const sql = `
        INSERT INTO usuarios(nombre, correo, password)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [nombre, correo, password], (error, result) => {

        if(error){

            console.log(error);

            res.status(500).json({
                mensaje:'Error registrando usuario'
            });

        } else {

            res.json({
                mensaje:'Usuario registrado correctamente'
            });

        }

    });

});

router.post('/login', (req, res) => {

    const { correo, password } = req.body;

    const sql = `
        SELECT * FROM usuarios
        WHERE correo = ? AND password = ?
    `;

    db.query(sql, [correo, password], (error, result) => {

        if(error){

            console.log(error);

            res.status(500).json({
                mensaje:'Error en login'
            });

        } else {

            if(result.length > 0){

                res.json({
                    mensaje:'Login correcto',
                    usuario: result[0]
                });

            } else {

                res.status(401).json({
                    mensaje:'Correo o contraseña incorrectos'
                });

            }

        }

    });

});

module.exports = router;