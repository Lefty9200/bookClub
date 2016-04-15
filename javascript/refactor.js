//--Global Variables------------------------------------------------------------
  var searchResponse = [];
  // If global variables saved to local use that otherwise use empty values.
  var listOfBooks = JSON.parse(localStorage.getItem('listOfBooks')) || [];
  var completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
  var currentBook = JSON.parse(localStorage.getItem('currentBook')) || {};
//------------------------------------------------------------------------------


//--Populate DOM----------------------------------------------------------------

  // If a global array is not empty populate the DOM with elements. 
  window.onload = function() {
    _.populateDOM(listOfBooks, setListOfBooks);
    _.populateDOM(completedBooks, setCompletedBooks);
    _.populateDOM(currentBook, setCurrent);
  };
//------------------------------------------------------------------------------


//--Local Storage---------------------------------------------------------------

  // Save lists to local storage before closing of window.
  window.onbeforeunload = function() {
     localStorage.setItem('listOfBooks', JSON.stringify(listOfBooks));
     localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
     localStorage.setItem('currentBook', JSON.stringify(currentBook));
     // localStorage.clear();
     // sessionStorage.clear();

     return null;
  };
//------------------------------------------------------------------------------


//--List of Books DOM-----------------------------------------------------------

  // Function to create DOM elements for List of Books.
  function setListOfBooks() {
    // Clear previous list. 
    _.clear($('#bookList'));

    // Create DOM elements for new book. 
    var createBook = function(bookObj) {
      var parentDiv = $('div', true).addClass('book').addSelected(bookObj.title);
      var title = $('h3', true).addClass('bookTitle').addText(bookObj.title);
      var author = $('p', true).addClass('bookAuthor').addText('By: ' + bookObj.author);
      var currentButton = $('button', true).addClass('setCurrent');
      var completeButton = $('button', true).addClass('markComplete');
      var removeButton = $('button', true).addClass('removeBook');

      // Used concat to save all DOM elements into one array to append to parentDiv.
      var content = title.concat(author, currentButton, completeButton, removeButton);

      return parentDiv.append(content);
    };

    // Used map to iterate over global object and use createBook on each iteration.
    var result = _.map(listOfBooks, createBook);

    // Finally append to DOM element to display to user.
    $('#bookList').append(result);

    // Now all DOM elements are appended. Set click functionality.
    $('.setCurrent').setOnClick(currentFromClick);
    $('.markComplete').setOnClick(markComplete);
    $('.removeBook').setOnClick(removeBook);
  };
//------------------------------------------------------------------------------



//--Completed Books DOM---------------------------------------------------------

  // Function to create DOM elements for Completed Books.
  function setCompletedBooks() {
    // Clear previous list.
    _.clear($('#completedBooks'));

    // Create DOM elements for new book. 
    var createBook = function(bookObj) {
      var parentDiv = $('div', true).addClass('completed');
      var title = $('h3', true).addClass('bookTitle').addText(bookObj.title);
      var author = $('p', true).addClass('bookAuthor').addText('By: ' + bookObj.author);
      var dateComplete = $('p', true).addClass('dateComplete').addText('Completed on: ' + bookObj.dateComplete);
      var removeButton = $('button', true).addClass('removeBook');

      // Used concat to save all DOM elements into one array to append to parentDiv.
      var content = title.concat(author, dateComplete, removeButton);

      return parentDiv.append(content);
    };

    // Used map to iterate over global object and use createBook on each iteration.
    var result = _.map(completedBooks, createBook);

    // Finally append to DOM element to display to user.
    $('#completedBooks').append(result);

    // Now all DOM elements are appended. Set click functionality.
    $('.removeBook').setOnClick(removeBook);
  };
//------------------------------------------------------------------------------


//--Set Current Book DOM--------------------------------------------------------

  // Function to set current book if current book already exists or set current 
  // book from book selected from booklist. 
  function setCurrent() {

    // Checks if page input is valid. 
    var checkInput = function() {

      var input = parseInt($('#pageInput').firstChild.value);
      $('#pageInput').firstChild.value = '';

      if (isNaN(input)) {
        $('#pageAlert').addText('Please enter a number!');
      } else if (input > currentBook.pagecount || input <= 0) {
        $('#pageAlert').addText('Page number entered does not exist!');
      } else {
        $('#pageAlert').addText('');
        // If input valid update progress and pass to pagesRead.
        currentBook.progress = input;
        return pagesRead(currentBook, $('#selected'));
      }
    };

    // If book complete button clicked update progress and pass to pagesRead.
    var bookComplete = function() {
      currentBook.progress = currentBook.pagecount;
      return pagesRead(currentBook, $('#selected'));
    };

    // Elements for book already defined in html doc. Update to currentBook properties. 
    $('#bookCover').addAttribute('src', currentBook.thumbnail);
    $('#title').addText(currentBook.title);
    $('#author').addText('Author: ' + currentBook.author);
    $('#pagesRead').addText(currentBook.progress +' pages read - ' + 
      (currentBook.pagecount - currentBook.progress) + ' pages to go!');
    $('#percentComplete').addText(Math.floor((currentBook.progress / 
      currentBook.pagecount) * 100) + '% completed!');

    // Display input bar.
    $('#pageInput').style.display = 'block';

    // Set click functionality.
    $('#pageInput').firstChild.nextSibling.onclick = checkInput;
    $('#pageInput').lastChild.onclick = bookComplete
  };
//------------------------------------------------------------------------------


//--Search Results--------------------------------------------------------------
$('#searchButton').addEventListener('click', function() {

  // Populates searchResponse Array with info grabbed from API and sets searchResults in DOM.
  var populateResults = function() {
    var convert = JSON.parse(this.responseText);
    // Set index equal to zero;
    var index = 0;

    _.each(convert.items, function(element) {
      var book = element.volumeInfo;

      // If book has all parameters push book to search result and update index.
      if (book.authors !== undefined && book.description !== undefined && 
        book.pageCount !== undefined && book.imageLinks !== undefined) {

        searchResponse.push({ 
          title: book.title,
          author: book.authors[0],
          description: book.description,
          pagecount: book.pageCount, 
          thumbnail: book.imageLinks.thumbnail,
          searchIndex: index
        });

        index += 1;

        // Clear for next search.
        _.clear($('#searchInput'), 'value');
      }
    });

    // Create DOM elements for new book. 
    var createBook = function(bookObj) {
      var parentDiv = $('div', true).addClass('searchResult').addId(bookObj.searchIndex);
      var title = $('h3', true).addClass('bookTitle').addText(bookObj.title);
      var author = $('p', true).addClass('bookAuthor').addText('By: ' + bookObj.author);
      var description = $('p', true).addClass('description').addText('Description: <br>'+ bookObj.description);
      var addButton = $('button', true).addClass('addBook');

      // Used concat to save all DOM elements into one array to append to parentDiv.
      var content = title.concat(author, description, addButton);

      return parentDiv.append(content);
    };

    // Used map to iterate over global object and use createBook on each iteration.
    var result = _.map(searchResponse, createBook);

    // Finally append to DOM element to display to user.
    $('#searchResults').append(result);

    // Now all DOM elements are appended. Set click functionality.
    $('.addBook').setOnClick(addTolistOfBooks);
  };

  // Create search url based on input.
  var searchInput = $('#searchInput').value.split(' ').join('+');
  var url = 'https://www.googleapis.com/books/v1/volumes?q=' + searchInput;

  // Clear previous search results.
  searchResponse = [];
  _.clear($('#searchResults'));

  // Confirm input valid;
  if (searchInput.length === 0) {
    $('#searchAlert').addText('Please enter a search parameter!');
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
    // Save the parentNode of the button pressed for use in function.
    var passedThis = this.parentNode;
    var flag = true;

    // Don't allow duplicates to be added.
    _.each(listOfBooks, function(element, index) {
      if (element.title === this.firstChild.innerHTML) {
        flag = false;
      }
    }.bind(passedThis));

    // If not a duplicate add book.
    _.each(searchResponse, function(element, index) {
      if (flag && parseInt(this.id) === index) {
        listOfBooks.push(element);

        // Set progress of newly added book to zero.
        listOfBooks[listOfBooks.length - 1].progress = 0;

        return setListOfBooks();
      };
    }.bind(passedThis));
  };
//------------------------------------------------------------------------------


//--Current from List of Books--------------------------------------------------

  // Set current book from list of books when clicked.
  var currentFromClick = function() {
    // Save the parentNode of the button pressed for use in function.
    var passedThis = this.parentNode;

    // Change selected book in list to current. 
    if ($('#selected')) {
      $('#selected').removeAttribute('id');
    };
    
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
    // Save the parentNode of the button pressed for use in function.
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
    // Save the parentNode of the button pressed for use in function.
    var passedThis = this.parentNode;
    var list = listOfBooks;

    // If being removed from commpleted set list to completedBooks.
    if (passedThis.className === 'completed') {
      list = completedBooks;
    };

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
    _.each(list, function(element, index) {
      if (this.firstChild.innerHTML === element.title) {
        list.splice(index, 1);        
        this.remove();
      }
    }.bind(passedThis));
  }; 
//------------------------------------------------------------------------------


//--Pages Read------------------------------------------------------------------

  // Update pages read. If book complete push to completed list. 
  var pagesRead = function(listObj, elDOM) {
    var toGoPages = listObj.pagecount - listObj.progress;

    // If book is current book update DOM elements.
    if (listObj.title === currentBook.title) {
      $('#pagesRead').addText(listObj.progress + ' read - ' + 
        toGoPages + ' to go!');

      $('#percentComplete').addText(Math.floor((listObj.progress / 
        currentBook.pagecount) * 100) + '% completed!');

      if (toGoPages === 0) {
        $('#pageAlert').addText('Book Completed! Pick new book!!!');
      }
    };

    // If all pages read remove from list, add to completed list.
    if (toGoPages === 0) {
      // Grab current date and rearange in m/d/yyyy format.
      var date = new Date();
      date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

      _.each(listOfBooks, function(element, index) {
        if (listObj.title === element.title) {
          listObj.dateComplete = date;
          completedBooks.push(element);
          listOfBooks.splice(index, 1);
          elDOM.remove();        
        }
      }); 
      return setCompletedBooks();
    };
  };
//------------------------------------------------------------------------------


//--List Clears-----------------------------------------------------------------

  // Clear search results onclick.
  $('#clear').onclick = function() {
    searchResponse = [];
    $('#searchResults').addText('');
  };
//------------------------------------------------------------------------------


//--Toggle Lists----------------------------------------------------------------

  // Toggle content in DOM.
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