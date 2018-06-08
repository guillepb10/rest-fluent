import "reflect-metadata"
import { Application, Router, Request, Response } from "express";
import ServiceEndpoint from "./endpoint";
import { HttpMethod } from "../dsl/builder";
import container from "../restFluent.inversify";
import BadRequestException from "../exceptions/badRequest";
import { ParamMapping } from "../dsl/daos/param";
import { Method } from "../dsl/daos/impl";
import { NextFunction } from "express-serve-static-core";
import Service from "../service";

const PATH_PARAM_NAME_EXP: string = '[A-Za-z0-9_-]+';
const TS_NAMES: string = '[A-Za-z][A-Za-z0-9_]+';

export default class RouteBuilder {

    private _server: Application;

    constructor(server: Application) {
        this._server = server;
    }

    buildRoutes(endpoints: ServiceEndpoint[]) {
        let router: Router = Router();
        this._server.use('/', router);
        for (const endpoint of endpoints) {
            this.route(endpoint, router);
        }
    }

    private route(endpoint: ServiceEndpoint, router: Router): void {
        let args = this.getMethodArgs(endpoint.implMethod);
        let [pathMatcher, paramsIdx] = this.pathMatcher(endpoint, args);
        let impl = container.get(endpoint.implClass);

        if (endpoint.method === HttpMethod.GET) {
            router.get(pathMatcher, (req, res, next) => {
                this.handleRequest(req, res, next, args, endpoint, pathMatcher, paramsIdx, impl);
            });
        } else if (endpoint.method === HttpMethod.POST) {
            router.post(pathMatcher, (req, res, next) => {
                this.handleRequest(req, res, next, args, endpoint, pathMatcher, paramsIdx, impl);
            });
        } else if (endpoint.method === HttpMethod.PUT) {
            router.put(pathMatcher, (req, res, next) => {
                this.handleRequest(req, res, next, args, endpoint, pathMatcher, paramsIdx, impl);
            });

        } else if (endpoint.method === HttpMethod.DELETE) {
            router.delete(pathMatcher, (req, res, next) => {
                this.handleRequest(req, res, next, args, endpoint, pathMatcher, paramsIdx, impl);
            });
        } else if (endpoint.method === HttpMethod.PATCH) {
            router.patch(pathMatcher, (req, res, next) => {
                this.handleRequest(req, res, next, args, endpoint, pathMatcher, paramsIdx, impl);
            });
        }
    }

    private handleRequest(req: Request, res: Response, next: NextFunction, argNames: string[], endpoint: ServiceEndpoint, pathMatcher: RegExp, paramsIdx: { [id: number]: number }, impl: Service) {
        let argValues = this.validateQueryParams(req.query, argNames, endpoint.queryParams);
        this.concatPathParams(req, pathMatcher, paramsIdx, argValues);
        if(endpoint.body){
            let body = argNames.findIndex(arg => arg === endpoint.body);
            argValues[body] = req.body;
        }
        try {
            res.json(endpoint.implMethod.apply(impl, argValues));
        } catch (e) {
            next(e);
        }
    }

    private concatPathParams(req: Request, pathMatcher: RegExp, paramsIdx: { [id: number]: number }, values: any[]) {
        req.path.match(pathMatcher);
        let groups = pathMatcher.exec(req.path);
        if (groups) {
            for (let i = 0; i < Object.keys(paramsIdx).length; i++) {
                values[paramsIdx[i]] = groups[i + 1];
            }
        }
    }

    private validateQueryParams(request: any, implArgs: string[], definition?: ParamMapping): any[] {
        let values = Array(implArgs.length);
        if (definition) {
            for (const reqParam of Object.keys(request)) {
                if (!(reqParam in definition)) {
                    throw new BadRequestException(`Unknown query param ${reqParam}`);
                } else {
                    let implArgIdx = implArgs.findIndex(arg => arg === definition[reqParam]);
                    values[implArgIdx] = request[reqParam];
                }
            }
            return values;
        } else if (Object.keys(request).length > 0) {
            throw new BadRequestException(`Unknown query params ${Object.keys(request)}`);
        }
        return values;
    }

    private pathMatcher(endpoint: ServiceEndpoint, args: string[]): [RegExp, { [id: number]: number }] {
        let [regexp, idxParams] = [`^${endpoint.path}$`, Object()];
        let params = endpoint.path.match(new RegExp(`\\\{${PATH_PARAM_NAME_EXP}\\\}`, "g"));
        if (params) {
            let idx = 0;
            for (const param of params) {
                regexp = regexp.replace(param, `(${PATH_PARAM_NAME_EXP})`);
                if (endpoint.pathParams) {
                    let pathParams = endpoint.pathParams;
                    idxParams[idx++] = args.findIndex(arg => arg === pathParams[param.substr(1, param.length - 2)]);
                } else {
                    throw new BadRequestException('Path param not found in definition');
                }
            }
        }
        return [new RegExp(regexp), idxParams];
    }

    private getMethodArgs(method: Method): string[] {
        let signature: string = method.toString().substr(0, method.toString().indexOf('\n')).replace(/\s/g, '');
        let regexp = new RegExp(`(${TS_NAMES})(\\\((${TS_NAMES},?)*\\\))\\\{?`, "g");
        signature.match(regexp);
        let groups = regexp.exec(signature);
        if (groups) {
            let args = groups[2].substr(1, groups[2].length - 2).split(',');
            return args;
        } else {
            return [];
        }
    }
}