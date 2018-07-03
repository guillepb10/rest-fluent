import {Given, When, Then} from 'cucumber';
import axios from 'axios';
import { expect } from 'chai';
import { dataHolder } from './domain/data.holder';
import ImplSpec from './domain/impl';
import ServiceSpec from './domain/service';
import ServiceImplDefinition from '../../../../main/lib/dsl/daos/impl';
import Service from '../../../../main/lib/service';
import Application from '../../../../main/lib/application';
import { ServiceMethodOrPath, ServiceMethodOrBuildPathOrBuildApi, HttpMethod} from '../../../../main/lib/dsl/builder';

Given('a service {string} with following spec:', (key: string, specDef: string) => {
    let spec: ServiceSpec = JSON.parse(specDef);
    let builder: any = Service.builder();   
    
    if(spec.port){
        builder = builder.port(spec.port);
    } 
    builder = builder.api('');
    spec.endpoints.forEach((endpoint:Object) => builder = composeEndpoint(builder, endpoint));
        
    builder = builder.modules(spec.modules.map(mod => dataHolder.get(mod)));
    
    dataHolder.put(key, builder.build());
});

When("i start service {string}", (key: string) => {
    let service = dataHolder.get(key);
    if(service instanceof Application) {
        (service as Application).start();
    } else {
        throw Error(`${key} is not a valid service`);
    }
});

When("i fetch url {string} and get response into {string}", (url: string, key: string) => {
    return axios.get(url)
        .then((response:any) => {
            dataHolder.put(key, response);
        })
        .catch((error:any) => {
            dataHolder.put(key, error.response);
        });
});

When("i fetch url {string} with {string} method and {string} data and get response into {string}", (url: string, method: HttpMethod, data: string, key: string)=> {
    let result;
    data = JSON.parse(data.replace(/'/g, '"'));

    if(method === HttpMethod.GET) {
        throw new Error('GET method does not allow body params');
    } else if(method === HttpMethod.POST) {
        result = axios.post(url, data);
    } else if(method === HttpMethod.PUT) {
        result = axios.put(url, data);
    } else if(method === HttpMethod.PATCH) {
        result = axios.patch(url, data);
    } else if(method === HttpMethod.DELETE) {
        throw new Error('DELETE method does not allow body params');
    }

    return result && result.then((response:any) => {
            dataHolder.put(key, response);
        })
        .catch((error:any) => {
            dataHolder.put(key, error.response);
        });
}) 

When("i fetch url {string} with {string} method and get response into {string}", (url: string, method: HttpMethod, key: string) => {
    let result;
    
    if(method === HttpMethod.GET) {
        result = axios.get(url);
    } else if(method === HttpMethod.POST) {
        result = axios.post(url);
    } else if(method === HttpMethod.PUT) {
        result = axios.put(url);
    } else if(method === HttpMethod.PATCH) {
        result = axios.patch(url);
    } else if(method === HttpMethod.DELETE) {
        result = axios.delete(url);
    }

    return result && result.then((response:any) => {
            dataHolder.put(key, response);
        })
        .catch((error:any) => {
            dataHolder.put(key, error.response);
        });
});

Then("i check {string} is a successfull response", key => {
    let response = dataHolder.get(key);
    expect(response).to.have.property('status').equals(200);
});

Then("i check {string} response code is equal to {int}", (key, status) => {
    let response = dataHolder.get(key);
    expect(response).to.have.property('status').equals(status);
});

Then("i check {string} has field {string} equals to {string}", (key: string, field: string, value: string) => {
    let obj = dataHolder.get(key);
    expect(obj.data).to.has.property(field, value);
});

Then("i stop service {string}", (key: string) => {
    let service = dataHolder.get(key);
    if(service instanceof Application) {
        (service as Application).stop();
    } else {
        throw Error(`${key} is not a valid service`);
    }
});


let composeEndpoint = function(builder: ServiceMethodOrPath, endpoint: any): ServiceMethodOrBuildPathOrBuildApi {
    let impl = retrieveImpl(endpoint.impl);

    if(endpoint.method === HttpMethod.GET) {
        return builder.get(impl, endpoint.params, endpoint.path);
    } else if(endpoint.method === HttpMethod.POST) {
        if(endpoint.params && endpoint.params.body){
            return builder.post(impl, endpoint.params, endpoint.path);
        } else {
            throw Error('Post method requires body param');
        }
    } else if(endpoint.method === HttpMethod.PATCH) {
        if(endpoint.params && endpoint.params.body){
            return builder.patch(impl, endpoint.params, endpoint.path);
        } else {
            throw Error('Patch method requires body param');
        }
    } else if(endpoint.method === HttpMethod.DELETE) {
        if(endpoint.params){
            return builder.delete(impl, endpoint.params, endpoint.path);
        } else {
            throw Error('Delete method requires any param');
        }
    } else if(endpoint.method === HttpMethod.PUT) {
        if(endpoint.params){
            return builder.put(impl, endpoint.params, endpoint.path);
        } else {
            throw Error('Delete method requires any param');
        } 
    } else {
        throw Error('Invalid method type');
    }
}

let retrieveImpl = function(impl: ImplSpec): ServiceImplDefinition {
    let clazz = dataHolder.get(impl.class);
    let method = clazz.prototype[impl.method];
    return new ServiceImplDefinition(clazz, method);
}