import { Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';
import e from 'express';

const usuarioSchema = new Schema({
   nombre:{
    type: String,
    required:[true, 'El nombre es necesario']
   },
   avatar: {
       type: String,
       default: 'av-1.png'
   } ,
   email: {
       type: String,
       unique: true,
       required: [ true, 'El correo es necesario']
   },
   password: {
       type: String,
        required: [true, 'La contraseña es necesaria']
   }
});

usuarioSchema.method('comparaPassword', function(password: string = ''): boolean {
if(bcrypt.compareSync( password, this.password)){
    return true;
}else{
    return false;
}
});

interface Iusuario extends Document {
    nombre: string,
    email: string,
    password: string,
    avatar: string

    comparaPassword(password: string): boolean;
}
export const Usuario = model<Iusuario>('Usuario', usuarioSchema);