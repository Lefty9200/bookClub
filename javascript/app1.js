// Global variables
var response = {};
var searchButton = document.getElementById('searchButton');
var addBookButton = document.getElementById('addBookButton');


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
    response = JSON.parse(this.responseText);

    // Call function to handle creation of elements
    for (var i = 0; i < response.items.length; i++) {
      var item = response.items[i];

      // Create new div
      var newDiv = document.createElement('div');
      newDiv.className = 'searchResult';
      newDiv.id = i;
      newDiv.innerHTML = item.volumeInfo.title;

      // Create new button for div
      var newButton = document.createElement('button');
      newButton.className = 'addBookButton';
      newButton.innerHTML = 'Add to book list';
      newDiv.appendChild(newButton);

      // Add each result on top of the last
      var currentDiv = document.getElementById('div1');
      document.getElementById('searchResults').insertBefore(newDiv, currentDiv);
      newButton.onclick = addToBookList;
    }
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


function addToBookList() {
  var newDiv = document.createElement('div');
  newDiv.className = 'addedBook';
  newDiv.innerHTML = 'test';

  // Create new button for div
  var newButton = document.createElement('button');
  newButton.className = 'completeBookButton';
  newButton.innerHTML = 'Completed';
  newDiv.appendChild(newButton);

  // Add each result on top of the last
  var currentDiv = document.getElementById('div1');
  document.getElementById('books').insertBefore(newDiv, currentDiv);
  newButton.onclick = addtoCompleted;
}


// Add to completed
function addtoCompleted() {

}






