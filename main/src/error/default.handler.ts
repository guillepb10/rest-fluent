import ServiceErrorHandler from '../dsl/daos/error.handler';
import BaseException from '../exceptions/base';

export default class DefaultServiceErrorHandler implements ServiceErrorHandler {
    
    catch(err:BaseException, _req: any, res: any, _next:any): void{
        res.status(err.code).send(err.message);
    }
}