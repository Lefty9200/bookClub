var searchInput = document.getElementById('searchInput');
var searchButton = document.getElementById('searchButton');
var searchAlert = document.getElementById('searchAlert');

function clickAlert() {
  if (searchInput.value.length > 0) {
      searchAlert.textContent = '';
    } else {
      searchAlert.textContent = 'Please provide search parameters'; 
    }   

  function inputAlert() {
    if (searchInput.value.length > 0) {
      searchAlert.textContent = '';
    } else {
      searchAlert.textContent = 'Please provide search parameters'; 
    }  
  }
  searchInput.addEventListener('input', inputAlert); 

  searchInput.value = '';
}
searchButton.addEventListener('click', clickAlert);