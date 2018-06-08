# Rest Fluent Library

Library used to build rest apis in node over Express.js

## Use

```js
Service.builder()
    .port(8080)
    .errorHandler(new BasicErrorHandler())
    .api('/v0/customers')
        .path('/{customer-id}')
            .get({ path: { "customer-id": "customer" }, query: { "exp" : "expand" }}, {class: Class, method: Method })
            .put({ path: { "customer-id": "customer" }, body: 'bodyParam' } , {class: Class, method: Method })
            .delete({ path: { "customer-id": "customer" }, class: Class, method: Method })
            .patch('/{customer-id}', { path: { "customer-id": "customer" }}, {class: Class, method: Method })
        .buildPath()                   
        .post( {body: 'bodyParam'}, {class: Class, method: Method })
    .buildApi()
    .modules([CutomerModule])
.build()
```

Parameters:

- port (optional, def=8080)
- errorHandler (optional, def=error handler por defecto)
- api (required), but not path (def='/')
    - path (node required, value optional => def='/')
    - method (required)
    - queryParam (optional)
    - build (required)
