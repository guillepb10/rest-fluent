import { ContainerModule, interfaces } from "inversify";
import DummyService from "./dummy.service";
import DummyPostService from "./dummy.post.service";

let dummyModule = new ContainerModule((bind: interfaces.Bind) =>{
    bind<DummyService>(DummyService).toSelf();
    bind<DummyPostService>(DummyPostService).toSelf();
});

export { dummyModule };