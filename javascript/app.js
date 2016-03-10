//--Custom Library--------------------------------------------------------------
  // Made an empty Object to store a custom library.
  var _ = {};

  // Made a QuerySelector function. So I don't have to keep writing 
  // document.getElementByID or document.querySelector.
  // Takes two arguments, both to be used in querySelector method. 
  var $ = function(selector, el) {
    // Check if the element is not given as an argument.
    if (!el) {
      el = document; 
    }
    // Returns value of selector allowing me to use $(seletor) from now on. 
    return el.querySelector(selector);
  }

  // Created each method so I don't have to keep writing for loops. 
  _.each = function(list, callback) {
    // If list argument passed is an array
    if (Array.isArray(list)) {
      // Use a standard for loop.
      for (var i = 0; i < list.length; i++) {
        // Calls function to be used at a later time passing element, index and
        // complete list for later use.
        callback(list[i], i, list);
      }
    } else {
      // If list agument passed is not an array use a for in loop for an object.
      for (var key in list) {
        // Replaces i with key because using for in.
        callback(list[key], key, list);
      }
    }
  }

  // Make element function to shorten the create element process later.
  _.makeElement = function(type, text, elementClass, id, parentElement) {
    // Create new element for the parentElement passed.
    var newElement = document.createElement(type);

    // Used ternary operators to make new elements if function provided values.
    text != undefined ? newElement.innerHTML = text : undefined;
    elementClass != undefined ? newElement.className = elementClass : undefined;
    id != undefined ? newElement.id = id : undefined;

    return parentElement.appendChild(newElement);
  }

  // Make method to check if an object is empty. Use for current book variable
  _.isItEmpty = function(object) {
    // Loop through object. Not really a loop cause looking for one key.
    for(var key in object) {
      // Check if object has property. In this case any property.
      if(object.hasOwnProperty(key)) {
        // If it has a property return false because not empty.
        return false;
      }
    }
    // If it doesn't have a property return true cause empty. 
    return true;
  }    
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Global variables.
    var searchButton = $('#searchButton');
    var searchInput = $('#searchInput');
    var searchClear = $('#clear');
    var toggleBookList = $('#toggleBookList');
    var toggleCompletedList = $('#toggleCompletedList');

    // Arrays to store data for later use and keep track of user input.
    var searchResponse = [];
    var listOfBooks = [];
    var completedBooks = [];
    var currentBook = {};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Function for setting html elements to current book.
  function setCurrent(arg) {
    // Make book in list current book and display as such.
    $('#bookCover').src = currentBook.thumbnail;
    $('#title').innerHTML = currentBook.title;
    $('#author').innerHTML = 'Author: ' + currentBook.author;
    $('#pagesRead').innerHTML = currentBook.progress +' pages read - ' + 
      (currentBook.pagecount - currentBook.progress) + ' pages to go!';
    $('#percentComplete').innerHTML = Math.floor((currentBook.progress / 
      currentBook.pagecount) * 100) + '% completed!';

    // Make page input visible for use.
    $('#pageInput').style.display = 'block';

    // Set pageInputs button onclick to necessary functions.
    $('#pageInput').firstChild.nextSibling.onclick = pagesRead;
    $('#pageInput').lastChild.onclick = function() {
      currentBook.progress = currentBook.pagecount;

      return pagesRead();
    };
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Function to hide current books info unless current book is already selected
  // Thinking of future functionality when saving lists to a JSON file in db.
  function checkIfCurrent(arg) {
    if (_.isItEmpty(arg)) {
      // Make pageInput hidden because current book not selected.
      $('#pageInput').style.display = 'none';
    } else {
      return setCurrent(currentBook);
    }
  }
  // Fire checkIfCurrent with currentBook object as an argument.
  checkIfCurrent(currentBook);
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Populate search results in the DOM.
  function searchResult() {
    _.each(searchResponse, function(element, index) {

      var newDiv = document.createElement('div');
      newDiv.className = 'searchResult';
      newDiv.id = index;

      // Create new elements for div.
      _.makeElement('h3', element.title, undefined, undefined, newDiv);
      _.makeElement('p', 'By: ' + element.author, undefined, undefined, newDiv);
      
      _.makeElement('p', 'Description: <br>'+ element.description, undefined
        , undefined, newDiv);

      _.makeElement('button', 'Add to book list', 'addBookButton', undefined, 
        newDiv);

      // Add each result on top of the last.
      var currentDiv = document.getElementById('div1');
      document.getElementById('searchResults').insertBefore(newDiv, currentDiv);

      // Add an onclick referance to addTolistOfBooks for earch new div.
      newDiv.lastChild.onclick = addTolistOfBooks;
    });
  }
//------------------------------------------------------------------------------  


//------------------------------------------------------------------------------
  // Retrieve API results.
  function bookApi() {
    // Display error if no input value was given when search button pressed.
    if (searchInput.value.length === 0) {
      $('#searchAlert').innerHTML = 'Please enter a search parameter!';
    } else {
      $('#searchAlert').innerHTML = '';
    }
    
    // Clear any previous search results in both arrays and DOM.
    searchResponse = [];
    $('#searchResults').innerHTML = '';

    // Add information needed for app to a usable array named searchResponse.
    function handleResponse() {
      // Save parsed JSON Data.
      var convert = JSON.parse(this.responseText);

      // Create object out of api results and push to global variable for use.
      _.each(convert.items, function(element, index) {

        var book = element.volumeInfo;

        // Check that all values exist.
        if (book.authors !== undefined && book.description !== undefined && 
          book.pageCount !== undefined && book.imageLinks !== undefined) { 

          searchResponse.push({ 
            title: book.title,
            author: book.authors[0],
            description: book.description,
            pagecount: book.pageCount, 
            thumbnail: book.imageLinks.thumbnail
          });
        }

        $('#searchInput').value = '';
      });
      // Returns searchResult to display actual information to DOM. 
      return searchResult();
    }


    // Initializes api request. 
    function get(url) {
      var request = new XMLHttpRequest();
      // Forces handleResponse to fire after load is complete.
      request.addEventListener('load', handleResponse);
      // Opening request using url from result from scriptForSearch.
      request.open('GET', url);
      
      request.send();
    }


    // Creates script for search.
    function scriptForSearch() {
      var input = searchInput.value.split(' ');
      var scriptString = '';
      // Holds the resulting url.
      var result = '';

      // Loops through array and adds + were applicable.
      _.each(input, function(element, index) {
        if (index != input.length - 1) {
          scriptString += element + '+'; 
        } else {
          scriptString += element;
        }
      });
      result = 'https://www.googleapis.com/books/v1/volumes?q='+ scriptString;
      // Fires get function which gets the actual material from api.
      return get(result);
    }
    // Fires scriptForSearch function to create custom search based on input.
    return scriptForSearch();
  }
  searchButton.addEventListener('click', bookApi);
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Add book to listOfBooks array.
  function addTolistOfBooks() {
    // Save the element that was clicked for use in loops.
    var passedThis = this.parentNode;
    // Create flag that will change if book is already in book list.
    var flag = true;

    for (var i = 0; i < listOfBooks.length; i++) {
      if (listOfBooks[i].title === passedThis.firstChild.innerHTML) {
        flag = false;
      }
    }

    if (flag) {
      _.each(searchResponse, function(element, index) {
        if (parseInt(passedThis.id) === index) {
          // Push matching book from searchResponses to listOfBooks
          listOfBooks.push(element);

          // Target last book added to list and add progress property to element.
          listOfBooks[listOfBooks.length -1].progress = 0;

          // Also create a div with the added books info to DOM.
          function createDiv() {
            var newDiv = document.createElement('div');
            newDiv.className = 'book';

            _.makeElement('h3', element.title, undefined, undefined, newDiv);

            _.makeElement('p', 'By: ' + element.author, undefined, undefined, 
              newDiv);

            _.makeElement('button', 'Set as current', 'setCurrent', undefined, 
              newDiv);

            _.makeElement('button', 'Remove', 'removeBook', undefined, newDiv);

            // Add each book on top of the last.
            var currentDiv = document.getElementById('div1');
            document.getElementById('bookList').insertBefore(newDiv, currentDiv);

            // Set new buttons onclick to funciton.
            newDiv.lastChild.previousSibling.onclick = createCurrent;
            newDiv.lastChild.onclick = removeBook;
          }

          // Fire createDiv function.
          return createDiv();
        }
      });
    }
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Remove book from book list
  function removeBook() {
    var passedThis = this.parentNode;

    // If book being removed is current.
    if (passedThis.firstChild.innerHTML === currentBook.title) {
      // Clear both DOM and element.
      currentBook = {};
      $('#bookCover').src = '';
      $('#title').innerHTML = '';
      $('#author').innerHTML = '';
      $('#pagesRead').innerHTML = '';
      $('#percentComplete').innerHTML = '';

      // Make page input invisible.
      $('#pageInput').style.display = 'none'; 
    }

    _.each(listOfBooks, function(element, index) {
      if (passedThis.firstChild.innerHTML === element.title) {
        // Remove this object from array and DOM.
        listOfBooks.splice(index, 1);        
        passedThis.remove();
      }
    });
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Create selected book.
  function createCurrent() {
    var passedThis = this.parentNode;

    // If there is a current book already.
    if ($('#selected')) {
      $('#selected').removeAttribute('id');
    }

    passedThis.id = 'selected';

    // Clear alert if alert has been triggered prior.
    $('#pageAlert').innerHTML = '';

    _.each(listOfBooks, function(element, index) {
      if (passedThis.firstChild.innerHTML === element.title) {
        // currentBook variable points to element
        currentBook = element;

        //  Set Current html elements to currentBook.
        return setCurrent(currentBook);
      }
    });
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Function to accept pages read.
  function pagesRead() {

    if (currentBook.progress === currentBook.pagecount) {
      return updatePages();
    } else {
      var input = parseInt($('#pageInput').firstChild.value);
      $('#pageInput').firstChild.value = '';

      // First check if input is empty.
      if (isNaN(input)) {
        $('#pageAlert').innerHTML = 'Please enter a number!';
      } else {
        // Then check if input is greater than pagecount.
        if (input > currentBook.pagecount || input <= 0) {
          $('#pageAlert').innerHTML = 'Page number entered does not exist!';
        } else {
          // If neither checks are true set current page of current book.
          currentBook.progress = input;

          return updatePages();
        }
      }
    }

    function updatePages() {
      // Clear alert if alert has been triggered pior.
      $('#pageAlert').innerHTML = '';
      $('#pageInput').value = '';

      var toGoPages = currentBook.pagecount - currentBook.progress;

      // Set DOM elements.
      $('#pagesRead').innerHTML = currentBook.progress + ' read - ' + 
        toGoPages + ' to go!';

      $('#percentComplete').innerHTML = Math.floor((currentBook.progress / 
        currentBook.pagecount) * 100) + '% completed!';

      if (currentBook.progress === currentBook.pagecount) {
        $('#pageAlert').innerHTML = 'Book Completed! Pick new book!!!';

        // Completed books array.
        _.each(listOfBooks, function(element, index) {
          if (currentBook === element) {
            // Push book to completed list then remove from listOfBooks and DOM. 
            completedBooks.push(element);
            listOfBooks.splice(index, 1);        
            $('#selected').remove();
          }
        });
        // Add completed book to DOM.
        return addToCompletedBooks();
      }     
    }
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Completed books array.
  function completed() {
    _.each(listOfBooks, function(element, index) {
      if (currentBook === element) {
        // Push book to completed list then remove from listOfBooks and DOM. 
        completedBooks.push(element);
        listOfBooks.splice(index, 1);        
        $('#selected').remove();
      }
    });
    // Add completed book to DOM.
    return addToCompletedBooks();
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Add Completed Books to DOM.
  function addToCompletedBooks() {
    $('#completedBooks').innerHTML = '';
    // Loop through completed books array to update DOM with current completed.
    _.each(completedBooks, function(element) {

      var newDiv = document.createElement('div');
      newDiv.className = 'completed';

      _.makeElement('h3', element.title, undefined, undefined, newDiv);
      _.makeElement('p', 'By: ' + element.author, undefined, undefined, newDiv);

      // Add each book on top of the last.
      var currentDiv = document.getElementById('div1');
      document.getElementById('completedBooks').insertBefore(newDiv, currentDiv);
    });
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // If clear search button pressed clear both array and DOM of search results.
  searchClear.onclick = function clearSearch() {
    searchResponse = [];
    $('#searchResults').innerHTML = '';
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // On toggle click fire hide/show lists. 
  function toggleButtons( listButton, el) {
    listButton.onclick = function() {
      if (el.style.display === 'none') {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }
  }

  toggleButtons(toggleBookList, $('#bookList'));
  toggleButtons(toggleCompletedList, $('#completedBooks'));
//------------------------------------------------------------------------------