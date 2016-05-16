let EXPORTED_SYMBOLS = ["React"];

const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;

let loader = Cc["@mozilla.org/moz/jssubscript-loader;1"]
               .getService(Ci.mozIJSSubScriptLoader);
loader.loadSubScript("resource://react/lib/react-15.0.2.min.js");
loader.loadSubScript("resource://react/lib/react-dom-15.0.2.min.js");
loader.loadSubScript("resource://react/lib/babel-core-6.1.1.min.js");
