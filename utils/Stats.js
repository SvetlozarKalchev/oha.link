'use strict';
let Scribo = require('scribo');

module.exports = (function() {
  let counter = 0;

  function getIp(httpReq) {
    let reqIp = httpReq.headers['x-forwarded-for'] || httpReq.connection.remoteAddress;

    return reqIp;
  }

  function getLogMessage(httpReq) {
    let logMessage = ` from
    ${getIp(httpReq)}
    ${httpReq.headers['user-agent']} |
    ${httpReq.headers['referer']}
    ----------------------------------------------------------- '\n'`;

    return logMessage;
  }

  function logReqToRoot(httpReq) {
    Scribo.logEvent('Request to /', getLogMessage(httpReq), true);
  }

  // function logReqForShortLink(httpReq, parsedReq) {
  //   let shortLink = `${parsedReq.pathName}`;
  //
  //   Scribo.logEvent('Request to /', logMessage, true);
  // }

  function incrementVisits(httpReq) {
    counter++;
    let logMessage = `from ${getIp(httpReq)}, total visits: ${counter}`;

    Scribo.logEvent('visit', logMessage, true);
  }

  return {
    logReqToRoot: logReqToRoot,
    incrementVisits: incrementVisits
  }
})();
