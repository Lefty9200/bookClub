//--Search Results--------------------------------------------------------------
  _.each(convert.items, function(element, index) {
      // Make DOM elements.
      var newDiv = document.createElement('div');
      newDiv.className = 'searchResult';
      newDiv.id = index;


      _.makeElement('h3', undefined, undefined, newDiv, book.title);
      _.makeElement('p', undefined, undefined, newDiv, 'By: ' + book.authors[0]);
      _.makeElement('p', undefined, undefined, newDiv, 'Description: <br>'+ book.description);
      _.makeElement('button', 'addBook', undefined, newDiv);


      var currentDiv = document.getElementById('div1');
      document.getElementById('searchResults').insertBefore(newDiv, currentDiv);

      newDiv.lastChild.onclick = addTolistOfBooks;
    }
  });
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  _.each(listOfBooks, function(element, index) {
    var newDiv = document.createElement('div');
    newDiv.className = 'book';

    if (element.title === currentBook.title) {
      newDiv.id = 'selected';  
    }

    _.makeElement('h3', undefined, undefined, newDiv, element.title);
    _.makeElement('p', undefined, undefined, newDiv, 'By: ' + element.author);
    _.makeElement('button', 'setCurrent', undefined, newDiv);
    _.makeElement('button', 'markComplete', undefined, newDiv);
    _.makeElement('button', 'removeBook', undefined, newDiv);

    var currentDiv = document.getElementById('div1');
    document.getElementById('bookList').insertBefore(newDiv, currentDiv);


    // Set current book.
    newDiv.lastChild.previousSibling.previousSibling.onclick = setCurrentFromClick;

    // Mark as complete.
    newDiv.lastChild.previousSibling.onclick = markCompleteFromClick;

    // Remove book from list. If current also remove from current.
    newDiv.lastChild.onclick = removeBook;
  });

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  _.each(completedBooks, function(element) {

    var newDiv = document.createElement('div');
    newDiv.className = 'completed';

    _.makeElement('h3', undefined, undefined, newDiv, element.title);
    _.makeElement('p', undefined, undefined, newDiv, 'By: ' + element.author);

    var currentDiv = document.getElementById('div1');
    document.getElementById('completedBooks').insertBefore(newDiv, currentDiv);
  }); 

//------------------------------------------------------------------------------