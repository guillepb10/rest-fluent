import { HttpMethod } from '../../../../../main/lib/dsl/builder';
import ImplSpec from "./impl";
import ParamsSpec from "./params";

export default class EndpointSpec {
    
    method: HttpMethod;
    path: string;
    impl: ImplSpec;
    params?: ParamsSpec;

    constructor(method: HttpMethod, path: string, impl: ImplSpec) {
        this.method = method;
        this.path = path;
        this.impl = impl;
    }

}