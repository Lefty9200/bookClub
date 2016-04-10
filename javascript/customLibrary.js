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


  // Make an object that will be used to create DOM elements.
  _.makeElement = function(type, elClass, elId, text) {
    return {
      type: type,
      elClass: elementClass,
      elId: elementId,
      text: text
    }
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

  // Create Div for DOM with elements passed as arg. 
  _.createDOM = function(collection, elClassName, elToPush, elArray) {
    _.each(collection, function(current, index) {
      // Make div for current.
      var newDiv = document.createElement('div');
      newDiv.className = elClassName;

      // Give numbered index for searchResponses.
      if (collection === searchResponse) {
        newDiv.id = index;
      } else if (collection === listOfBooks && current.title === currentBook.title) {
        // Give book selected id if it is the current book.
        newDiv.id = 'selected';
      } 

      // Populate each div with elements specified.
      _.each(elArray, function(element, index) {
        var newElement = document.createElement(element.type);

        if (element.text === 'title') {
          newElement.innerHTML = current.title;
        } else if (element.text === 'author') {
          newElement.innerHTML = 'By: ' + current.author;
        } else if (element.text === 'description') {
          newElement.innerHTML = 'Description: <br>'+ current.description;
        } 

        if (element.elClass !== undefined) {
          newElement.className = element.elClass;
        } 

        if (element.elId !== undefined) {
          newElement.id = element.elId;
        }

        newDiv.appendChild(newElement);
      });
      
      // Push to DOM element one after the last.
      var currentDiv = document.getElementById('div1');
      document.getElementById(elToPush).insertBefore(newDiv, currentDiv);

      // define on click functionality.
      if (collection === searchResponse) {
        newDiv.lastChild.onclick = addTolistOfBooks;
      } else if (collection === listOfBooks) {
        newDiv.lastChild.previousSibling.previousSibling.onclick = currentFromClick;

        newDiv.lastChild.previousSibling.onclick = markComplete;

        newDiv.lastChild.onclick = removeBook;
      }
    });
  };
//------------------------------------------------------------------------------