const request = require('supertest');

import DummyService from '../examples/services/dummy';
import DummyModule from '../examples/modules/dummy';
//import DummyRequest from '../examples/services/dummy.request';
import { Service } from '../../src';
import DummyRequest from '../examples/services/dummy.request';

describe('Builder', function() {

    describe('GET method',function() {
        test('service without params', function(done){
            let app = Service.builder()
                            .port(8080)
                            .api("/simple")
                                .get({class: DummyService, method: DummyService.prototype.endpoint})
                            .buildApi()
                            .modules([DummyModule])
                        .build();
            app.start();
    

            let res = request('http://localhost:8080').get('/simple');
            
            res
                .expect(200, { msg: 'Hello World!!' })
                .end((error, res) => {
                    app.stop();
                    done(error);
                });                
        });

        test('service with path params', function(done){
            let app = Service.builder()
                            .port(8080)
                            .api("/simple")
                                .get({class: DummyService, method: DummyService.prototype.helloName}, { path: { 'message-name' : 'name' }}, '/{message-name}')
                            .buildApi()
                            .modules([DummyModule])                            
                        .build();
            app.start();
    
            let res = request('http://localhost:8080').get('/simple/Trump');

            res
                .expect(200, { msg: 'Hello world mr. Trump' })
                .end((error, res) => {
                    app.stop();
                    done(error);
                });
        });
        
        test('service with query params', function(done){
            let service = Service.builder()
                            .port(8080)
                            .api('/simple')
                            .get({class: DummyService, method: DummyService.prototype.filter},{ query: { 'f' : 'filter' }})
                            .buildApi()
                            .modules([DummyModule])                            
                          .build();
            service.start();

            let res = request('http://localhost:8080').get('/simple?f=test-filter');
            
            res
                .expect(200, { msg: 'Received filter test-filter' })
                .end((error, res) => {
                    service.stop();
                    done(error);
                });
        })
    });

    describe('POST method', function(){
        test('service without params', function(done){
            let service = Service.builder()
                                .port(8080)
                                .api('/v0/customer')
                                    .post({class: DummyService, method: DummyService.prototype.simplePost}, { body: 'request' })
                                .buildApi()
                                .modules([DummyModule]) 
                            .build();
            service.start();

            let res = request('http://localhost:8080')
                            .post('/v0/customer')
                            .send(new DummyRequest('This is a simple post request'));

            res
                .expect(200, { msg: 'This is a simple post request'})
                .end((err, res) => {
                    service.stop();
                    done(err);
                })
        });
    });
});