//------------------------------------------------------------------------------
  // Global variables
    // Button for search
    var searchButton = document.getElementById('searchButton');
    // Array of search results
    var response = [];
    // Array of books on list
    var listofBooks = [];
    // Array of completed books
    var completedBooks = [];
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Make element function
  // Make div function
  // Make query selector
  // Make _.each
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Retrieve API results
  function bookApi() {
    // Variable for search parameters
    var searchInput = document.getElementById('searchInput');
    
    // Clear any previous search results
    response = [];
    document.getElementById('searchResults').innerHTML = '';
    
    // Display search results
    function handleResponse() {
      // Parse JSON Data for use
      var convert = JSON.parse(this.responseText);

      // Call function to handle creation of a results object
      for (var i = 0; i < convert.items.length; i++) {
        var item = convert.items[i];

        // Create object out of api results and push to global variable for use
        response.push({ 
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors[0],
          description: item.volumeInfo.description,
          pagecount: item.volumeInfo.pageCount, 
          thumbnail: item.volumeInfo.imageLinks.thumbnail
        });
      }
      return searchResults();
    }


    // Initializes api request 
    function get(url) {
      // Saving request in variable
      var request = new XMLHttpRequest();
      // Forces handleResponse to fire after load is complete
      request.addEventListener('load', handleResponse);
      // Opening request using url from result from searchToScript
      request.open('GET', url);
      // Sends request
      request.send();
    }


    // Creates script for search
    function searchToScript() {
      // Converts string to entered into an array
      var input = searchInput.value.split(' ');
      // Script variable holds string with +'s added
      var script = '';
      // Holds the resulting url
      var result = '';

      // Loops through array and adds + were applicable
      for (var i = 0; i < input.length; i++) {
        if (i != input.length - 1) {
          script += input[i] + '+'; 
        } else {
          script += input[i];
        }
      }
      result = 'https://www.googleapis.com/books/v1/volumes?q='+ script;
      // fires get function
      return get(result);
    }
    // fires searchToScript function
    return searchToScript();
  }
  // Add event listener to search button
  // Changed for now so i don't need to keep populating. Remember to change back!
  searchButton.addEventListener('click', bookApi);
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Populate search results
  function searchResults() {
    for (var i = 0; i < response.length; i++) {
      // Create new div 
      var newDiv = document.createElement('div');
      newDiv.className = 'searchResult';
      // Create new paragraph for div
      var newParagraph = document.createElement('p');
      newParagraph.innerHTML = response[i].title;
      newDiv.appendChild(newParagraph);

      // Create add button
      var newButton = document.createElement('button');
      newButton.className = 'addBookButton';
      newButton.innerHTML = 'Add to book list';
      newDiv.appendChild(newButton);

      // Add each result on top of the last
      var currentDiv = document.getElementById('div1');
      document.getElementById('searchResults').insertBefore(newDiv, currentDiv);
      console.log(newButton);
      newButton.onclick = addToListofBooks;
    }
  }
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Add book to listofbooks array.
  function addToListofBooks() {
    for (var i = 0; i < response.length; i++) {
      if (this.parentNode.firstChild.innerHTML === response[i].title) {
        listofBooks.push(response[i]);

        // Create new div 
        var newDiv = document.createElement('div');
        newDiv.className = 'book';
        // Create new paragraph for div
        var newParagraph = document.createElement('p');
        newParagraph.innerHTML = response[i].title;
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
        starButton.onclick = setAsCurrent;
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
  - Refactor code to get rid of redundancies.
------------------------------------------------------------------------------*/
