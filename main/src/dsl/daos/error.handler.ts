import { Response } from "express";
import { IncomingMessage } from "http";

export default interface ServiceErrorHandler {
    catch(err: IncomingMessage, res?: Response, next?: Function): void;
}