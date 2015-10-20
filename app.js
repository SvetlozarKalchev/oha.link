'use strict'
var http = require('http');
var url = require('url');
var fs = require('fs');
var baseURL = require('./CONFIG.js').BASE_URL;

let RequestController = require('./lib/controllers/RequestController.js');

http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Acces-Control-Allow-Methods', 'GET');

  RequestController.route(req, res,
    function onResponseFinish(err, result) {
      console.log(err, result)
    });
}).listen(8000);
