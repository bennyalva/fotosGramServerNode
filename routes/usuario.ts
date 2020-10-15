import { Router, Request, Response } from "express";
import { Usuario } from "../models/user.model";
import bcrypt from 'bcrypt';
import Token from "../clases/token";
import { verificaToken } from "../middlewares/autentication";

const userRoutes = Router();

userRoutes.get('/prueba',(req: Request, res: Response)=>{
    res.json({
        ok:true,
        mensaje: 'todo funciona bien'
    })

});

userRoutes.post('/recievefile',(req: Request, res: Response)=>{
    console.log('body: ', req.body)
    res.json({
        ok:true,
        mensaje: 'todo funciona bien'
    })

});

userRoutes.post('/create', (req: Request, res: Response) => {
   
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10),
        avatar: req.body.avatar

    };

    Usuario.create(user).then( userDb => {
        const tokenUser = Token.getJwtToken({
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
            ok:true,
            err
        }) 
    })
    
});

userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    Usuario.findOne({email: body.email} ,(err, userDb) =>{
        if( err) throw err;
        if( !userDb) {
            return res.json({
                ok:false,
                mensaje: 'Usuario/constraseña no  son correctas'
            });
        }

        if( userDb.comparaPassword(body.password)) {
            const tokenUser = Token.getJwtToken({
                _id: userDb._id,
                nombre: userDb.nombre,
                email: userDb.email,
                avatar: userDb.avatar
            });

           return res.json({
                ok: true,
                mensaje: tokenUser
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/constraseña no  son correctas **'
            });
        }
    });

  
    
});

userRoutes.post('/update',verificaToken, (req: any, res: Response) => { 
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar,
    };

    Usuario.findByIdAndUpdate(req.usuario._id, user,{new: true},(err, userDb)=>{
        if(err) throw err;
        if(!userDb) {
            return res.json({
                ok: false,
                mensaje: 'No existe el usuario'
            });
        }

        const tokenUser = Token.getJwtToken({
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

userRoutes.get('/',[verificaToken], (req: any, res: Response) =>{
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});

export default userRoutes;