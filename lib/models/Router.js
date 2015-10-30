'use strict'
let fs = require('fs');

let baseURL = require('../../CONFIG.js').BASE_URL;
let ShortenerController = require('../controllers/ShortenerController.js');
let StaticPageServer = require('./StaticPageServer.js');

class Router {
  /* Different route cases */

  requestedHomePage(reqUrl) {
    let reqPath = reqUrl.pathname;
    let query = reqUrl.query;

    return (reqPath === '/' && !query);
  }

  requestedLink(reqUrl) {
    let reqPath = reqUrl.pathname;
    let query = reqUrl.query;

    return (reqPath.length === 5 && !query);
  }

  givenLinkToShorten(reqUrl) {
    let reqPath = reqUrl.pathname;
    let query = reqUrl.query;

    return (reqPath === '/shorten' && query);
  }

  requestedFavicon(reqUrl) {
    let reqPath = reqUrl.pathname;
    let query = reqUrl.query;

    return (reqPath === '/favicon.ico' && !query);
  }
}

module.exports = new Router();
