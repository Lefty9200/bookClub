var searchButton = document.getElementById('searchButton');

// Handles book Search
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
  function handleResponse(response) {
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

      // Set id, and add new content and button to div
      newDiv.appendChild(newDivContent);
      newDiv.appendChild(newButton);
      newDiv.setAttribute('class', 'searchResult');
      newDiv.setAttribute('id', '' + i);

      var currentDiv = document.getElementById('div1');
      document.getElementById('searchResults').insertBefore(newDiv, currentDiv);
    }
  }

  // Initializes api request 
  function get(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function() {
      callback(JSON.parse(request.responseText));
    };
    request.send();
  }
  get(result, handleResponse);
}
searchButton.addEventListener('click', bookApi);


// Add to Book List  