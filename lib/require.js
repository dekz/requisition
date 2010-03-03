// CommonJS compliant module system

window.require = function(identifier) {
  if (window.require.moduleCache[identifier]) return window.require.moduleCache[identifier];
  
  var script;
  if (window.require.scriptCache[identifier]) {
    script = window.require.scriptCache[identifier];
  } else {
    script = window.require.fetch(identifier);
  }
  
  var module = window.require.load(script);
  window.require.moduleCache[identifier] = module;
  
  return module;
};

window.require.fetch = function(identifier) {
  // check if identifier has been passed and that it's a string
  if (typeof(identifier) !== 'string') {
    throw("No valid identifier given. Must be a string.");
  }
  
  // check if identifier is relative
  if (identifier[0] === '.') {
    throw("Relative identifier loading is not yet implemented.");
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
  
  window.require.scriptCache[identifier] = data;
  
  return data;
};

window.require.load = function(code) {
  var exports = {};
  var evaluator = function() {
    eval(code);
  };
  evaluator.apply(exports);
  return exports;
};

window.require.moduleCache = {};
window.require.scriptCache = {};

window.require.paths = [];