
// Search Alerts
var searchInput = document.getElementById('searchInput');
var searchButton = document.getElementById('searchButton');
var alertStatement = document.getElementById('alertStatement');

function Alert() {
  alertCall();  

  function Alert() {
    alertCall();
  }
  searchInput.addEventListener('input', Alert); 

  searchInput.value = '';
}
searchButton.addEventListener('click', Alert);

function alertCall() {
  if (searchInput.value.length > 0) {
    alertStatement.textContent = '';
  } else {
    alertStatement.textContent = 'Please provide search parameters'; 
  } 
}