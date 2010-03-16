// CommonJS compliant module system

window.require = function(identifier) {
  var match;
  if (identifier[0] === '.') {
    // if id is relative resolve the identifier based on the last directoryStack
    match = identifier.match(/\.\/(.*\/)?(.*)/);
    if (match[1]) {
      directoryStack.push(window.require.pwd() + match[1]);
    } else {
      directoryStack.push(window.require.pwd());
    };
    var identifier = window.require.pwd() + match[2];
  } else {
    if (identifier.match(/.*\/.*/)) {
      // find the dir and add it to the stack
      directoryStack.push(identifier.match(/(.*\/).*/)[1]);
    } else {
      // has no directory so push the pwd onto dir stack
      directoryStack.push(window.require.pwd());
    };
  }
  if (moduleCache[identifier]) {
    directoryStack.pop();
    return moduleCache[identifier];
  }
  
  try {
    var __script;
    if (scriptCache[identifier]) {
      __script = scriptCache[identifier];
    } else {
      __script = window.require.fetch(identifier);
    }
  
    var exports = {};
    moduleCache[identifier] = exports;
    var evaluator = function() {
      eval(__script);
    };
    evaluator.apply(exports);
  }
  catch(e) {
    directoryStack.pop();
    throw(e);
  }
  
  // pop the last pwd off the stack
  directoryStack.pop();
  
  return exports;
};

var directoryStack = [''];
window.require.pwd = function() {
  return directoryStack[directoryStack.length-1];
};

window.require.fetch = function(identifier) {
  // check if identifier has been passed and that it's a string
  if (typeof(identifier) !== 'string') {
    throw("No valid identifier given. Must be a string.");
  }
  
  // check if identifier is relative
  if (identifier[0] === '.') {
    throw("Relative identifier fetching is not yet implemented.");
  }
  
  // check if identifier is blank
  if (identifier === '') {
    throw("Identifier is blank.");
  }
  
  var possiblePaths = [];
  for (var i=0; i < window.require.paths.length; i++) {
    possiblePaths.push(window.require.paths[i] + identifier + '.js');
  };
  
  var data;
  while (!data && possiblePaths.length > 0) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", possiblePaths.shift(), false);
    xhr.send();
    
    if (xhr.status === 200) {
      data = xhr.responseText;
    }
  }
  
  if (!data) {
    throw("Module not found.");
  }
  
  scriptCache[identifier] = data;
  
  return data;
};

window.require.paths = [];

var moduleCache = {};
window.require.clearModuleCache = function(identifier) {
  if (identifier) {
    moduleCache[identifier] = undefined;
  } else {
    moduleCache = {};
  }
};

var scriptCache = {};
window.require.clearScriptCache = function(identifier) {
  if (identifier) {
    scriptCache[identifier] = undefined;
  } else {
    scriptCache = {};
  }
};

window.require.clearCache = function (identifier) {
  window.require.clearModuleCache(identifier);
  window.require.clearScriptCache(identifier);
};
