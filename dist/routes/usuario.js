"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../clases/token"));
const autentication_1 = require("../middlewares/autentication");
const userRoutes = express_1.Router();
userRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'todo funciona bien'
    });
});
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    user_model_1.Usuario.create(user).then(userDb => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDb._id,
            nombre: userDb.nombre,
            email: userDb.email,
            avatar: userDb.avatar
        });
        res.json({
            ok: true,
            mensaje: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: true,
            err
        });
    });
});
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.Usuario.findOne({ email: body.email }, (err, userDb) => {
        if (err)
            throw err;
        if (!userDb) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/constraseña no  son correctas'
            });
        }
        if (userDb.comparaPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDb._id,
                nombre: userDb.nombre,
                email: userDb.email,
                avatar: userDb.avatar
            });
            return res.json({
                ok: true,
                mensaje: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/constraseña no  son correctas **'
            });
        }
    });
});
userRoutes.post('/update', autentication_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar,
    };
    user_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDb) => {
        if (err)
            throw err;
        if (!userDb) {
            return res.json({
                ok: false,
                mensaje: 'No existe el usuario'
            });
        }
        const tokenUser = token_1.default.getJwtToken({
            _id: userDb._id,
            nombre: userDb.nombre,
            email: userDb.email,
            avatar: userDb.avatar
        });
        res.json({
            ok: true,
            mensaje: tokenUser
        });
    });
});
userRoutes.get('/', [autentication_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
