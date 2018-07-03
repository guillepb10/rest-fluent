export default abstract class BaseException extends Error {
    
    code: number;

    constructor(msg: string, code: number){
        super(msg);
        this.code = code;
    }
}