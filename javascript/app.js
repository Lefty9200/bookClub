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

    // Used ternary operators to make new elements if function provided values.
    text != undefined ? newElement.innerHTML = text : undefined;
    elementClass != undefined ? newElement.className = elementClass : undefined;
    id != undefined ? newElement.id = id : undefined;

    // Append button to div after paragraph is already appended so its last.
    return parentElement.appendChild(newElement);
  }

  // Make method to check if an object is empty.
  _.isItEmpty = function(object) {
    // Loop through object. Not really a loop cause looking for one key.
    for(var key in object) {
      // Check if object has property. In this case any property.
      if(object.hasOwnProperty(key)) {
        // If it has a property return false cuase not empty.
        return false;
      }
    }
    // If it doesn't have a property return true cause empty. 
    return true;
  }    
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Global variables.
    // Button for search.
    var searchButton = $('#searchButton');
    // Variable for search parameters.
    var searchInput = $('#searchInput');
    // Array of search results.
    var searchResponse = [];
    // Array of books on list.
    var listOfBooks = [];
    // Array of completed books.
    var completedBooks = [];
    // currentBook variable points to element.
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
      currentBook.pagecount + ' pages to go!';
    $('#percentComplete').innerHTML = Math.floor((currentBook.progress / 
      currentBook.pagecount) * 100) + '% completed!';

    // Make page input visible for use.
    $('#pageInput').style.display = 'block';

    // Set pageInputs button onclick to pagesRead function.
    $('#pageInput').lastChild.onclick = pagesRead;
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Function to hide current books info unless current book is already selected
  // Thinking of future functionality when saving lists to a database.
  function checkIfCurrent(arg) {
    // If currentBook object is empty do this.
    if (_.isItEmpty(arg)) {
      // Leave current book html elements empty.
      // Make pageInput hidden because current book not selected.
      $('#pageInput').style.display = 'none';
    } else {
      // if not empty set currentBook html elements to currentBooks data.
      return setCurrent(currentBook);
    }
  }
  // Fire checkIfCurrent with currentBook object as an argument.
  checkIfCurrent(currentBook);
//------------------------------------------------------------------------------
  // Retrieve API results.
  function bookApi() {
    // Display error if no input value was given when search button pressed.
    if (searchInput.value.length === 0) {
      $('#alertStatement').innerHTML = 'Please enter a search parameter!';
    } else {
      $('#alertStatement').innerHTML = '';
    }
    
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

        // Clear Search Input.
        $('#searchInput').value = '';
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
      _.each(input, function(element, index) {
        // If search parameter is not the last parameter add '+'. 
        if (index != input.length - 1) {
          scriptString += input[index] + '+'; 
        } else {
          // If search paramter is the last one don't add '+'.
          scriptString += input[index];
        }
      });
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
  - Make it so api doesn't grab sample books or duplicates.
  - Need to fix issue where if thumbnail is undefined it won't run.
  - Make alerts more specific. when typing in it will clear alert, etc.
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

/*
  - Need to make search results display synopsys and author.
  - Need to make button to collapse search results.
*/

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

    // If there is a current book already.
    if ($('#selected')) {
      // Remove Id of selected book.
      $('#selected').removeAttribute('id');
    }

    // Give clicked book in book list id of selected.
    passedThis.id = 'selected';

    // Clear alert if alert has been triggered prior.
    $('#pageAlert').innerHTML = '';

    // Loop through list of books to compare to book clicked.
    _.each(listOfBooks, function(element, index) {
      // If the clicked books title equals the book in list
      if (passedThis.firstChild.innerHTML === element.title) {
        // currentBook variable points to element
        currentBook = element;

        return setCurrent(currentBook);
      }
    });
  }
//------------------------------------------------------------------------------

/*
  - When current is set make a marker that says so and remove set as current
    button cause its already been set. When current changed put button back.
*/ 

//------------------------------------------------------------------------------
  // Function to accept pages read.
  function pagesRead() {
    // Make input a number using parseInt.
    var input = parseInt($('#pageInput').firstChild.value);
    // Clear input to placeholder
    $('#pageInput').firstChild.value = '';

    // If input is not a number.
    if ( isNaN(input) ) {
      // Display this Alert under the input box.
      $('#pageAlert').innerHTML = 'Please enter a number!';
    } else {
      // If input is less than zero or greater than total bages in book.
      if (input > currentBook.pagecount || input <= 0) {
        // Display this alert.
        $('#pageAlert').innerHTML = 'Page number enterd does not exist!';
      } else {
        // Set current page of current book.
        currentBook.progress = input;

        // Clear alert if alert has been triggered pior.
        $('#pageAlert').innerHTML = '';
        // Clear field input
        $('#pageInput').value = '';
  
        // Pages before finished.
        var toGoPages = currentBook.pagecount - currentBook.progress;


        // Display pages read in reference to pages left.
        $('#pagesRead').innerHTML = currentBook.progress + ' read - ' + 
          toGoPages + ' to go!';
        // Display percent complete. Used Math.floor to get whole number.
        $('#percentComplete').innerHTML = Math.floor((currentBook.progress / 
          currentBook.pagecount) * 100) + '% completed!';

          if (currentBook.progress === currentBook.pagecount) {
            // Update alert to pick new book.
            $('#pageAlert').innerHTML = 'Book Completed! Pick new book!!!';

            // Fire the completed function to remove book from completed & list
            return completed();
          }
        }
      }
    }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Completed
  function completed() {
    // Iterate over list of books and apply a function to remove from list.
    _.each(listOfBooks, function(element, index) {
      // If the books title in listOfBooks equals the clicked completed title
      if (currentBook === element) {
        // Push book to completed list. 
        completedBooks.push(element);
        // Then Remove book from list of books.
        listOfBooks.splice(index, 1);        
        // Also remove book from DOM.
        $('#selected').remove();
      }
    });
    return addToCompletedBooks();
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Add Completed Books to DOM.
  function addToCompletedBooks() {
    // Loop through completed books array to update DOM with current completed.
    _.each(completedBooks, function(element) {
      // Create new div. 
      var newDiv = document.createElement('div');
      newDiv.className = 'completed';

      // Create new paragraph for div.
      _.makeElement('p', element.title, undefined, undefined, newDiv);

      // Add each book on top of the last.
      var currentDiv = document.getElementById('div1');
      document.getElementById('completedBooks').insertBefore(newDiv, currentDiv);
    });
  }
//------------------------------------------------------------------------------














































