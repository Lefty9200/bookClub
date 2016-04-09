//--Global Variables------------------------------------------------------------
  var searchResponse = [];
  var listOfBooks = JSON.parse(localStorage.getItem('listOfBooks')) || [];
  var completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
  var currentBook = JSON.parse(localStorage.getItem('currentBook')) || {};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Check if globol variables already exists.
  var populateDOM = function(arg, callback) {
    if (!_.isEmpty(arg)) {
      callback();
    } else {
      if (arg === currentBook) {
        $('#pageInput').style.display = 'none';
      }
    }
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  window.onload = function() {
    populateDOM(listOfBooks, setListOfBooks);
    populateDOM(completedBooks, setCompletedBooks);
    populateDOM(currentBook, setCurrent);
  };
//------------------------------------------------------------------------------


//--Local Storage---------------------------------------------------------------
  window.onbeforeunload = function() {
     // Save lists to local storage.
     // localStorage.setItem('listOfBooks', JSON.stringify(listOfBooks));
     // localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
     // localStorage.setItem('currentBook', JSON.stringify(currentBook));
     localStorage.clear();
     sessionStorage.clear();

     return null;
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Set listOfBooks DOM.
  function setListOfBooks() {

    var setCurrentFromClick = function() {
      var passedThis = this.parentNode;
      if ($('#selected')) {
        $('#selected').removeAttribute('id');
      }

      passedThis.id = 'selected';

      _.clear($('#pageAlert'));

      _.each(listOfBooks, function(element, index) {
        if (this.firstChild.innerHTML === element.title) {
          currentBook = element;

          return setCurrent();
        }
      }.bind(passedThis));
    };

    var markCompleteFromClick = function() {
      var passedThis = this.parentNode;
      var targetBook;

      _.each(listOfBooks, function(element, index) {
        if (this.firstChild.innerHTML === element.title) {
          targetBook = element;
          targetBook.progress = targetBook.pagecount;
        }
      }.bind(passedThis));
      return pagesRead(targetBook, passedThis);
    };

    var removeBook = function() {
      var passedThis = this.parentNode;
      if (passedThis.firstChild.innerHTML === currentBook.title) {
        currentBook = {};
        _.clear($('#bookCover'), 'src');
        _.clear($('#title'));
        _.clear($('#author'));
        _.clear($('#pagesRead'));
        _.clear($('#percentComplete'));
        _.clear($('#pageAlert'));


        $('#pageInput').style.display = 'none';
      }

      _.each(listOfBooks, function(element, index) {
        if (this.firstChild.innerHTML === element.title) {
          listOfBooks.splice(index, 1);        
          this.remove();
        }
      }.bind(passedThis));
    };  


    _.clear($('#bookList'));

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
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Set completedBooks
  function setCompletedBooks() {
    // Clear completed books list and update with added completed book.
    _.clear($('#completedBooks'));

    _.each(completedBooks, function(element) {

      var newDiv = document.createElement('div');
      newDiv.className = 'completed';

      _.makeElement('h3', undefined, undefined, newDiv, element.title);
      _.makeElement('p', undefined, undefined, newDiv, 'By: ' + element.author);

      var currentDiv = document.getElementById('div1');
      document.getElementById('completedBooks').insertBefore(newDiv, currentDiv);
    }); 
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Sets current book if current book already exists or set current book
  // from book selected from booklist. 
  function setCurrent() {
    // Set DOM elements.
    $('#bookCover').src = currentBook.thumbnail;
    $('#title').innerHTML = currentBook.title;
    $('#author').innerHTML = 'Author: ' + currentBook.author;
    $('#pagesRead').innerHTML = currentBook.progress +' pages read - ' + 
      (currentBook.pagecount - currentBook.progress) + ' pages to go!';
    $('#percentComplete').innerHTML = Math.floor((currentBook.progress / 
      currentBook.pagecount) * 100) + '% completed!';
    // Display input bar.
    $('#pageInput').style.display = 'block';

    // Update progress of current book to input.
    $('#pageInput').firstChild.nextSibling.onclick = function() {
      var input = parseInt($('#pageInput').firstChild.value);
      $('#pageInput').firstChild.value = '';
      if (isNaN(input)) {
        $('#pageAlert').innerHTML = 'Please enter a number!';
      } else if (input > currentBook.pagecount || input <= 0) {
        $('#pageAlert').innerHTML = 'Page number entered does not exist!';
      } else {
        currentBook.progress = input;
        return pagesRead(currentBook, $('#selected'));
      }
    };

    // Update progress of current book to 100%.
    $('#pageInput').lastChild.onclick = function() {
      currentBook.progress = currentBook.pagecount;
      return pagesRead(currentBook, $('#selected'));
    };
  };
//------------------------------------------------------------------------------


//--Search Results--------------------------------------------------------------
$('#searchButton').addEventListener('click', function() {
  var searchInput = $('#searchInput').value.split(' ').join('+');
  var url = 'https://www.googleapis.com/books/v1/volumes?q=' + searchInput;

  searchResponse = [];
  _.clear($('#searchResults'));

  if (searchInput.length === 0) {
    $('#searchAlert').innerHTML = 'Please enter a search parameter!';
  } else {
    _.clear($('#searchAlert'));
  };

  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('load', function() {

    var convert = JSON.parse(this.responseText);

    _.each(convert.items, function(element, index) {
      var book = element.volumeInfo;

      if (book.authors !== undefined && book.description !== undefined && 
        book.pageCount !== undefined && book.imageLinks !== undefined) { 

        // Push books to search result.
        searchResponse.push({ 
          title: book.title,
          author: book.authors[0],
          description: book.description,
          pagecount: book.pageCount, 
          thumbnail: book.imageLinks.thumbnail
        });

        _.clear($('#searchInput'), 'value');

      }
    });

    var DOMelements = function(collection) {
      var Overall = [];
      _.each(collection, function(current) {
        var result = []
          result.push(_.makeElement('h3', undefined, undefined, current.title));
          result.push(_.makeElement('p', undefined, undefined, 'By: ' + current.author));
          result.push(_.makeElement('p', undefined, undefined, 'Description: <br>'+ current.description));
          result.push(_.makeElement('button', 'addBook', undefined));
        Overall.push(result);
      });
      return Overall;
    };

    // Make DOM elements and save in array.
    var elArray = DOMelements(searchResponse);
    
    // CreateDOM with created elements.
    _.createDOM(searchResponse, 'searchResult', 'searchResults', elArray);

    // newDiv.lastChild.onclick = addTolistOfBooks;
  });
});
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Add book to list of books.
  var addTolistOfBooks = function() {
    var passedThis = this.parentNode;
    var flag = true;

    // Don't alow duplicates to be added.
    for (var i = 0; i < listOfBooks.length; i++) {
      if (listOfBooks[i].title === passedThis.firstChild.innerHTML) {
        flag = false;
      }
    }

    // If not a duplicate add book.
    _.each(searchResponse, function(element, index) {
      if (flag && parseInt(this.id) === index) {
        listOfBooks.push(element);

        // Set progress of newly added book to zero.
        listOfBooks[listOfBooks.length - 1].progress = 0;

        return setListOfBooks();
      }
    }.bind(passedThis));
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Update pages read. If book complete push to completed list. 
  var pagesRead = function(listObj, elDOM) {
    var toGoPages = listObj.pagecount - listObj.progress;

    // If book is current book update DOM elements.
    if (listObj.title === currentBook.title) {
      $('#pagesRead').innerHTML = listObj.progress + ' read - ' + 
        toGoPages + ' to go!';

      $('#percentComplete').innerHTML = Math.floor((listObj.progress / 
        currentBook.pagecount) * 100) + '% completed!';

      if (toGoPages === 0) {
        $('#pageAlert').innerHTML = 'Book Completed! Pick new book!!!';
      }
    }

    // If all pages read remove from list, add to completed list
    if (toGoPages === 0) {
      _.each(listOfBooks, function(element, index) {
        if (listObj.title === element.title) {
          completedBooks.push(element);
          listOfBooks.splice(index, 1);
          elDOM.remove();        
        }
      }); 
      return setCompletedBooks();
    };
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Clear search results onclick.
  $('#clear').onclick = function() {
    searchResponse = [];
    $('#searchResults').innerHTML = '';
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Toggle content.
  var toggleButtons = function(listButton, el) {
    listButton.onclick = function() {
      if (el.style.display === 'none') {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }
  };

  toggleButtons($('#toggleBookList'), $('#bookList'));
  toggleButtons($('#toggleCompletedList'), $('#completedBooks'));
//------------------------------------------------------------------------------

/*
 - additional feature.
 - additional feature.
 - Use Local Storage to hold onto the user's chosen booklist.
 - Use Higher Order functions on my data.
 - Create my own higher order functions. 
*/
