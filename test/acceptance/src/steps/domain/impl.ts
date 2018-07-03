export default class ImplSpec {

    class: string;
    method: string;

    constructor(service: string, method: string) {
        this.class = service;
        this.method = method;
    }

}