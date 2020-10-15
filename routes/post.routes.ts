import { Router, Response, Request } from "express";
import { verificaToken } from "../middlewares/autentication";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../clases/file-system";
const fileSystem = new FileSystem();

const postRoutes = Router();
postRoutes.post('/',[verificaToken],(req: any, res: Response) =>{
    const body = req.body;
    body.usuario = req.usuario._id;
    
    const imagenes = fileSystem.imagenesTempToPost(req.usuario._id);
    body.imgs = imagenes;
    console.log('images: ', imagenes)
    Post.create(body).then(async(postDb) =>{

        await postDb.populate('usuario','-password').execPopulate();
        res.json({
            ok: true,
            post: postDb
        })
    }).catch(err => {
        res.json({
            ok: false,
            post: err
        });
    })

});

postRoutes.get('/',[verificaToken],async (req: any, res: Response) =>{ 
    let  pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({_id:-1})
                            .limit(10)
                            .skip(skip)
                            .populate('usuario','-password')
    
    .exec();
    res.json({
        ok: true,
        pagina,
        posts
    })
});

//servicio para subir archivos
postRoutes.post('/upload',[verificaToken], async (req: any, res: Response) =>{
    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo'
        });
    }
    
    const file: FileUpload = req.files.image;
    if( !file ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo image'
        });
    }

    if( !file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            mensaje: 'No ha subido una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal(file,req.usuario._id);

    
    res.json({
        ok: true,
        file: file.mimetype
        
    })
});

postRoutes.get('/imagen/:userId/:img',(req: any, res: Response) =>{
    const userId = req.params.userId;
    const img = req.params.img;
    
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
   

});
export default postRoutes;