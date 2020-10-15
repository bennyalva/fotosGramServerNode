import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
export default class FileSystem {

    constructor(){
       
    }

    guardarImagenTemporal(file: FileUpload, userId: string){

        return new Promise((resolve, reject) =>{
              //crear carpetas
            const path = this.crearCarpetaUsuario(userId);

            //Nombre de archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            
            // mover el archivo a la carpeta temp
            file.mv(`${path}/${nombreArchivo}`, (err: any) =>{
                if( err){
                    //no se pudo mover
                    reject(err);
                }else{
                    // correcto
                    resolve();
                }
            });
        });
      
    }

    private generarNombreUnico(nombreOriginal: string){
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length -1];

        const idUnico = uniqid();
        return `${idUnico}.${extension}`;

    }
    private crearCarpetaUsuario(userId: string){
        //se genera path 
        const pathUser = path.resolve(__dirname,'../uploads/', userId);
        const pathUserTemp = pathUser+'/temp';

       // console.log('path user: ', pathUser);

        const existe = fs.existsSync(pathUser);
         if(!existe){
             fs.mkdirSync(pathUser);
             fs.mkdirSync(pathUserTemp);
         }

         return pathUserTemp;
    }
    imagenesTempToPost(userId: string){
        //se genera path
        const pathUserTemp = path.resolve(__dirname,'../uploads/',userId,'temp');
        //se genera path
        const pathUserPost = path.resolve(__dirname,'../uploads/',userId,'posts');
        if (!fs.existsSync(pathUserTemp)){
            console.log('no hay temp');
            return [];
        }
        if(!fs.existsSync(pathUserPost)){
            fs.mkdirSync(pathUserPost);
    
        }
        const imagenesTemp = this.obtenerImagenesTemp(userId);
        imagenesTemp.forEach(imagen =>{
            fs.renameSync(`${pathUserTemp}/${imagen}`,`${pathUserPost}/${imagen}`)
        });

        return imagenesTemp;
    }
   private obtenerImagenesTemp(userId: string) {
       //se genera path
       const patTemp = path.resolve(__dirname,'../uploads/',userId,'temp');
       return fs.readdirSync(patTemp) || [];
    }

    getFotoUrl(userId: any, img: any) {
        //path Post
        //se genera path
        const pathFoto = path.resolve(__dirname,'../uploads', userId,'posts',img);
        const existe = fs.existsSync(pathFoto);
        if(!existe){
            //se genera path
            return path.resolve(__dirname,'../assets/no-foto.jpg');
        }
        return pathFoto;

    }
}