'use strict';
let Scribo = require('scribo');

module.exports = (function() {

  function logReqToRoot(httpReq) {
    let reqIp = httpReq.headers['x-forwarded-for'] || httpReq.connection.remoteAddress;

    let logMessage = ` from
    ${reqIp}
    ${httpReq.headers['user-agent']} |
    ${httpReq.headers['referer']}
    -------------------------------- '\n'`;

    Scribo.logEvent('Request to /', logMessage, true);
  }

  return {
    logReqToRoot: logReqToRoot
  }
})();
