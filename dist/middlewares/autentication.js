"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../clases/token"));
exports.verificaToken = (req, res, nex) => {
    const userToken = req.get('x-token') || '';
    token_1.default.compararToken(userToken).then((decoded) => {
        //console.log('decoded: ', decoded);
        req.usuario = decoded.usuario;
        nex();
    }).catch(err => {
        res.json({
            ok: false,
            mensaje: 'Token inválido'
        });
    });
};
