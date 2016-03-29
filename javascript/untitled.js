var listOfBooks = [1, 2, 3, 4, 5];
var completedBooks = [5, 4, 3, 2, 1];
var currentBook = {name: 'apple'};


JSON.parse(localStorage.getItem('listOfBooks'));
JSON.parse(localStorage.getItem('completedBooks'));
JSON.parse(localStorage.getItem('currentBook'));
// It doesnt exist comes back null.


window.onbeforeunload = function(){
   // Save lists to local storage.
   localStorage.setItem('listOfBooks', JSON.stringify(listOfBooks));
   localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
   localStorage.setItem('currentBook', JSON.stringify(currentBook));
   return null;
};