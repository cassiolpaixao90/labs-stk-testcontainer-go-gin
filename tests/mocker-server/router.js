const http = require('http');
const matcher = require("./match")

class Router {
    constructor() {
        this.server = http.createServer();
        this.setupRoutes();
        this.setupMethods();
        this.server.on('request', this.handleRequest.bind(this));
    }

    setupRoutes() {
        this.router = {
            GET: {},
            POST: {},
            PUT: {},
            DEL: {}
        };
    }

    setupMethods() {
        this.get = this.registerRoute('GET');
        this.post = this.registerRoute('POST');
        this.put = this.registerRoute('PUT');
        this.del = this.registerRoute('DEL');
    }

    async handleRequest(req, res) {
        try {
            req = await this.setupRequest(req);
            res = this.setupResponse(res);

            const routers = this.router[req.method]
            const {valid, handler} = matcher(routers, req)
            if (!valid) {
                return res.status(404).send(JSON.stringify({message: "Not Found"}));
            }

            return handler(req, res);
        } catch (e) {
            return res.status(500).send(JSON.stringify({message: e.message}));
        }
    }

    setupRequest(request) {
        request.body = '';

        request.on('data', chunk => {
            request.body += chunk.toString();
        });

        return new Promise(resolve => request.on('end', () => {
            request.body = request.body ? JSON.parse(request.body) : '';
            resolve(request);
        }));
    }

    setupResponse(response) {
        response.status = (statusCode) => {
            response.statusCode = statusCode;
            return response;
        }

        response.send = (responseBody) => {
            response.write(responseBody);
            response.end();
        }

        return response;
    }

    registerRoute(method) {
        return function (route, callback) {
            this.router[method][route] = callback
        }
    }

    listen() {
        const args = Array.prototype.slice.call(arguments);
        return this.server.listen.apply(this.server, args);
    }
}

module.exports = new Router();