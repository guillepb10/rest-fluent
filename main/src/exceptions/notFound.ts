import BaseException from "./base";

export default class NotFoundResourceException extends BaseException {

    constructor() {
        super('Resource Not Found', 404);
    }
}