import Service from "../../service";

export type Method = (...args: any[]) => any;

export default class ServiceImplDefinition {

    readonly class: typeof Service;
    readonly method: Method;

    constructor(service: typeof Service, method: Method) {
        this.class = service;
        this.method = method;
    }
}