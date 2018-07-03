Feature: Error handler

    @error-handling
    Scenario: Default error handler
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
                    }],
                    "modules": ["#dummyModule"]
                }
            """
        When i start service "#dummy"
        And i fetch url "http://localhost:8080/dummy?invalid=1" and get response into "#response"
        Then i check "#response" response code is equal to 400
        When i fetch url "http://localhost:8080/invalid" and get response into "#response"
        Then i check "#response" response code is equal to 404
        Then i stop service "#dummy"
