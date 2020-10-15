import {Response, NextFunction} from 'express';
import Token from '../clases/token';
export const verificaToken = (req: any, res: Response, nex: NextFunction) =>{
    const userToken = req.get('x-token') || '';
    Token.compararToken(userToken).then((decoded: any) =>{
        //console.log('decoded: ', decoded);
        req.usuario = decoded.usuario;
        nex();
    }).catch(err =>{
        res.json({
            ok: false,
            mensaje: 'Token inválido'
        });
    }); 
}