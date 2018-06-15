export default class BadRequestException {
    constructor(message: string) {
        Error.apply(this, message);
    }
}