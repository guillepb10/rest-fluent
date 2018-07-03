import BaseException from "./base";

export default class BadRequestException extends BaseException {
    
    constructor() {
        super('Not a valid request', 400);
    }
}