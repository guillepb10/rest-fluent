export type ParamMapping = { [id: string]: string };

export default class ServiceParamDefinition {
    
    readonly path?: ParamMapping;
    readonly query?: ParamMapping;
    
    constructor(path?: ParamMapping, query?: ParamMapping){
        this.path = path;
        this.query = query;
    }
    
}