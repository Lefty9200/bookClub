//--Custom Library--------------------------------------------------------------
var $ = function(selector, create) {
  var elements;
  if (typeof selector === 'string') {
    if (!create) {
      if (selector[0] === '.') {
        elements = document.getElementsByClassName(selector.substring(1));
      } else if (selector[0] === '#') {
        elements = document.getElementById(selector.substring(1));
      } else {
        elements = document.getElementsByTagName(selector);
      }
    } else {
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
  
  if (elements !== null || undefined) {
    elements.addText = function(text) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = text;
      }
      return elements;
    };

    elements.addClass = function(name) {
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].className === '') {
          elements[i].className += name;
        } else {
          elements[i].className += ' ' + name;
        }
      }
      return elements;
    };

    elements.addId = function(name) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].id = name;
      };
      return elements;
    };

    elements.addSelected = function(name) {
      for (var i = 0; i < elements.length; i++) {
        if (name === currentBook.title) {
          elements[i].id = 'selected';
        }
      }
      return elements;
    };

    elements.removeClass = function(rmClass) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove(rmClass);
      }
      return elements;
    };

    elements.toggleClass = function(tglClass) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.toggle(tglClass);
      }
      return elements;
    };

    elements.addAttribute = function(ky, val) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute(ky, val);
      }
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