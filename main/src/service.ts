import ServiceBuilder from "./dsl/builder";
import ServiceBuilderImpl from './builder/service';
import { injectable } from "inversify";

@injectable()
export default class Service {

    static builder(): ServiceBuilder {
        return new ServiceBuilderImpl();
    }

}