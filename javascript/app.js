// Search Elements
var searchInput = document.getElementById('searchInput');
var searchButton = document.getElementById('searchButton');
var alertStatement = document.getElementById('alertStatement');

// // Search Alerts
// function Alert() {
//   alertCall();  

//   function Alert() {
//     alertCall();
//   }
//   searchInput.addEventListener('input', Alert); 

//   searchInput.value = '';
// }
// searchButton.addEventListener('click', Alert);

// function alertCall() {
//   if (searchInput.value.length > 0) {
//     alertStatement.textContent = '';
//   } else {
//     alertStatement.textContent = 'Please provide search parameters'; 
//   } 
// }

// Search to Script
function searchToScript() {
  var input = (searchInput.value.split(' '));
  var script = '';
  var result = '';
  var req = new XMLHttpRequest();

  for (var i = 0; i < input.length; i++) {
    if (i != input.length - 1) {
      script += input[i] + '+'; 
    } else {
      script += input[i];
    }
  }
  result = 'https://www.googleapis.com/books/v1/volumes?q=' + script;

  function handleResponse(response) {
    
    console.log(response.items[1].volumeInfo.title);
  }

  function get(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function() {
      callback(JSON.parse(request.responseText));
    };
    request.send(null);
  }
  return get(result, handleResponse);
}

searchButton.addEventListener('click', searchToScript);




  