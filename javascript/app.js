//--Custom Library--------------------------------------------------------------
  // Object to store custom library.
  var _ = {};

  // QuerySelector. So I don't have to keep writing document.getElementByID. 
  var $ = function(selector) {
    // Returns value allowing me to use $(seletor) from now on. 
    return document.querySelector(selector);
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

  // Make element function
  // Make div function
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


//------------------------------------------------------------------------------
  // Populate search results
  function searchResult() {
    _.each(searchResponse, createDiv);
    function createDiv(element) {
      // Create new div 
      var newDiv = document.createElement('div');
      newDiv.className = 'searchResult';
      // Create new paragraph for div
      var newParagraph = document.createElement('p');
      newParagraph.innerHTML = element.title;
      newDiv.appendChild(newParagraph);

      // Create add button
      var newButton = document.createElement('button');
      newButton.className = 'addBookButton';
      newButton.innerHTML = 'Add to book list';
      newDiv.appendChild(newButton);

      // Add each result on top of the last
      var currentDiv = document.getElementById('div1');
      document.getElementById('searchResults').insertBefore(newDiv, currentDiv);
      newButton.onclick = addToListofBooks;
    }
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Add book to listofbooks array.
  function addToListofBooks() {
    for (var i = 0; i < searchResponse.length; i++) {
      if (this.parentNode.firstChild.innerHTML === searchResponse[i].title) {
        listofBooks.push(searchResponse[i]);

        // Create new div 
        var newDiv = document.createElement('div');
        newDiv.className = 'book';
        // Create new paragraph for div
        var newParagraph = document.createElement('p');
        newParagraph.innerHTML = searchResponse[i].title;
        newDiv.appendChild(newParagraph);

        // Create star button
        var starButton = document.createElement('button');
        starButton.className = 'current';
        starButton.innerHTML = 'Set as current';
        newDiv.appendChild(starButton);

        // Create remove button
        var removeButton = document.createElement('button');
        removeButton.className = 'removeBook';
        removeButton.innerHTML = 'Remove';
        newDiv.appendChild(removeButton);

        // Add each book on top of the last
        var currentDiv = document.getElementById('div1');
        document.getElementById('bookList').insertBefore(newDiv, currentDiv);
        // starButton.onclick = setAsCurrent;
        removeButton.onclick = removeBook;
      }
    }
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Remove book from book list
  function removeBook() {
    // Loop through the listofBooks to compare the objects title to the title of
    // the clicked book
    for (var i = 0; i < listofBooks.length; i++) {
      // If the listofBooks objects title is equal to the clicked objects title
      // remove this object from list
      if (this.parentNode.firstChild.innerHTML === listofBooks[i].title) {
        listofBooks.splice(i, 1);
        this.parentNode.remove();
      }
    } 
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Create selected book


//------------------------------------------------------------------------------


/*----Tweaqs--------------------------------------------------------------------
  - Need to add alerts back into search. It needs to alert when search input is 
    empty on 'click' and on 'input'. So when user it filling alert goes away.
  - Need to make the return key work for search.
  - Make it so if book is already on reading list you can delete it.
  - Make it so api doesn't grab sample books or duplicates.
------------------------------------------------------------------------------*/
