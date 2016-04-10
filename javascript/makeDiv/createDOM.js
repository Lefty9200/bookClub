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

  _.makeElement = function(type, elementClass, id, text) {
    return {
      type: type,
      elementClass: elementClass,
      id: id,
      text: text
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


  _.createDOM = function(collection, className, elToPush, elArray) {
    _.each(collection, function(current, index) {
      var newDiv = document.createElement('div');
      newDiv.className = className;

      if (collection === searchResponse) {
        newDiv.id = index;
      } else if (collection === listOfBooks && current.title === currentBook.title) {
        newDiv.id = 'selected';
      } else {
        newDiv.id = undefined;
      }

      // Don't know what to do with the make elements.
      _.each(elArray, function(element, index) {
        var newElement = document.createElement(element.type);

        if (element.text === 'title') {
          newElement.innerHTML = current.title;
        } else if (element.text === 'author') {
          newElement.innerHTML = 'By: ' + current.author;
        } else if (element.text === 'description') {
          newElement.innerHTML = 'Description: <br>'+ current.description;
        }

        newElement.className = element.elementClass;
        newElement.id = element.id;

        newDiv.appendChild(newElement);
      });
      
      var currentDiv = document.getElementById('div1');
      document.getElementById(elToPush).insertBefore(newDiv, currentDiv);

      if (collection === searchResponse) {
        newDiv.lastChild.onclick = addTolistOfBooks;
      } else if (collection === listOfBooks) {
        newDiv.lastChild.previousSibling.previousSibling.onclick = setCurrentFromClick;

        newDiv.lastChild.previousSibling.onclick = markCompleteFromClick;

        newDiv.lastChild.onclick = removeBook;
      }
    });
  };


  