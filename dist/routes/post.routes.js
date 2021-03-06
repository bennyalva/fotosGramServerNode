"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autentication_1 = require("../middlewares/autentication");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../clases/file-system"));
const fileSystem = new file_system_1.default();
const postRoutes = express_1.Router();
postRoutes.post('/', [autentication_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesTempToPost(req.usuario._id);
    body.imgs = imagenes;
    console.log('images: ', imagenes);
    post_model_1.Post.create(body).then((postDb) => __awaiter(this, void 0, void 0, function* () {
        yield postDb.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDb
        });
    })).catch(err => {
        res.json({
            ok: false,
            post: err
        });
    });
});
postRoutes.get('/', [autentication_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .limit(10)
        .skip(skip)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
//servicio para subir archivos
postRoutes.post('/upload', [autentication_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No ha subido una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
postRoutes.get('/imagen/:userId/:img', (req, res) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;
