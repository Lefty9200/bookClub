//--Custom Library--------------------------------------------------------------
  var _ = {};
 
  var $ = function(selector, el) {
    if (!el) {
      el = document; 
    }
    return el.querySelector(selector);
  };

  _.each = function(collection, callback) {
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        callback(collection[i], i);
      }
    } else {
      for (var key in collection) {
        callback(collection[key], key);
      }
    }
  };

  _.makeElement = function(type, elementClass, id, parentElement, text) {
    var newElement = document.createElement(type);

    text != undefined ? newElement.innerHTML = text : undefined;
    elementClass != undefined ? newElement.className = elementClass : undefined;
    id != undefined ? newElement.id = id : undefined;

    return parentElement.appendChild(newElement);
  };

  _.isEmpty = function(arg) {
    if (Array.isArray(arg)) {
      return arg.length === 0;
    } else {
      for (var key in arg) {
        return false;
      }
      return true;
    }
  }; 


  _.clear = function(el, valToClear) {
    if (valToClear === undefined) {
      valToClear = 'innerHTML';
    }
    el[valToClear] = '';
  };
//------------------------------------------------------------------------------