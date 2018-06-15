import ServiceErrorHandler from "./daos/error.handler";
import Application from "../application";
import { ContainerModule } from "inversify";
import ServiceParamDefinition from "./daos/param";
import ServiceImplDefinition from "./daos/impl";
import ServiceBodyParamDefinition from "./daos/body.params";

export enum HttpMethod {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
}


export interface ServiceMethodOrPath extends ServiceMethod{
    path(path: string): ServiceMethod;
}

export interface ServiceMethodOrBuildPathOrBuildApi extends ServiceMethod {
    buildPath(): ServiceMethodOrPath;
    buildApi(): ServiceRoot;
}

export interface ServiceMethod {
    get(impl: ServiceImplDefinition, params?: ServiceParamDefinition, path?: string): ServiceMethodOrBuildPathOrBuildApi;
    get(impl: ServiceImplDefinition, params?: ServiceParamDefinition): ServiceMethodOrBuildPathOrBuildApi;

    post(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition, path?: string): ServiceMethodOrBuildPathOrBuildApi;
    post(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition): ServiceMethodOrBuildPathOrBuildApi;

    put(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition, path?: string, ): ServiceMethodOrBuildPathOrBuildApi;
    put(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition): ServiceMethodOrBuildPathOrBuildApi;

    patch(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition, path?: string): ServiceMethodOrBuildPathOrBuildApi;
    patch(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition): ServiceMethodOrBuildPathOrBuildApi;

    delete(impl: ServiceImplDefinition, params: ServiceBodyParamDefinition, path?: string): ServiceMethodOrBuildPathOrBuildApi;
    delete(impl: ServiceImplDefinition, params?: ServiceBodyParamDefinition): ServiceMethodOrBuildPathOrBuildApi;
}

export interface ServiceRoot {
    port(port: number): ServiceRoot;
    errorHandler(handler: ServiceErrorHandler): ServiceRoot;
    api(path: string): ServiceMethodOrPath;        
    build(): Application;
    modules(modules: ContainerModule[]): ServiceRoot;
}

export default interface ServiceBuilder extends ServiceRoot, ServiceMethod, ServiceMethodOrBuildPathOrBuildApi, ServiceMethodOrPath {

}
