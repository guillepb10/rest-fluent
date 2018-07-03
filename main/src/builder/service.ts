import ServiceBuilder, { ServiceRoot, ServiceMethodOrPath, ServiceMethod, ServiceMethodOrBuildPathOrBuildApi, HttpMethod } from '../dsl/builder';
import ServiceErrorHandler from '../dsl/daos/error.handler';
import DefaultServiceErrorHandler from '../error/default.handler';
import ServiceEndpoint from './endpoint';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Application from '../application';
import RouteBuilder from './route';
import { ContainerModule } from 'inversify';
import container from '../restFluent.inversify';
import ServiceParamDefinition from '../dsl/daos/param';
import ServiceImplDefinition from '../dsl/daos/impl';
import ServiceBodyParamDefinition from '../dsl/daos/body.params';
import NotFoundResourceException from '../exceptions/notFound';

export default class ServiceBuilderImpl implements ServiceBuilder {

    private _modules: ContainerModule[] = [];
    private _port: number = 8080;
    private _handler: ServiceErrorHandler= new DefaultServiceErrorHandler();
    private _basePath: string = '/';
    private _endpoints: Array<ServiceEndpoint> = [];

    private _lastPath: string = '';

    port(port: number): ServiceRoot {
        this._port = port;
        return this;
    }

    errorHandler(handler: ServiceErrorHandler): ServiceRoot {
        this._handler = handler;
        return this;
    }

    api(path: string): ServiceMethodOrPath {
        this._basePath = path;
        return this;
    }

    path(path: string): ServiceMethod {
        this._lastPath = path;
        return this;
    }

    buildPath(): ServiceMethodOrPath{
        this._lastPath = '';
        return this;
    }

    get(impl: ServiceImplDefinition, params: ServiceParamDefinition = {}, path: string = ''): ServiceMethodOrBuildPathOrBuildApi {
        this._endpoints.push(new ServiceEndpoint(HttpMethod.GET, this._basePath + this._lastPath + path, impl, params));
        return this;
    }

    post(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition, path: string = ''): ServiceMethodOrBuildPathOrBuildApi {
        this._endpoints.push(new ServiceEndpoint(HttpMethod.POST, this._basePath + this._lastPath + path, impl, params));
        return this;
    }

    put(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition, path: string = ''): ServiceMethodOrBuildPathOrBuildApi {
        this._endpoints.push(new ServiceEndpoint(HttpMethod.PUT, this._basePath + this._lastPath + path, impl, params));
        return this;
    }

    patch(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition, path: string = ''): ServiceMethodOrBuildPathOrBuildApi {
        this._endpoints.push(new ServiceEndpoint(HttpMethod.PATCH, this._basePath + this._lastPath + path, impl, params));
        return this;

    }

    delete(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition, path: string = ''): ServiceMethodOrBuildPathOrBuildApi {
        this._endpoints.push(new ServiceEndpoint(HttpMethod.DELETE, this._basePath + this._lastPath + path, impl, params));
        return this;

    }

    buildApi(): ServiceRoot {
        return this;
    }

    modules(modules: ContainerModule[]): ServiceRoot {
        this._modules = modules;
        return this;
    }

    build(): Application {
        let server: express.Application = express();
        server.set("port", this._port);
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: false }));

        this._modules.forEach( m => container.load(m));
        let routeBuilder: RouteBuilder = new RouteBuilder(server);
        routeBuilder.buildRoutes(this._endpoints);

        // handler no route found
        server.use(function(_req:any, _res: any, next: any){
            next(new NotFoundResourceException());
        });

        // call exception handler
        server.use((err:any, req:any, res:any, next:any) => this._handler.catch(err, req, res, next));
        
        return new Application(server, this._modules);
    }

}