import EndpointSpec from "./endpoint";

export default class ServiceSpec {

    port?: number;
    endpoints: EndpointSpec[];
    modules: string[];

    constructor(endpoints: EndpointSpec[], modules: string[]) {
        this.endpoints = endpoints;
        this.modules = modules;
    }

}