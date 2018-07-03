import ServiceParamDefinition, { ParamMapping } from "./param";

export default class ServiceBodyParamDefinition extends ServiceParamDefinition {
    
    readonly body?: string;

    constructor(body?: string, path?: ParamMapping, query?: ParamMapping) {
        super(path, query);
        this.body = body;
    }

}