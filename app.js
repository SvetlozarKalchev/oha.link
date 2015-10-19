'use strict'
var http = require('http');
var url = require('url');
var fs = require('fs');
var baseURL = require('./CONFIG.js').BASE_URL;

// Initiate DB connection
let RequestController = require('./lib/RequestController.js');

http.createServer(function(req, res) {
  res.setHeader("Access-Control-Allow-nodemOrigin", "*");
  res.setHeader("Acces-Control-Allow-Methods", "GET");

  let parsedRequest = url.parse(req.url);

  RequestController.route(parsedRequest, res,
    function onResponseFinish(err, result) {
      console.log(err, result)
    });
}).listen(8000);
