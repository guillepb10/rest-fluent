Feature: Service request

@get
Scenario: Simple get services
    Given a service "#dummy" with following spec:
        """
            {
                "port": 8080,
                "endpoints": [{
                    "method": "GET",
                    "path": "/dummy",
                    "impl": "DummyService.prototype.dummy"
                }, {
                    "method": "GET",
                    "path": "/dummy/{name}",
                    "params": { "path": {"name": "sith"} },
                    "impl": "DummyService.prototype.dummyPath"
                }, {
                    "method": "GET",
                    "path": "/dummy/query",
                    "params": { "query": { "name": "jedi" } },
                    "impl": "DummyService,prototype.dummyQuery"
                }]
            }
        """
    When i start service "#dummy"
    And i fetch path "/dummy" and get response into "#no-params"
    Then i check "#no-params" has field "message" equals to "Hello world!"
    When i fetch path "/dummy/Anakin" and get response into "#path-param"
    Then i check "#path-param" has field "message" equals to "Hello Anakin!"
    When i fetch path "/dummy/query?name=Joda" and get response into "#query-param"
    Then i check "#query-param" has field "messge" equals to "Hello Joda!"
    Then i stop service "#dummy"
