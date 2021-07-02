const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../DB/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/user';
        //DB
        this.conectarDB();
        // Middlewares
        this.middlewares();
        // Rutas de mi aplicación
        this.routes();
    }
    async conectarDB() {
        await dbConnection();
    }
    middlewares() {
        // CORS
        this.app.use(cors());
        // lectura y Parseo del body
        this.app.use(express.json());
        // Directorio público
        this.app.use(express.static('public'));
    }
    routes() {
        this.app.use(this.usuariosPath, require('../routes/user'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;