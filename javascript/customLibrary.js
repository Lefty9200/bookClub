//--Custom Library--------------------------------------------------------------

// Custom Jquery style library.
var $ = function(selector, create) {
  // set undefined variable.
  var elements;

  if (typeof selector === 'string') {
    // if create is false we are grabbing an already created DOM element.
    if (!create) {
      if (selector[0] === '.') {
        elements = document.getElementsByClassName(selector.substring(1));
      } else if (selector[0] === '#') {
        elements = document.getElementById(selector.substring(1));
      } else {
        elements = document.getElementsByTagName(selector);
      }
    } else {  // Create DOM element.
      if (selector[0] === '.') {
        var div = document.createElement('div');
        div.className = selector.substring(1);
        elements = [div];
      } else if (selector[0] === '#') {
        var div = document.createElement('div');
        div.id = selector.substring(1);
        elements = [div];
      } else {
        var el = document.createElement(selector);
        elements = [el];
      }
    }
  }
  
  // Set of methods to assist in the creation of elements.
  // Could have used each instead of for loops but didn't want to mix libraries.
  // In methods needed to differentiate between arrays and objects because sometimes
  // returning objects to be used with native js methods, othertimes needed to use
  // methods below.
  if (elements !== null && elements !== undefined) {
    elements.addText = function(text) {
      if (Array.isArray(elements)) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].innerHTML = text;
        };     
      } else {
        elements.innerHTML = text;
      };
      return elements;
    };

    elements.addClass = function(name) {
      if (Array.isArray(elements)) {
        for (var i = 0; i < elements.length; i++) {
          if (elements[i].className === '') {
            elements[i].className += name;
          } else {
            elements[i].className += ' ' + name;
          };
        };     
      } else {
        if (elements.className === '') {
          elements.className += name;
        } else {
          elements.className += ' ' + name;
        };
      };
      return elements;
    };

    elements.addId = function(name) {
      if (Array.isArray(elements)) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].id = name;
        };     
      } else {
        elements.id = name;
      };
      return elements;
    };

    elements.addSelected = function(name) {
      if (Array.isArray(elements)) {
        for (var i = 0; i < elements.length; i++) {
          if (name === currentBook.title) {
            elements[i].id = 'selected';
          }
        };     
      } else {
        if (name === currentBook.title) {
          elements.id = 'selected';
        }
      };
      return elements;
    };

    elements.removeClass = function(rmClass) {
      if (Array.isArray(elements)) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].classList.remove(rmClass);
        };     
      } else {
        elements.classList.remove(rmClass);
      };
      return elements;
    };

    elements.toggleClass = function(tglClass) {
      if (Array.isArray(elements)) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].classList.toggle(tglClass);
        };     
      } else {
        elements.classList.toggle(tglClass);
      };
      return elements;
    };

    elements.addAttribute = function(ky, val) {
      if (Array.isArray(elements)) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].setAttribute(ky, val);
        };     
      } else {
        elements.setAttribute(ky, val);
      };

      return elements;  
    };

    elements.setOnClick = function(callback) {
          for (var i = 0; i < elements.length; i++) {
            elements[i].onclick = callback;              
          };
          return elements;
        };


    elements.append = function($el) {
      for (var i = 0; i < $el.length; i++) {
        if (elements.length === 1) {
          elements[0].appendChild($el[i]);
        } else {
          elements.appendChild($el[i][0]);
        }
      }
      return elements;
    }
  }
 
  return elements;
};


// Custom Underscore style library.
var _ = {};

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

_.reduce = function(collection, callback, memo) {
  var flag = false;

  if (arguments.length === 2) {
    flag = false;
  }

  _.each(collection, function(current) {
    if (flag) {
      memo = current;
      flag = false;
    } else {
      memo = callback(memo, current);
    }
  });

  return memo;
};

_.map = function(collection, iteratee) {
  return _.reduce(collection, function(memo, current) {
    memo.push(iteratee(current));
    return memo;
  }, []);
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


// If DOM is not empty invoke the callback.
_.populateDOM = function(arg, callback) {
  if (!_.isEmpty(arg)) {
    callback();
  } else {
    if (arg === currentBook) {
      $('#pageInput').style.display = 'none';
    }
  }
};
//------------------------------------------------------------------------------