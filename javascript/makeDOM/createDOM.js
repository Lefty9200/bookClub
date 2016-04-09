  var _ = {};

  _.makeElement = function(type, elementClass, id, text) {
    return {
      type: type,
      elementClass: elementClass,
      id: id,
      text: text
    }
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
      function takeElements(elArray) {
        _.each(elArray, function(current, index) {
          var newElement = document.createElement(current.type);

          current.text != undefined ? newElement.innerHTML = text : undefined;
          current.elementClass != undefined ? newElement.className = elementClass : undefined;
          current.id != undefined ? newElement.id = id : undefined;

          newDiv.appendChild(newElement);
        });
      };

      var currentDiv = document.getElementById('div1');
      document.getElementById(elToPush).insertBefore(newDiv, currentDiv);
    });
  };