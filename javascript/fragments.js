  // Grab alert statement element
  var alertStatement = document.getElementById('alertStatement');

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


// Remove book from book list
function removeBook() {
  this.parentNode.remove();
}

/* To Do:
Need to make if statement to make api request run only if input is not empty

Need to create queryselector mehtod so I don't have to keep using get element by
id

Need to create _.each method so I dont have to keep using for loops

Need to create method that will only take out the title of a parent element so I
can compare to response list.
*/