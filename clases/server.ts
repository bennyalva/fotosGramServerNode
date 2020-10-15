import express from 'express';
export default class Server {
    public app: express.Application;
    //public port: number = 9000; for app in ionic 
    public port: number = 3000;// only test

    constructor() {
        this.app = express();
    }
    start(callback: Function){
        this.app.listen(this.port, callback);
    }
}