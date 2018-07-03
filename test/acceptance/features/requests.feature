Feature: Service request

    Scenario: Simple get services
        Given a referece from file "../examples/dummy.service" with name "default" saved into "#dummyImpl"
        And a referece from file "../examples/dummy.module" with name "dummyModule" saved into "#dummyModule"
        And a service "#dummy" with following spec:
            """
                {
                    "port": 8080,
                    "endpoints": [{
                        "method": "GET",
                        "path": "/dummy",
                        "impl": { "class": "#dummyImpl", "method" : "dummy"}
                    }, {
                        "method": "GET",
                        "path": "/dummy/{name}",
                        "params": { "path": {"name": "character"} },
                        "impl": { "class": "#dummyImpl", "method" : "dummyParam"}
                    }, {
                        "method": "GET",
                        "path": "/dummyQuery",
                        "params": { "query": { "name": "character" } },
                        "impl": { "class": "#dummyImpl", "method" : "dummyParam"}
                    }],
                    "modules": ["#dummyModule"]
                }
            """
        When i start service "#dummy"
        And i fetch url "http://localhost:8080/dummy" and get response into "#no-params"
        Then i check "#no-params" is a successfull response
        And i check "#no-params" has field "message" equals to "Hello World!"
        When i fetch url "http://localhost:8080/dummy/Anakin" and get response into "#path-param"
        Then i check "#path-param" is a successfull response
        And i check "#path-param" has field "message" equals to "Hello Anakin!"
        When i fetch url "http://localhost:8080/dummyQuery?name=Joda" and get response into "#query-param"
        Then i check "#query-param" is a successfull response
        And i check "#query-param" has field "message" equals to "Hello Joda!"
        And i stop service "#dummy"

    @delete
    Scenario: Simple delete services
         Given a referece from file "../examples/dummy.service" with name "default" saved into "#dummyImpl"
        And a referece from file "../examples/dummy.module" with name "dummyModule" saved into "#dummyModule"
        And a service "#dummy" with following spec:
            """
                {
                    "port": 8080,
                    "endpoints": [{
                        "method": "DELETE",
                        "path": "/dummy/{name}",
                        "params": { "path": {"name": "character"} },
                        "impl": { "class": "#dummyImpl", "method" : "dummyParam"}
                    }, {
                        "method": "DELETE",
                        "path": "/dummyQuery",
                        "params": { "query": { "name": "character" } },
                        "impl": { "class": "#dummyImpl", "method" : "dummyParam"}
                    }],
                    "modules": ["#dummyModule"]
                }
            """
        When i start service "#dummy"
        When i fetch url "http://localhost:8080/dummy/Anakin" with "DELETE" method and get response into "#path-param"
        Then i check "#path-param" is a successfull response
        And i check "#path-param" has field "message" equals to "Hello Anakin!"
        When i fetch url "http://localhost:8080/dummyQuery?name=Joda" with "DELETE" method and get response into "#query-param"
        Then i check "#query-param" is a successfull response
        And i check "#query-param" has field "message" equals to "Hello Joda!"
        And i stop service "#dummy"


    Scenario Outline: Simple <requestMethod> services
        Given a referece from file "../examples/dummy.post.service" with name "default" saved into "#dummyImpl"
        And a referece from file "../examples/dummy.module" with name "dummyModule" saved into "#dummyModule"
        And a service "#dummy" with following spec:
            """
                {
                    "port": 8080,
                    "endpoints": [{
                        "method": "<requestMethod>",
                        "path": "/dummy",
                        "params": { "body": "data" },
                        "impl": { "class": "#dummyImpl", "method" : "dummy"}
                    }, {
                        "method": "<requestMethod>",
                        "path": "/dummy/{name}",
                        "params": { "body": "data", "path": {"name": "character"} },
                        "impl": { "class": "#dummyImpl", "method" : "dummyParam"}
                    }, {
                        "method": "<requestMethod>",
                        "path": "/dummyQuery",
                        "params": { "body": "data", "query": { "name": "character" } },
                        "impl": { "class": "#dummyImpl", "method" : "dummyParam"}
                    }],
                    "modules": ["#dummyModule"]
                }
            """
        When i start service "#dummy"
        And i fetch url "http://localhost:8080/dummy" with "<requestMethod>" method and "{'object': 'umbrella'}" data and get response into "#no-params"
        Then i check "#no-params" is a successfull response
        And i check "#no-params" has field "message" equals to "Hello World! This is your umbrella"
        When i fetch url "http://localhost:8080/dummy/Anakin" with "<requestMethod>" method and "{'object': 'red lightsaber'}" data and get response into "#path-param"
        Then i check "#path-param" is a successfull response
        And i check "#path-param" has field "message" equals to "Hello Anakin! This is your red lightsaber"
        When i fetch url "http://localhost:8080/dummyQuery?name=Joda" with "<requestMethod>" method and "{'object': 'green lightsaber'}" data and get response into "#query-param"
        Then i check "#query-param" is a successfull response
        And i check "#query-param" has field "message" equals to "Hello Joda! This is your green lightsaber"
        And i stop service "#dummy"
    Examples:
    | requestMethod   |
    | POST            |
    | PUT             |
    | PATCH           |
