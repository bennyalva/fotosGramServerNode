"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() {
    }
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            //crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            //Nombre de archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            // mover el archivo a la carpeta temp
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    //no se pudo mover
                    reject(err);
                }
                else {
                    // correcto
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        //se genera path 
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log('path user: ', pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesTempToPost(userId) {
        //se genera path
        const pathUserTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        //se genera path
        const pathUserPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathUserTemp)) {
            console.log('no hay temp');
            return [];
        }
        if (!fs_1.default.existsSync(pathUserPost)) {
            fs_1.default.mkdirSync(pathUserPost);
        }
        const imagenesTemp = this.obtenerImagenesTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathUserTemp}/${imagen}`, `${pathUserPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesTemp(userId) {
        //se genera path
        const patTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(patTemp) || [];
    }
    getFotoUrl(userId, img) {
        //path Post
        //se genera path
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            //se genera path
            return path_1.default.resolve(__dirname, '../assets/no-foto.jpg');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
