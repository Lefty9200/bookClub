// Global variables
  // Button for search
  var searchButton = document.getElementById('searchButton');
  // Array of search results
  var response = [];
  // Array of books on list
  var listofBooks = [];


// Retrieve API results
function bookApi() {
  // Needed variables
  var searchInput = document.getElementById('searchInput');
  var alertStatement = document.getElementById('alertStatement');
  var input = searchInput.value.split(' ');
  var result = '';

  // Clear any previous search results
  document.getElementById('searchResults').innerHTML = '';
  
  // First alert fires after search button event handler fires
  function searchAlert() {
    alertCall();
    // Second alert fires after first alert and is tied to the input event handler  
    function searchAlert() {
      alertCall();
    }
    // Clearing search input after alerts are ran
    searchInput.addEventListener('input', searchAlert); 
    searchInput.value = '';
  }

  // Alert funciton used for both first and second alerts.
  function alertCall() {
    if (searchInput.value.length > 0) {
      // Does not display or removes text alert
      alertStatement.textContent = '';
    } else {
      // Provides text alert to user
      alertStatement.textContent = 'Please provide search parameters'; 
    } 
  } 
  // Call alert function
  searchAlert();

  // Creates script for search
  function searchToScript() {
    var script = '';

    for (var i = 0; i < input.length; i++) {
      if (i != input.length - 1) {
        script += input[i] + '+'; 
      } else {
        script += input[i];
      }
    }
    result = 'https://www.googleapis.com/books/v1/volumes?q=' + script;
  } 
  searchToScript();

  // Displays search results
  function handleResponse() {
    // Parse JSON Data for use
    var convert = JSON.parse(this.responseText);

    // Call function to handle creation of a results object
    for (var i = 0; i < convert.items.length; i++) {
      var item = convert.items[i];

      response.push({ 
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors[0],
        description: item.volumeInfo.description,
        pagecount: item.volumeInfo.pagecount, 
        thumbnail: item.volumeInfo.imageLinks.thumbnail
      });
    }
    searchResults();
  }

  // Initializes api request 
  function get(url, callback) {
    var request = new XMLHttpRequest();
    // Forces handleResponse to fire after load is complete
    request.addEventListener('load', handleResponse)
    request.open('GET', url);
    request.send();
  }
  // Call get function
  get(result, handleResponse);
}
// Add event listener to search button
searchButton.addEventListener('click', bookApi);


// Populate search results
function searchResults() {
  for (var i = 0; i < response.length; i++) {
  var newDiv = document.createElement('div');
  newDiv.className = 'searchResult';
  newDiv.innerHTML = response[i].title;

  // Create new button for div
  var newButton = document.createElement('button');
  newButton.className = 'addBookButton';
  newButton.innerHTML = 'Add to book list';
  newDiv.appendChild(newButton);

  // Add each result on top of the last
  var currentDiv = document.getElementById('div1');
  document.getElementById('searchResults').insertBefore(newDiv, currentDiv);
  // newButton.onclick = addToBookList;
  }
}


Add to book list
function addToBookList() {
  console.log(this.parentNode.innerHTML);
  for (var i = 0; i < response.length; i++) {
  //   if (response[i].title === this.parentNode.innerHTML)
  // }
}

// Add to book list
function addToBookList() {
  // Cloned search result clicked for addition to book list
  var newBook = this.parentNode.cloneNode(true);

  // Changed attributes for booklist items
  newBook.setAttribute('class', 'book');
  newBook.lastChild.setAttribute('class', 'removeBookButton');
  newBook.lastChild.innerHTML = 'Remove';
  newBook.lastChild.onclick = removeBook;

  // Appended to book list. Wanted newest added to display last 
  document.getElementById('bookList').appendChild(newBook);
}

// Remove book from book list
function removeBook() {
  this.parentNode.remove();
}

// Select current book




/* To Do:
Need to make if statement to make api request run only if input is not empty

Need to create queryselector mehtod so I don't have to keep using get element by
id

Need to create _.each method so I dont have to keep using for loops

Need to create method that will only take out the title of a parent element so I
can compare to response list.
*/



