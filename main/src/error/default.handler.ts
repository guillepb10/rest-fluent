import ServiceErrorHandler from '../dsl/daos/error.handler';
import { Response } from 'express';
import { IncomingMessage } from 'http';

export default class DefaultServiceErrorHandler implements ServiceErrorHandler {
    
    catch(err: IncomingMessage, res: Response): void{
        err;
        res.status(500).send("Internal Server Error");
    }
}