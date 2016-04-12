//--Custom Library--------------------------------------------------------------

// Selector can be class, id, element string. Create is boolean signifying new element.
// Set variable dollarsign equal to an annonymous function that takes in two arguments.
var $ = function(selector, create) {
  // declare a variable with no value.
  var elements;
  // if type of first argument it string do this.
  if (typeof selector === 'string') {
    // if second argument is false do this.
    if (!create) {
      if (selector[0] === '#') {
        // set elements equal to all DOM elements that match argument one.
        elements = document.querySelector(selector);
      } else if (selector[0] === '.') {
        elements = document.querySelector(selector); // returns NodeList
      }
      // If typeof selector is not a string do this.
    } else {
      // if the first character on argument one it a period do this.
      if (selector[0] === '.') {
        // declare variable div and set equal to doc.createElement('div');
        var div = document.createElement('div');
        // Set className of div to argument one without the first character.
        div.className = selector.substring(1);
        // set elements equal to an array containing the div.
        elements = [div];
        // if the first character of argument one is a hash do this.
      } else if (selector[0] === '#') {
        // declare variable div and set equal to doc.createElement('div');
        var div = document.createElement('div');
        // set id to argument one minus character one.
        div.id = selector.substring(1);
        // set elements equal to an array containing div.
        elements = [div];
        // if no else if statments apply do this.
      } else {
        // declare a variable and set it equal to document.createElement(selector)
        var el = document.createElement(selector);
        // set elements equal to an array of el.
        elements = [el];
      }
    }
  }
  
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

  elements.removeClass = function(rmClass) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove(rmClass);
    }
  };

  elements.toggleClass = function(tglClass) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.toggle(tglClass);
    }
  };

  elements.addAttribute = function(ky, val) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].setAttribute(ky, val);
    }  
  };

  elements.listener = function(type, callback) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener(type, callback);
    }
  };

  elements.clicked = function(callback) {
    console.log(elements);
    for (var i = 0; i < elements.length; i++) {
      elements[i].onclick = callback;
    }
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