import { Server } from 'http';
import * as express from 'express';
import container from './restFluent.inversify';
import { ContainerModule } from 'inversify';

export default class Application {

    private _server: express.Application;
    private _modules: ContainerModule[];
    private _listener: Server | undefined;

    constructor(server: express.Application, modules: ContainerModule[]) {
        this._server = server;
        this._modules = modules;
    }

    start(): void {
        let port = this._server.get("port");        
        this._listener = this._server.listen(port, () => console.log(`Service will be listening on port ${port}`));
    }

    stop(): void {
        if(this._listener){
            this._modules.forEach(m => container.unload(m));  
            this._listener.close(() => console.log('Service has been stopped'));
        }
    }

}