import { ContainerModule, interfaces } from "inversify";
import DummyService from "../services/dummy";

let DummyModule = new ContainerModule((bind: interfaces.Bind) =>{
    bind<DummyService>(DummyService).toSelf();
});

export default DummyModule;