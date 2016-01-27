/*******************************************************
 * TPS - Task Processing Service
 * representation router (server)
 * May 2015
 * Mike Amundsen (@mamund)
 * Soundtrack : Complete Collection : B.B. King (2008)
 *******************************************************/

// handles internal representation routing (based on conneg)

// load representors
//var html = require('./representors/html.js');
var json = require('./representors/json.js');
var wstljson = require('./representors/wstljson.js');

var defaultFormat = "application/json";

module.exports = main;

function main(object, mimeType, root) {
  var doc;

  // clueless? assume JSON
  if (!mimeType) {
    mimeType = defaultFormat;
  }

  // dispatch to requested representor
  switch (mimeType.toLowerCase()) {
    case "application/vnd.wstl+json":
      doc = wstljson(object, root);
      break;
    case "application/json":
      doc = json(object, root);
      break;
    default:
      doc = json(object, root);
      break;
  }

  return doc;
}

// EOF

