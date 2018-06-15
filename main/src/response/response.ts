import ResponseBuilder from "./builder";

export default class Response {

    readonly data: Object | undefined;
    readonly status: number = 5;

    static builder() {
        return new ResponseBuilder();
    }
    
}