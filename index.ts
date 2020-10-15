import Server from "./clases/server"
import userRoutes from "./routes/usuario";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import postRoutes from "./routes/post.routes";
import fileUpload from 'express-fileupload';

const server = new Server();
const urlDb = 'mongodb://localhost:27017/fotosgram';

//body parser
server.app.use(bodyParser.urlencoded({ extended: true}));
server.app.use(bodyParser.json());

//fileUpload
server.app.use(fileUpload());

//rutas
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

// connect mongo
mongoose.connect(urlDb,
    { useNewUrlParser: true, useCreateIndex: true},
     ( err ) => {
        if ( err ) throw err;
        console.log('base de datos online');
    });

server.start(() =>{
    console.log('Servidor corriendo en puerto',server.port)
});