/*
 * API enter point
 *
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const env = require('./env');
const fs = require('fs');

// Handlers container
var handlers = { };

// Not found handler
handlers.notFound = (data,callback) => callback(404);

// /hello handler
handlers.hello = (data, callback) => {

    var message = "Anything but a welcoming message D:";
    if (data.method === 'post')
        message = "A welcoming message :D";
    const jsonMessage = {
        'method' : data.method,
        'message': message
    };
    callback(200, jsonMessage);
};

// Routes request to approprite handler
const router = {
    'hello' : handlers.hello
};

// Instantiate - start HTTP server
const httpServer = http.createServer((req,res) => {
    unifiedServer(req,res);
}).listen(env.httpPort, () => {
    console.log(`The HTTP server is running on port ${env.httpPort}`);
});

// binds ssl certificate
const httpsServerOptions = {
  'key': fs.readFileSync('./certificate/key.pem'),
  'cert': fs.readFileSync('./certificate/cert.pem')
};

// Instantiate - start HTTPS server
const httpsServer = https.createServer(httpsServerOptions, (req,res) => {
    unifiedServer(req,res);
}).listen(env.httpsPort, () => {
    console.log(`The HTTPS server is running on port ${env.httpsPort}`);
});

// HTTP-HTTPS Server reusable logic
const unifiedServer = (req,res) => {

    // data object
    var data = { };
    // parsed url with query as a embedded object
    const parsedUrl = url.parse(req.url, true);

    // treated path
    data.trimmedPath = parsedUrl.pathname;
    data.trimmedPath = data.trimmedPath.replace(/^\/+|\/+$/g, '');

    // get query object
    data.queryStringObject = parsedUrl.query;
    // get http method
    data.method = req.method.toLowerCase();
    //get http headers object
    data.headers = req.headers;

    // get payload if any
    const decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', newData => {
        buffer += decoder.write(newData);
    });

    req.on('end', () => {

        // load last incomming bits
        buffer += decoder.end();
        data.payload = buffer;

        // Check the router for a matching path for a handler,
        // if one is not found, use the notFound handler instead.
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined'
            ? router[trimmedPath]
            : handlers.notFound;

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {

            // check returned statusCode and payload
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object'? payload : {};
            const payloadString = JSON.stringify(payload);

            // write response content
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(`Returning this response: ${statusCode} ${payloadString}`);
        });
    });
};
