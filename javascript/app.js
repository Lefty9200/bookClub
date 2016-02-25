// Global variables
var response = [];
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


// Add to book list


// Move to completed








