'use strict';
let fs = require('fs');

let baseURL = require('../../CONFIG.js').BASE_URL;
class RoutingLogic {
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

module.exports = RoutingLogic;
