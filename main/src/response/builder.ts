import Response from "./response";

export default class ResponseBuilder {

    data(data: Object){
        console.log(data);
    }

    build(): Response {
        return new Response();        
    }


}