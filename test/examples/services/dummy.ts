import { injectable } from "inversify";
import DummyRequest from "./dummy.request";
import { Service } from "../../../src";
import DummyResponse from "./dummy.response";

@injectable()
export default class DummyService extends Service {

    endpoint(): DummyResponse {
        return new DummyResponse('Hello World!!');
    }

    helloName(name: string): DummyResponse {
        return new DummyResponse(`Hello world mr. ${name}`);
    }

    filter(filter: string): DummyResponse {
        return new DummyResponse(`Received filter ${filter}`);
    }

    simplePost(request: DummyRequest): DummyResponse {
        console.log(request);
        return new DummyResponse(request.message);
    }
}