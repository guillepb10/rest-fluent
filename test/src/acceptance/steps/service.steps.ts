const { Given, When, Then } = require('cucumber')
import { Service } from '../../../../main/src/index';

let data: {[key: string]: Object};
Given('a service {string} with following spec:', (service: string, spec: string) => {
    spec;
    service;
    Service.builder().build();
});

When("i start service {string}", (service: string) => {
    console.log(data);
    console.log("start" + service);
});

When("i fetch path {string} and get response into {string}", (path: string, response: string) => {
    console.log("fetch" + path + response);
});

Then("i check {string} has field {string} equals to {string}", (object: string, field: string, value: string) => {
    console.log("check" + object + field + value);
});

Then("i stop service {string}", (service: string) => {
    console.log("stop" + service);
});