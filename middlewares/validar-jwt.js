const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }
    try {
        // console.log(token);
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        //console.log(usuarioAutenticado);
        // console.log(payload);
        // Verificar si el usuario autenticado tiene estado true

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en la BD'
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado false'
            });
        }
        req.uid = uid;
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    validarJWT
}

