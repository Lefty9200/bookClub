//--Global Variables------------------------------------------------------------
  var searchResponse = [];
  var listOfBooks = JSON.parse(localStorage.getItem('listOfBooks')) || [];
  var completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
  var currentBook = JSON.parse(localStorage.getItem('currentBook')) || {};
//------------------------------------------------------------------------------


//--Populate DOM----------------------------------------------------------------
  // If an array is not empty populate the DOM with elements. 
  window.onload = function() {
    _.populateDOM(listOfBooks, setListOfBooks);
    _.populateDOM(completedBooks, setCompletedBooks);
    _.populateDOM(currentBook, setCurrent);
  };
//------------------------------------------------------------------------------


//--Local Storage---------------------------------------------------------------
  // Save lists to local storage before closing of window.
  window.onbeforeunload = function() {
     // localStorage.setItem('listOfBooks', JSON.stringify(listOfBooks));
     // localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
     // localStorage.setItem('currentBook', JSON.stringify(currentBook));
     localStorage.clear();
     sessionStorage.clear();

     return null;
  };
//------------------------------------------------------------------------------


//--List of Books DOM-----------------------------------------------------------
  // Function to create DOM elements for List of Books.
  function setListOfBooks() {
    // Clear previous list. 
    _.clear($('#bookList'));

    // Define elements for each book in list.
    var title = _.makeElement('h3', undefined, undefined, 'title');
    var author = _.makeElement('p', undefined, undefined, 'author');
    var currentButton = _.makeElement('button', 'setCurrent');
    var CompleteButton = _.makeElement('button', 'markComplete');
    var removeButton = _.makeElement('button', 'removeBook');

    var totalElements = [title, author, currentButton, CompleteButton, removeButton];

    // Create DOM with elements.
    _.createBook(listOfBooks, 'book', 'bookList', totalElements);
  };
//------------------------------------------------------------------------------

function createBook(bookObj) {
  var parentDiv = $('div', true).addClass('book');
  var title = $('h3', true).addClass('bookTitle').addText(bookObj.title);
  var author = $('p', true).addClass('bookAuthor').addText(bookObj.author);
  var currentButton = $('button', true).addClass('setCurrent');
  var completeButton = $('button', true).addClass('markComplete');
  var removeButton = $('button', true).addClass('removeBook');

  var content = title.concat(author, currentButton, completeButton, removeButton);
  return parentDiv.append(content);
}

var listOfBookDivs = _.map(listOfYourBooks, createBook);
[
  [title, author, asdf]
]

// go through listOfBookDivs
// append each to wherever

//--Completed Books DOM---------------------------------------------------------
  // Function to create DOM elements for Completed Books.
  // function setCompletedBooks() {
  //   // Clear previous list.
  //   _.clear($('#completedBooks'));

  //   // Define elements for each book in completed list.
  //   var title = _.makeElement('h3', undefined, undefined, 'title');
  //   var author = _.makeElement('p', undefined, undefined, 'author');

  //   var totalElements = [title, author];

  //   // Create DOM with elements.
  //   _.createBook(completedBooks, 'completed', 'completedBooks', totalElements);
  // };
//------------------------------------------------------------------------------


//--Set Current Book DOM----------------------------------------------------------------------------
  // Function to set current book if current book already exists or set current 
  // book from book selected from booklist. 
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

    // Check if progress input is valid when clicked.
    $('#pageInput').firstChild.nextSibling.onclick = function() {
      var input = parseInt($('#pageInput').firstChild.value);
      $('#pageInput').firstChild.value = '';
      if (isNaN(input)) {
        $('#pageAlert').innerHTML = 'Please enter a number!';
      } else if (input > currentBook.pagecount || input <= 0) {
        $('#pageAlert').innerHTML = 'Page number entered does not exist!';
      } else {
        currentBook.progress = input;
        // If input valid pass to pagesRead.
        return pagesRead(currentBook, $('#selected'));
      }
    };

    // Update progress of current book to 100% when clicked.
    $('#pageInput').lastChild.onclick = function() {
      currentBook.progress = currentBook.pagecount;
      // Pass arguments to pagesRead.
      return pagesRead(currentBook, $('#selected'));
    };
  };
//------------------------------------------------------------------------------


//--Search Results--------------------------------------------------------------
$('#searchButton').addEventListener('click', function() {
  // Populate searchResults array and Search Results DOM.
  var populateResults = function() {
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

    // Elements to be used for each result in the DOM.
    var title = _.makeElement('h3', undefined, undefined, 'title');
    var author = _.makeElement('p', undefined, undefined, 'author');
    var description = _.makeElement('p', undefined, undefined, 'description');
    var addButton = _.makeElement('button', 'addBook');

    var totalElements = [title, author, description, addButton];


    // Create DOM with elements.
    _.createBook(searchResponse, 'searchResult', 'searchResults', totalElements);

  };

  // Create search url based on input.
  var searchInput = $('#searchInput').value.split(' ').join('+');
  var url = 'https://www.googleapis.com/books/v1/volumes?q=' + searchInput;

  // Clear previous search results.
  searchResponse = [];
  _.clear($('#searchResults'));

  // Confirm input valid;
  if (searchInput.length === 0) {
    $('#searchAlert').innerHTML = 'Please enter a search parameter!';
  } else {
    _.clear($('#searchAlert'));
  };

  // Make request.
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('load', populateResults); 
});
//------------------------------------------------------------------------------


//--Search Result to List of Books----------------------------------------------
  // Add search result clicked to list of books.
  var addTolistOfBooks = function() {
    var passedThis = this.parentNode;
    var flag = true;

    // Don't allow duplicates to be added.
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


//--Current from List of Books--------------------------------------------------
  // Set current book from list of books when clicked.
  var currentFromClick = function() {
    var passedThis = this.parentNode;

    // Changed selected book in list to current. 
    if ($('#selected')) {
      $('#selected').removeAttribute('id');
    }
    passedThis.id = 'selected';

    // Clear any page alerts.
    _.clear($('#pageAlert'));

    // Set Current book from list of books.
    _.each(listOfBooks, function(element, index) {
      if (this.firstChild.innerHTML === element.title) {
        currentBook = element;

        return setCurrent();
      }
    }.bind(passedThis));
  };
//------------------------------------------------------------------------------


//--Mark Complete---------------------------------------------------------------
  // Set pagecount to 100% if mark complete button is pressed.
  var markComplete = function() {
    var passedThis = this.parentNode;
    var targetBook;

    _.each(listOfBooks, function(element, index) {
      if (this.firstChild.innerHTML === element.title) {
        targetBook = element;
        targetBook.progress = targetBook.pagecount;
      }
    }.bind(passedThis));
    // Pass targetBook and this to pagesRead for list update.
    return pagesRead(targetBook, passedThis);
  };
//------------------------------------------------------------------------------

//--Remove Book-----------------------------------------------------------------
  // Remove Book on click.
  var removeBook = function() {
    var passedThis = this.parentNode;

    // If the book to remove is current book clear current book DOM.
    if (passedThis.firstChild.innerHTML === currentBook.title) {
      currentBook = {};
      _.clear($('#bookCover'), 'src');
      _.clear($('#title'));
      _.clear($('#author'));
      _.clear($('#pagesRead'));
      _.clear($('#percentComplete'));
      _.clear($('#pageAlert'));

      // Hide input box.
      $('#pageInput').style.display = 'none';
    }

    // Remove from array and DOM.
    _.each(listOfBooks, function(element, index) {
      if (this.firstChild.innerHTML === element.title) {
        listOfBooks.splice(index, 1);        
        this.remove();
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
*/