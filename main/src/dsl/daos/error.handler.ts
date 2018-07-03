import BaseException from "../../exceptions/base";

export default interface ServiceErrorHandler {
    catch(err:BaseException, _req: any, res: any, _next:any): void;
}