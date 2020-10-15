"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server = new server_1.default();
const urlDb = 'mongodb://localhost:27017/fotosgram';
//body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//fileUpload
server.app.use(express_fileupload_1.default());
//rutas
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_routes_1.default);
// connect mongo
mongoose_1.default.connect(urlDb, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('base de datos online');
});
server.start(() => {
    console.log('Servidor corriendo en puerto', server.port);
});
