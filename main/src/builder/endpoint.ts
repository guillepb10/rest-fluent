import { HttpMethod } from "../dsl/builder";
import Service from "../service";
import ServiceParamDefinition, { ParamMapping } from "../dsl/daos/param";
import ServiceImplDefinition, { Method } from "../dsl/daos/impl";
import ServiceBodyParamDefinition from "../dsl/daos/body.params";

export default class ServiceEndpoint {
    
    readonly path: string;
    readonly method: HttpMethod;
    readonly pathParams?: ParamMapping;
    readonly queryParams?: ParamMapping;
    readonly body?: string;
    implMethod: Method;
    implClass: typeof Service;

    constructor(method: HttpMethod, path: string, impl: ServiceImplDefinition, params: ServiceParamDefinition) {
        this.method = method;
        this.path = path;
        this.implMethod = impl.method;
        this.implClass = impl.class;
        this.pathParams = params.path;
        this.queryParams = params.query;
        if(this.isBodyParam(params)){
            this.body = params.body;
        }
    }

    private isBodyParam(param: ServiceParamDefinition): param is ServiceBodyParamDefinition {
        return 'body' in param;
    }

}