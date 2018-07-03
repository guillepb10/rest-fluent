import Service from "../../../../main/lib/service";
import DummyResponse from "./dummy.response";

export default class DummyService extends Service {

    dummy() {
        return new DummyResponse('Hello World!');
    }

    dummyParam(character: string) {
        return new DummyResponse(`Hello ${character}!`);
    }

}