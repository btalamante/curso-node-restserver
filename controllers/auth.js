const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - correo' });
        }
        //verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - estado: false' });
        }
        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - password' });
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSiginin = async (req = request, res = response) => {
    const { id_token } = req.body;
    // console.log(id_token);
    // console.log(req);
    const { correo, nombre, img } = await googleVerify(id_token);
    //Usuario de Google verificado correctamente
    //console.log(googleUser);

    try {
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario(data);
            //console.log(usuario);
            await usuario.save();
        }
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es reconocido'
        });
    }

}

module.exports = {
    login,
    googleSiginin
}