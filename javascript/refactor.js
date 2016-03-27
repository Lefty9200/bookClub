//--Custom Library--------------------------------------------------------------
  // var _ = {};
 
  // var $ = function(selector, el) {
  //   if (!el) {
  //     el = document; 
  //   }
  //   return el.querySelector(selector);
  // };

  // _.each = function(collection, callback) {
  //   if (Array.isArray(collection)) {
  //     for (var i = 0; i < collection.length; i++) {
  //       callback(collection[i], i);
  //     }
  //   } else {
  //     for (var key in collection) {
  //       callback(collection[key], i);
  //     }
  //   }
  // };

  // _.first = function(collection, n) {
  //   return _.reduce(collection, function(memo, current) {
  //     if (n === undefined) {
  //       return collection[0];
  //     } else {
  //       if (memo.length < n) {
  //         memo.push(current);
  //       }
  //       return memo;
  //     }
  //   },[]);
  // };

  // _.last = function(collection, n) {
  //   return _.reduce(collection, function(memo, current) {
  //     if (n === undefined) {
  //       return current;
  //     } else {
  //       if (collection.indexOf(current) >= n - 1) {
  //         memo.push(current);
  //       }
  //       return memo;
  //     }
  //   }, []);
  // };

  // _.contains = function(collection, value) {
  //   var result = false;
  //   _.each(collection, function(current) {
  //     if (current === value) {
  //       result = true;
  //     };
  //   });
  //   return result;
  // };

  // _.reduce = function(collection, callback, memo) {
  //       var flag;
  //       if(arguments.length === 2) {
  //           flag = true;
  //       }
  //       _.each(collection, function(current) {
  //       if(flag === true) {
  //         memo = current;
  //         flag = false;
  //       } else {
  //         memo = callback(memo, current);
  //       }
  //     });
  //     return memo;
  // }; 

  // _.map = function(collection, callback) {
  //   return _.reduce(collection, function(memo, current) {
  //     memo.push(callback(current));
  //     return memo;
  //   }, []);
  // };

  // _.filter = function(collection, predicate) {
  //   return _.reduce(collection, function(memo, current) {
  //     if (predicate(current)) {
  //       memo.push(current);
  //     }
  //     return memo;
  //   },[]);
  // };

  // _.reject = function(collection, predicate) {
  //   return _.reduce(collection, function(memo, current) {
  //     if (!predicate(current)) {
  //       memo.push(current);
  //     }
  //     return memo;
  //   }, []);
  // };

  // _.pluck = function(collection, propertyName) {
  //   return _.reduce(collection, function(memo, current) {
  //     if (current[propertyName]) {
  //       memo.push(current[propertyName]);
  //     }
  //     return memo;
  //   }, []);
  // };

  // _.makeElement = function(type, text, elementClass, id, parentElement) {
  //   var newElement = document.createElement(type);

  //   text != undefined ? newElement.innerHTML = text : undefined;
  //   elementClass != undefined ? newElement.className = elementClass : undefined;
  //   id != undefined ? newElement.id = id : undefined;

  //   return parentElement.appendChild(newElement);
  // };

  // _.isItEmpty = function(object) {
  //   _.each(object, function(current) {
  //     if (object.hasOwnProperty(key)) {
  //       return false;
  //     }
  //   });
  //   return true;
  // };   
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
    //var searchButton = $('#searchButton');
    // var searchInput = $('#searchInput');
    // var searchClear = $('#clear');
    // var toggleBookList = $('#toggleBookList');
    // var toggleCompletedList = $('#toggleCompletedList');

    // var searchResponse = [];
    // var listOfBooks = [];
    // var completedBooks = [];
    // var currentBook = {};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // var setCurrent = function(arg) {
  //   $('#bookCover').src = currentBook.thumbnail;
  //   $('#title').innerHTML = currentBook.title;
  //   $('#author').innerHTML = 'Author: ' + currentBook.author;
  //   $('#pagesRead').innerHTML = currentBook.progress +' pages read - ' + 
  //     (currentBook.pagecount - currentBook.progress) + ' pages to go!';
  //   $('#percentComplete').innerHTML = Math.floor((currentBook.progress / 
  //     currentBook.pagecount) * 100) + '% completed!';

  //   $('#pageInput').style.display = 'block';

  //   $('#pageInput').firstChild.nextSibling.onclick = pagesRead;
  //   $('#pageInput').lastChild.onclick = function() {
  //     currentBook.progress = currentBook.pagecount;

  //     return pagesRead();
  //   };
  // };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // var checkIfCurrent = function(arg, callback) {
  //   if (_.isItEmpty(arg)) {
  //     $('#pageInput').style.display = 'none';
  //   } else {
  //     return callback(arg);
  //   }
  // };
  // checkIfCurrent(currentBook, setCurrent);
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // var addTolistOfBooks = function() {
  //   var passedThis = this.parentNode;
  //   console.log(passedThis);
  //   var flag = true;

  //   for (var i = 0; i < listOfBooks.length; i++) {
  //     if (listOfBooks[i].title === passedThis.firstChild.innerHTML) {
  //       flag = false;
  //     }
  //   }

  //   if (flag) {
  //     _.each(searchResponse, function(element, index) {
  //       if (parseInt(passedThis.id) === index) {
  //         listOfBooks.push(element);

  //         listOfBooks[listOfBooks.length -1].progress = 0;

  //         var createDiv = function() {
  //           var newDiv = document.createElement('div');
  //           newDiv.className = 'book';

  //           _.makeElement('h3', element.title, undefined, undefined, newDiv);

  //           _.makeElement('p', 'By: ' + element.author, undefined, undefined, 
  //             newDiv);

  //           _.makeElement('button', 'Set as current', 'setCurrent', undefined, 
  //             newDiv);

  //           _.makeElement('button', 'Remove', 'removeBook', undefined, newDiv);

  //           var currentDiv = document.getElementById('div1');
  //           document.getElementById('bookList').insertBefore(newDiv, currentDiv);

  //           newDiv.lastChild.previousSibling.onclick = createCurrent;
  //           newDiv.lastChild.onclick = removeBook;
  //         }
  //         return createDiv();
  //       }
  //     });
  //   }
  // };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // var searchResult = function() {
  //   _.each(searchResponse, function(element, index) {

  //     var newDiv = document.createElement('div');
  //     newDiv.className = 'searchResult';
  //     newDiv.id = index;

  //     _.makeElement('h3', element.title, undefined, undefined, newDiv);
  //     _.makeElement('p', 'By: ' + element.author, undefined, undefined, newDiv);
      
  //     _.makeElement('p', 'Description: <br>'+ element.description, undefined
  //       , undefined, newDiv);

  //     _.makeElement('button', 'Add to book list', 'addBookButton', undefined, 
  //       newDiv);

  //     var currentDiv = document.getElementById('div1');
  //     document.getElementById('searchResults').insertBefore(newDiv, currentDiv);

  //     newDiv.lastChild.onclick = addTolistOfBooks;
  //   });
  // };
//------------------------------------------------------------------------------  


//------------------------------------------------------------------------------
  // searchButton.addEventListener('click', function() {
  //   if (searchInput.value.length === 0) {
  //     $('#searchAlert').innerHTML = 'Please enter a search parameter!';
  //   } else {
  //     $('#searchAlert').innerHTML = '';
  //   }
    
  //   searchResponse = [];
  //   $('#searchResults').innerHTML = '';

  //   function handleResponse() {
  //     var convert = JSON.parse(this.responseText);

  //     _.each(convert.items, function(element, index) {

  //       var book = element.volumeInfo;

  //       if (book.authors !== undefined && book.description !== undefined && 
  //         book.pageCount !== undefined && book.imageLinks !== undefined) { 

  //         searchResponse.push({ 
  //           title: book.title,
  //           author: book.authors[0],
  //           description: book.description,
  //           pagecount: book.pageCount, 
  //           thumbnail: book.imageLinks.thumbnail
  //         });
  //       }

  //       $('#searchInput').value = '';
  //     });
  //     return searchResult();
  //   }


  //   function get(url) {
  //     var request = new XMLHttpRequest();
  //     request.addEventListener('load', handleResponse);
  //     request.open('GET', url);
      
  //     request.send();
  //   }


  //   function scriptForSearch() {
  //     var input = searchInput.value.split(' ');
  //     var scriptString = '';
  //     var result = '';

  //     _.each(input, function(element, index) {
  //       if (index != input.length - 1) {
  //         scriptString += element + '+'; 
  //       } else {
  //         scriptString += element;
  //       }
  //     });
  //     result = 'https://www.googleapis.com/books/v1/volumes?q='+ scriptString;
  //     return get(result);
  //   }
  //   return scriptForSearch();
  // });
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // var removeBook = function() {
  //   var passedThis = this.parentNode;

  //   if (passedThis.firstChild.innerHTML === currentBook.title) {
  //     currentBook = {};
  //     $('#bookCover').src = '';
  //     $('#title').innerHTML = '';
  //     $('#author').innerHTML = '';
  //     $('#pagesRead').innerHTML = '';
  //     $('#percentComplete').innerHTML = '';

  //     $('#pageInput').style.display = 'none'; 
  //   }

  //   _.each(listOfBooks, function(element, index) {
  //     if (passedThis.firstChild.innerHTML === element.title) {
  //       listOfBooks.splice(index, 1);        
  //       passedThis.remove();
  //     }
  //   });
  // };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // var createCurrent = function() {
  //   var passedThis = this.parentNode;

  //   if ($('#selected')) {
  //     $('#selected').removeAttribute('id');
  //   }

  //   passedThis.id = 'selected';

  //   $('#pageAlert').innerHTML = '';

  //   _.each(listOfBooks, function(element, index) {
  //     if (passedThis.firstChild.innerHTML === element.title) {
  //       currentBook = element;

  //       return setCurrent(currentBook);
  //     }
  //   });
  // };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // var pagesRead = function() {

  //   var updatePages = function() {
  //     $('#pageAlert').innerHTML = '';
  //     $('#pageInput').value = '';

  //     var toGoPages = currentBook.pagecount - currentBook.progress;

  //     $('#pagesRead').innerHTML = currentBook.progress + ' read - ' + 
  //       toGoPages + ' to go!';

  //     $('#percentComplete').innerHTML = Math.floor((currentBook.progress / 
  //       currentBook.pagecount) * 100) + '% completed!';

  //     if (currentBook.progress === currentBook.pagecount) {
  //       $('#pageAlert').innerHTML = 'Book Completed! Pick new book!!!';

  //       _.each(listOfBooks, function(element, index) {
  //         if (currentBook === element) {
  //           completedBooks.push(element);
  //           listOfBooks.splice(index, 1);        
  //           $('#selected').remove();
  //         }
  //       });
  //       return addToCompletedBooks();
  //     }     
  //   };

  //   if (currentBook.progress === currentBook.pagecount) {
  //     return updatePages();
  //   } else {
  //     var input = parseInt($('#pageInput').firstChild.value);
  //     $('#pageInput').firstChild.value = '';

  //     if (isNaN(input)) {
  //       $('#pageAlert').innerHTML = 'Please enter a number!';
  //     } else {
  //       if (input > currentBook.pagecount || input <= 0) {
  //         $('#pageAlert').innerHTML = 'Page number entered does not exist!';
  //       } else {
  //         currentBook.progress = input;

  //         return updatePages();
  //       }
  //     }
  //   }
  // };
//------------------------------------------------------------------------------


// //------------------------------------------------------------------------------
//   var addToCompletedBooks = function() {
//     $('#completedBooks').innerHTML = '';
//     _.each(completedBooks, function(element) {

//       var newDiv = document.createElement('div');
//       newDiv.className = 'completed';

//       _.makeElement('h3', element.title, undefined, undefined, newDiv);
//       _.makeElement('p', 'By: ' + element.author, undefined, undefined, newDiv);

//       var currentDiv = document.getElementById('div1');
//       document.getElementById('completedBooks').insertBefore(newDiv, currentDiv);
//     });
//   };
// //------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // searchClear.onclick = function() {
  //   searchResponse = [];
  //   $('#searchResults').innerHTML = '';
  // };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // var toggleButtons = function(listButton, el) {
  //   listButton.onclick = function() {
  //     if (el.style.display === 'none') {
  //       el.style.display = 'block';
  //     } else {
  //       el.style.display = 'none';
  //     }
  //   }
  // };

  // toggleButtons(toggleBookList, $('#bookList'));
  // toggleButtons(toggleCompletedList, $('#completedBooks'));
//------------------------------------------------------------------------------