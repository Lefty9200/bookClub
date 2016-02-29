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
    var listofBooks = [];
    // Array of completed books.
    var completedBooks = [];
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
      _.each(convert.items, createResult);
      function createResult(element) {
        // Item = element at index.
        var item = element;

        // Create object out of api results and push to global variable for use.
        searchResponse.push({ 
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors[0],
          description: item.volumeInfo.description,
          pagecount: item.volumeInfo.pageCount, 
          thumbnail: item.volumeInfo.imageLinks.thumbnail
        });
      }
      // Returns searchResult to display actual information to DOM. 
      return searchResult();
    }


    // Initializes api request 
    function get(url) {
      // Saving request in variable
      var request = new XMLHttpRequest();
      // Forces handleResponse to fire after load is complete
      request.addEventListener('load', handleResponse);
      // Opening request using url from result from scriptForSearch
      request.open('GET', url);
      // Sends request
      request.send();
    }


    // Creates script for search
    function scriptForSearch() {
      // Converts string entered into an array
      var input = searchInput.value.split(' ');
      // scriptString holds string with +'s added
      var scriptString = '';
      // Holds the resulting url
      var result = '';

      // Loops through array and adds + were applicable
      _.each(input, createScript);
      function createScript(element, index) {
        // If search parameter is not the last parameter add '+'. 
        if (index != input.length - 1) {
          scriptString += input[index] + '+'; 
        } else {
          // If search paramter is the last one don't add '+'.
          scriptString += input[index];
        }
      }
      // Add custom string to google api tag.
      result = 'https://www.googleapis.com/books/v1/volumes?q='+ scriptString;
      // Fires get function which gets the actual material from api.
      return get(result);
    }
    // Fires scriptForSearch function to create custom search based on input.
    return scriptForSearch();
  }

  // Add event listener to search button so when clicked bookApi fires.
  searchButton.addEventListener('click', bookApi);
//------------------------------------------------------------------------------

/*
  - Need to add alerts back into search. It needs to alert when search input is 
    empty on 'click' and on 'input'. So when user it filling alert goes away.
  - Need to make the return key work for search.
  - Make it so api doesn't grab sample books or duplicates.
*/

//------------------------------------------------------------------------------
  // Populate search results.
  function searchResult() {
    // Iterate over searchResponse and fire createDiv on each.
    _.each(searchResponse, createDiv);
    function createDiv(element) {
      // Create new div for each search result.
      var newDiv = document.createElement('div');
      // Give div a class name for styling.
      newDiv.className = 'searchResult';

      // Create new paragraph for div to hold title and append to div.
      _.makeElement('p', element.title, undefined, undefined, newDiv);

      // Create new paragraph for div to hold title and append to div.
      _.makeElement('button', 'Add to book list', 'addBookButton', undefined, newDiv);

      // Add each result on top of the last.
      var currentDiv = document.getElementById('div1');
      document.getElementById('searchResults').insertBefore(newDiv, currentDiv);

      // Add an onclick referance to addToListofBooks for earch new div.
      newDiv.lastChild.onclick = addToListofBooks;
    }
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Add book to listofbooks array.
  function addToListofBooks() {
    // Save the div that was added from the previous funciton to variable.
    var passedThis = this.parentNode.firstChild.innerHTML;

    // Loop through searchvresponses to compare titles to clicked element.
    _.each(searchResponse, pushToList);
    function pushToList(element) {
      // If they match push element from search list to book list.
      if (passedThis === element.title) {
        listofBooks.push(element);

        // Also create a div with the added books info to display to user.
        function createDiv() {
          // Create new div. 
          var newDiv = document.createElement('div');
          newDiv.className = 'book';

          // Create new paragraph for div.
          _.makeElement('p', element.title, undefined, undefined, newDiv);

          // Create star button for div.
          _.makeElement('button', 'Set as current', 'currentBook', undefined, newDiv);

          // Create remove button for div.
          _.makeElement('button', 'Remove', 'removeBook', undefined, newDiv);

          // Add each book on top of the last.
          var currentDiv = document.getElementById('div1');
          document.getElementById('bookList').insertBefore(newDiv, currentDiv);
          // Set new buttons onclick to funciton.
          newDiv.lastChild.previousSibling.onclick = createSelected;
          newDiv.lastChild.onclick = removeBook;
        }
        // Fire createDiv function.
        return createDiv();
      }
    }
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

    // Iterate over list of books and apply removeFromList function.
    _.each(listofBooks, removeFromList);
    function removeFromList(element, index) {
      // If the listofBooks objects title is equal to the clicked objects title
      // remove this object from list
      if (passedThis.firstChild.innerHTML === element.title) {
        // Remove this object from list.
        listofBooks.splice(index, 1);
        
        // Remove object from DOM.
        passedThis.remove();
      }
    } 
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Create selected book
  function createSelected() {
    
  }

//------------------------------------------------------------------------------

