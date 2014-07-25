#!/home/kerphi/.nvm/v0.10.24/bin/node
/**
 * Add spaces to irevue bad formated logs
 * Usage:
 * zcat hippo.irevues.access.2014.07.22.log.gz | ./irevue-logs-cleaner.njs | gzip -9 > hippo.irevues.access.2014.07.22.log.ok.gz 
 *
 * Bad line example:
 * ---[22/Jul/2014:00:00:05 +0200]POST /solr/statistics/update?wt=javabin&version=1 HTTP/1.120040
 * Good line (with spaces as a separator):
 * - - - [22/Jul/2014:00:00:05 +0200] POST /solr/statistics/update?wt=javabin&version=1 HTTP/1.1 200 40
 */

var patterns = {
  ip: '([a-zA-Z0-9\\.\\-\\:]+(?:, ?[a-zA-Z0-9\\.\\-\\:]+)*)',
  identd: '(-)',
  login: '(-)',
  date: '(\\[.+?\\])',
  method: '(GET|POST|HEAD|OPTIONS|OST|PROPFIND|PUT|T)',
  url: '(\/.*? HTTP\/1\.[10])',
  httpStatus: '([0-9]{3})',
  size: '([0-9]+|-)'
}
var irevueLogRegexp = new RegExp(
  '^' +
  patterns.ip +
  patterns.identd +
  patterns.login +
  patterns.date +
  patterns.method + ' ' +
  patterns.url +
  patterns.httpStatus +
  patterns.size
);

// read stdin and split it into line of log
var Lazy = require('lazy');
Lazy(process.stdin)
  .lines
  .map(String)
  .map(parseLogToJson)
  .map(createNiceLog);

// parse the line of log
function parseLogToJson(log) {
  var match = log.match(irevueLogRegexp);
  //console.log(match);
  if (match) {
    return {
      ip: match[1],
      identd: match[2],
      login: match[3],
      date: match[4],
      method: match[5],
      url: match[6],
      httpStatus: match[7],
      size: match[8]
    }
  } else {
    // show the not handle line on stderr
    process.stderr.write(log + '\n');
    // // but also output it to stdout because part of a file could be correct
    // // example: hippo.irevues.access.2014.07.23.log
    // process.stdout.write(log + '\n');
    return {};
  }
}

// rewrite the line of log into a nice one
function createNiceLog(jsonLog) {
  var niceLine = '';
  Object.keys(jsonLog).forEach(function (key) {
    niceLine += jsonLog[key] + ' ';
  });
  niceLine = niceLine.trim();

  if (niceLine !== '') {
    process.stdout.write(niceLine + '\n');
  }
}