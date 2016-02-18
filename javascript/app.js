var app = {};

  app.bookSearch = function() {
    var search = document.getElementById('searchButton');
    var searchField = document.getElementById('searchInput');

    search.addEventListner('click', apiGrab);

    function apiGrab() {
      if (searchField === 'Search by Title or Author' || searchField === '') {
        document.getElementById('alert').innerHTML = 'Please provide search crite' + 
        'ria for you book!';
      }
  }
}