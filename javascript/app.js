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
  
  // Alerts
  function searchAlert() {
    alertCall();  
    function searchAlert() {
      alertCall();
    }
    searchInput.addEventListener('input', searchAlert); 
    searchInput.value = '';
  }

  function alertCall() {
    if (searchInput.value.length > 0) {
      alertStatement.textContent = '';
    } else {
      alertStatement.textContent = 'Please provide search parameters'; 
    } 
  } 
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
    response = JSON.parse(this.responseText);

    for (var i = 0; i < response.items.length; i++) {
      var item = response.items[i];
      
      // Create new div
      var newDiv = document.createElement('div');

      //Create content for new div
      var newDivContent = document.createTextNode(item.volumeInfo.title);
      
      // Create new button for div
      var newButton = document.createElement('button');
      var newButtonContent = document.createTextNode('Add to book list');
      newButton.appendChild(newButtonContent);
      newButton.setAttribute('id', 'addBookButton');

      // Set id, and add new content and button to div
      newDiv.appendChild(newDivContent);
      newDiv.appendChild(newButton);
      newDiv.setAttribute('class', 'searchResult');
      newDiv.setAttribute('id', '' + i);

      // Add each result on top of the last
      var currentDiv = document.getElementById('div1');
      document.getElementById('searchResults').insertBefore(newDiv, currentDiv);
    }
  }

  // Initializes api request 
  function get(url, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', handleResponse)
    request.open('GET', url);
    request.send();
  }
  get(result, handleResponse);
}
searchButton.addEventListener('click', bookApi);


// Add to book list
function addToBookList() {

}
addBookButton.addEventListener('click', addToBookList);
// Need to figure out how to update window to have new values created by search.











