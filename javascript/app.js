//--Custom Library--------------------------------------------------------------
  // Object to store custom library.
  var _ = {};

  // QuerySelector. So I don't have to keep writing document.getElementByID. 
  var $ = function(selector, el) {
    // If element is not given as an argument.
    if (!el) {
      // el is equal to the document object.
      el = document; 
    }
    // Returns value of selector allowing me to use $(seletor) from now on. 
    return el.querySelector(selector);
  }

  // QuerySelector. For document.getElementByClassName. 
  var $$ = function(selector, el) {
    // If element is not given as an argument.
    if (!el) {
      // el is equal to the document object.
      el = document;
    }
    // Returns value of selector as an array of all elements with class. 
    return Array.prototype.slice.call(el.querySelectorAll(selector));
  }

  // each method so I don't have to keep writing for loops. 
  _.each = function(list, callback) {
    // If list is an array loop through use a standard for loop.
    if (Array.isArray(list)) {
      for (var i = 0; i < list.length; i++) {
        // Calls function to be used at a later time passing element, index and
        // complete list for later use.
        callback(list[i], i, list);
      }
    } else {
      // If list is not an array it must be an object so use a for in loop.
      for (var key in list) {
        // Replaces i with key because using for in.
        callback(list[key], key, list);
      }
    }
  }

  // Make element function.
  _.makeElement = function(type, text, elementClass, id, parentElement) {
    // Create add new element for a parent element.
    var newElement = document.createElement(type);

    if (text != undefined) {
      // Set element.
      newElement.innerHTML = text;
    }
    if (elementClass != undefined) {
      // Give element class name for styling.
      newElement.className = elementClass;
    }
    if (id != undefined) {
      // Set element id.
      newElement.id = id;
    }

    // Append button to div after paragraph is already appended so its last.
    return parentElement.appendChild(newElement);
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Global variables.
    // Button for search.
    var searchButton = $('#searchButton');
    // Array of search results.
    var searchResponse = [];
    // Array of books on list.
    var listOfBooks = [];
    // Array of completed books.
    var completedBooks = [];
    // Current Book.
    var currentBook = {};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Retrieve API results.
  function bookApi() {
    // Variable for search parameters.
    var searchInput = $('#searchInput');
    
    // Clear any previous search results.
    searchResponse = [];
    $('#searchResults').innerHTML = '';
    
    // Add information needed for app to a usable array named searchResponse.
    function handleResponse() {
      // Parse JSON Data for use.
      var convert = JSON.parse(this.responseText);

      // Call function to handle creation of a results object.
      _.each(convert.items, function(element) {
        // Item = element at index.
        var item = element;

        // Create object out of api results and push to global variable for use.
        searchResponse.push({ 
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors[0],
          description: item.volumeInfo.description,
          pagecount: item.volumeInfo.pageCount, 
          thumbnail: item.volumeInfo.imageLinks.thumbnail,
          // progress added to track book complettion if added to list
          progress: 0
        });
      });
      // Returns searchResult to display actual information to DOM. 
      return searchResult();
    }


    // Initializes api request. 
    function get(url) {
      // Saving request in variable.
      var request = new XMLHttpRequest();
      // Forces handleResponse to fire after load is complete.
      request.addEventListener('load', handleResponse);
      // Opening request using url from result from scriptForSearch.
      request.open('GET', url);
      // Sends request.
      request.send();
    }


    // Creates script for search.
    function scriptForSearch() {
      // Converts string entered into an array.
      var input = searchInput.value.split(' ');
      // scriptString holds string with +'s added.
      var scriptString = '';
      // Holds the resulting url.
      var result = '';

      // Loops through array and adds + were applicable.
      _.each(input, function createScript(element, index) {
        // If search parameter is not the last parameter add '+'. 
        if (index != input.length - 1) {
          scriptString += input[index] + '+'; 
        } else {
          // If search paramter is the last one don't add '+'.
          scriptString += input[index];
        }
      });
      // Add custom string to google api tag.
      result = 'https://www.googleapis.com/books/v1/volumes?q='+ 'harry+Potter';
      // Fires get function which gets the actual material from api.
      return get(result);
    }
    // Fires scriptForSearch function to create custom search based on input.
    return scriptForSearch();
  }

  // Add event listener to search button so when clicked bookApi fires.
  window.addEventListener('load', bookApi);
//------------------------------------------------------------------------------

/*
  - Need to add alerts back into search. It needs to alert when search input is 
    empty on 'click' and on 'input'. So when user it filling alert goes away.
  - Need to make the return key work for search.
  - Make it so api doesn't grab sample books or duplicates.
  - Need to fix issue where if thumbnail is undefined it will still run.
*/

//------------------------------------------------------------------------------
  // Populate search results.
  function searchResult() {
    // Iterate over searchResponse and fire function to create Div on each.
    _.each(searchResponse, function(element) {
      // Create new div for each search result.
      var newDiv = document.createElement('div');
      // Give div a class name for styling.
      newDiv.className = 'searchResult';

      // Create new paragraph for div to hold title and append to div.
      _.makeElement('p', element.title, undefined, undefined, newDiv);

      // Create new paragraph for div to hold title and append to div.
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
  // Add book to listOfBooks array.
  function addTolistOfBooks() {
    // Save the div that was added from the previous funciton to variable.
    var passedThis = this.parentNode.firstChild.innerHTML;

    // Loop through search responses to compare titles to clicked element.
    _.each(searchResponse, function(element) {
      // If they match push element from search list to book list.
      if (passedThis === element.title) {
        listOfBooks.push(element);

        // Also create a div with the added books info to display to user.
        function createDiv() {
          // Create new div. 
          var newDiv = document.createElement('div');
          newDiv.className = 'book';

          // Create new paragraph for div.
          _.makeElement('p', element.title, undefined, undefined, newDiv);

          // Create star button for div.
          _.makeElement('button', 'Set as current', 'setCurrent', undefined, 
            newDiv);

          // Create remove button for div.
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
//------------------------------------------------------------------------------

/*
  - Need to fix multiples being added to list. Think another loop and if 
    statement to check against elements already existing in list is all we need.
*/

//------------------------------------------------------------------------------
  // Remove book from book list
  function removeBook() {
    // Save passed this to variable.
    var passedThis = this.parentNode;

    // Iterate over list of books and apply a function to remove from list.
    _.each(listOfBooks, function(element, index) {
      // If the listOfBooks objects title is equal to the clicked objects title
      // remove this object from list
      if (passedThis.firstChild.innerHTML === element.title) {
        // Remove this object from list.
        listOfBooks.splice(index, 1);        
        // Remove object from DOM.
        passedThis.remove();
      }
    });
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Create selected book.
  function createCurrent() {
    // Save passed this to variable.
    var passedThis = this.parentNode;

    // Loop through list of books to compare to book clicked.
    _.each(listOfBooks, function(element, index) {
      // If the clicked books title equals the book in list
      if (passedThis.firstChild.innerHTML === element.title) {

        currentBook = element;
        // Make book in list current book and display as such.
        $('#bookCover').src = currentBook.thumbnail;
        $('#title').innerHTML = currentBook.title;
        $('#author').innerHTML = 'Author: ' + currentBook.author;
        $('#pagesRead').innerHTML = '0 pages read - ' + currentBook.pagecount + 
        ' pages to go!';
        $('#percentComplete').innerHTML = '0% completed!';
        $('#pageInput').nextSibling.onclick = pagesRead;
      }
    });
  }

//------------------------------------------------------------------------------

/*
  - When current is set make a marker that says so and remove set as current
    button cause its already been set. When current changed put button back.
  - Save any progress made on book if current is changed. 
  - Need to create a button to update current page.
*/ 

//------------------------------------------------------------------------------
  // Function to accept pages read.
  function pagesRead() {
    // Make input a number using parseInt.
    var input = parseInt($('#pageInput').value);

    // If input is not a number.
    if ( isNaN(input) ) {
      // Display this Alert under the input box.
      $('#pageAlert').innerHTML = 'Please enter a number!';
    } else {
      var readPages = input;
      var toGoPages = currentBook.pagecount - input;
      // Clear alert if alert has been triggered pior.
      $('#pageAlert').innerHTML = '';
      // Clear field input
      $('#pageInput').value = '';

      $('#pagesRead').innerHTML = readPages + ' read - ' + toGoPages +
      ' to go!';
      $('#percentComplete').innerHTML = 'percentDone' + '% completed!';

      return percentComplete;
    }
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Function to calculate percent complete.
  function percentComplete() {
    
  }
//------------------------------------------------------------------------------























































