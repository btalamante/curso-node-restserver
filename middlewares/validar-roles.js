const { request, response } = require("express")



const esAdminRol = (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el Token primero'
        });
    }
    const { rol, nombre } = req.usuario;
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        })
    }
    next();
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el Token primero'
            });
        }
        const { rol, nombre } = req.usuario;
        console.log(rol);
        console.log(roles);
        if (!roles.includes(rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    esAdminRol,
    tieneRole
}

