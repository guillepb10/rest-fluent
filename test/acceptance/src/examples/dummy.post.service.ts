import Service from "../../../../main/lib/service";
import DummyResponse from "./dummy.response";
import DummyData from "./dummy.data";

export default class DummyPostService extends Service {

    dummy(data: DummyData){
        return new DummyResponse(`Hello World! This is your ${data.object}`);
    }

    dummyParam(character: string, data: DummyData) {
        return new DummyResponse(`Hello ${character}! This is your ${data.object}`);
    }
}