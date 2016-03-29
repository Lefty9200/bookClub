//--Custom Library--------------------------------------------------------------
  var _ = {};
 
  var $ = function(selector, el) {
    if (!el) {
      el = document; 
    }
    return el.querySelector(selector);
  };

  _.each = function(collection, callback) {
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        callback(collection[i], i);
      }
    } else {
      for (var key in collection) {
        callback(collection[key], key);
      }
    }
  };

  _.first = function(collection, n) {
    return _.reduce(collection, function(memo, current) {
      if (n === undefined) {
        return collection[0];
      } else {
        if (memo.length < n) {
          memo.push(current);
        }
        return memo;
      }
    },[]);
  };

  _.last = function(collection, n) {
    return _.reduce(collection, function(memo, current) {
      if (n === undefined) {
        return current;
      } else {
        if (collection.indexOf(current) >= n - 1) {
          memo.push(current);
        }
        return memo;
      }
    }, []);
  };

  _.contains = function(collection, value) {
    var result = false;
    _.each(collection, function(current) {
      if (current === value) {
        result = true;
      };
    });
    return result;
  };

  _.reduce = function(collection, callback, memo) {
        var flag;
        if(arguments.length === 2) {
            flag = true;
        }
        _.each(collection, function(current) {
        if(flag === true) {
          memo = current;
          flag = false;
        } else {
          memo = callback(memo, current);
        }
      });
      return memo;
  }; 

  _.map = function(collection, callback) {
    return _.reduce(collection, function(memo, current) {
      memo.push(callback(current));
      return memo;
    }, []);
  };

  _.filter = function(collection, predicate) {
    return _.reduce(collection, function(memo, current) {
      if (predicate(current)) {
        memo.push(current);
      }
      return memo;
    },[]);
  };

  _.reject = function(collection, predicate) {
    return _.reduce(collection, function(memo, current) {
      if (!predicate(current)) {
        memo.push(current);
      }
      return memo;
    }, []);
  };

  _.pluck = function(collection, propertyName) {
    return _.reduce(collection, function(memo, current) {
      if (current[propertyName]) {
        memo.push(current[propertyName]);
      }
      return memo;
    }, []);
  };

  _.makeElement = function(type, text, elementClass, id, parentElement) {
    var newElement = document.createElement(type);

    text != undefined ? newElement.innerHTML = text : undefined;
    elementClass != undefined ? newElement.className = elementClass : undefined;
    id != undefined ? newElement.id = id : undefined;

    return parentElement.appendChild(newElement);
  };

  _.isItEmpty = function(object) {
    _.each(object, function(current) {
      if (object.hasOwnProperty(key)) {
        return false;
      }
    });
    return true;
  };  
//------------------------------------------------------------------------------


//--Global Variables------------------------------------------------------------
  var searchResponse = [];
  var listOfBooks = JSON.parse(localStorage.getItem('listOfBooks')) || [];
  var completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
  var currentBook = JSON.parse(localStorage.getItem('currentBook')) || {};
//------------------------------------------------------------------------------

//--Local Storage---------------------------------------------------------------
  window.onbeforeunload = function() {
     // Save lists to local storage.
     localStorage.setItem('listOfBooks', JSON.stringify(listOfBooks));
     localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
     localStorage.setItem('currentBook', JSON.stringify(currentBook));
     return null;
  };
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
  // Check if current book already exists.
  var checkIfCurrent = function(arg, callback) {
    if (_.isItEmpty(arg)) {
      $('#pageInput').style.display = 'none';
    } else {
      return callback(arg);
    }
  };
  checkIfCurrent(currentBook, setCurrent);
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Sets current book if current book already exists or set current book
  // from book selected from booklist. 
  function setCurrent(arg) {
    // Set DOM elements.
    $('#bookCover').src = currentBook.thumbnail;
    $('#title').innerHTML = currentBook.title;
    $('#author').innerHTML = 'Author: ' + currentBook.author;
    $('#pagesRead').innerHTML = currentBook.progress +' pages read - ' + 
      (currentBook.pagecount - currentBook.progress) + ' pages to go!';
    $('#percentComplete').innerHTML = Math.floor((currentBook.progress / 
      currentBook.pagecount) * 100) + '% completed!';
    // Display input bar.
    $('#pageInput').style.display = 'block';

    // Update progress of current book to input.
    $('#pageInput').firstChild.nextSibling.onclick = function() {
      var input = parseInt($('#pageInput').firstChild.value);
      $('#pageInput').firstChild.value = '';
      if (isNaN(input)) {
        $('#pageAlert').innerHTML = 'Please enter a number!';
      } else if (input > currentBook.pagecount || input <= 0) {
        $('#pageAlert').innerHTML = 'Page number entered does not exist!';
      } else {
        currentBook.progress = input;
        return pagesRead(currentBook, $('#selected'));
      }
    };

    // Update progress of current book to 100%.
    $('#pageInput').lastChild.onclick = function() {
      currentBook.progress = currentBook.pagecount;
      return pagesRead(currentBook, $('#selected'));
    };
  };
//------------------------------------------------------------------------------


//--Search Results--------------------------------------------------------------
$('#searchButton').addEventListener('click', function() {
  var searchInput = $('#searchInput').value.split(' ').join('+');
  var url = 'https://www.googleapis.com/books/v1/volumes?q=' + searchInput;

  searchResponse = [];
  $('#searchResults').innerHTML = '';

  if (searchInput.length === 0) {
    $('#searchAlert').innerHTML = 'Please enter a search parameter!';
  } else {
    $('#searchAlert').innerHTML = '';
  };

  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('load', function() {
    var convert = JSON.parse(this.responseText);

    _.each(convert.items, function(element, index) {
      var book = element.volumeInfo;

      if (book.authors !== undefined && book.description !== undefined && 
        book.pageCount !== undefined && book.imageLinks !== undefined) { 

        // Push books to search result.
        searchResponse.push({ 
          title: book.title,
          author: book.authors[0],
          description: book.description,
          pagecount: book.pageCount, 
          thumbnail: book.imageLinks.thumbnail
        });

        $('#searchInput').value = '';

        // Make DOM elements.
        var newDiv = document.createElement('div');
        newDiv.className = 'searchResult';
        newDiv.id = index;

        _.makeElement('h3', book.title, undefined, undefined, newDiv);
        _.makeElement('p', 'By: ' + book.authors[0], undefined, undefined, newDiv);
        
        _.makeElement('p', 'Description: <br>'+ book.description, undefined
          , undefined, newDiv);

        _.makeElement('button', 'Add to book list', 'addBookButton', undefined, 
          newDiv);

        var currentDiv = document.getElementById('div1');
        document.getElementById('searchResults').insertBefore(newDiv, currentDiv);

        newDiv.lastChild.onclick = addTolistOfBooks;
      }
    });
  });
});
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Add book to list of books.
  var addTolistOfBooks = function() {
    var passedThis = this.parentNode;
    var flag = true;

    // Don't alow duplicates to be added.
    for (var i = 0; i < listOfBooks.length; i++) {
      if (listOfBooks[i].title === passedThis.firstChild.innerHTML) {
        flag = false;
      }
    }

    // If not a duplicate add book.
    if (flag) {
      _.each(searchResponse, function(element, index) {
        if (parseInt(passedThis.id) === index) {
          listOfBooks.push(element);

          // Set progress of newly added book to zero.
          listOfBooks[listOfBooks.length - 1].progress = 0;

          // Update booklist DOM.
          var newDiv = document.createElement('div');
          newDiv.className = 'book';

          _.makeElement('h3', element.title, undefined, undefined, newDiv);

          _.makeElement('p', 'By: ' + element.author, undefined, undefined, 
            newDiv);

          _.makeElement('button', 'Set as current', 'setCurrent', undefined, 
            newDiv);

          _.makeElement('button', 'Mark as complete', 'markComplete', undefined, 
            newDiv);

          _.makeElement('button', 'Remove', 'removeBook', undefined, newDiv);

          var currentDiv = document.getElementById('div1');
          document.getElementById('bookList').insertBefore(newDiv, currentDiv);

          // Set current book.
          newDiv.lastChild.previousSibling.previousSibling.onclick = function() {
            var passedThis = this.parentNode;
            if ($('#selected')) {
              $('#selected').removeAttribute('id');
            }

            passedThis.id = 'selected';

            $('#pageAlert').innerHTML = '';

            _.each(listOfBooks, function(element, index) {
              if (passedThis.firstChild.innerHTML === element.title) {
                currentBook = element;

                return setCurrent(currentBook);
              }
            });
          };

          // Mark as complete.
          newDiv.lastChild.previousSibling.onclick = function() {
            var passedThis = this.parentNode;
            var targetBook;

            _.each(listOfBooks, function(element, index) {
              if (passedThis.firstChild.innerHTML === element.title) {
                targetBook = element;
                targetBook.progress = targetBook.pagecount;
              }
            });
            return pagesRead(targetBook, passedThis);
          };

          // Remove book from list. If current also remove from current.
          newDiv.lastChild.onclick = function() {
            var passedThis = this.parentNode;
            if (passedThis.firstChild.innerHTML === currentBook.title) {
              currentBook = {};
              $('#bookCover').src = '';
              $('#title').innerHTML = '';
              $('#author').innerHTML = '';
              $('#pagesRead').innerHTML = '';
              $('#percentComplete').innerHTML = '';
              $('#pageAlert').innerHTML = '';


              $('#pageInput').style.display = 'none'; 
            }

            _.each(listOfBooks, function(element, index) {
              if (passedThis.firstChild.innerHTML === element.title) {
                listOfBooks.splice(index, 1);        
                passedThis.remove();
              }
            });
          };
        }
      });
    }
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Update pages read. If book complete push to completed list. 
  var pagesRead = function(listObj, elDOM) {
    var toGoPages = listObj.pagecount - listObj.progress;

    // If book is current book update DOM elements.
    if (listObj === currentBook) {
      $('#pagesRead').innerHTML = listObj.progress + ' read - ' + 
        toGoPages + ' to go!';

      $('#percentComplete').innerHTML = Math.floor((listObj.progress / 
        currentBook.pagecount) * 100) + '% completed!';

      if (toGoPages === 0) {
        $('#pageAlert').innerHTML = 'Book Completed! Pick new book!!!';
      }
    }

    // If all pages read remove from list, add to completed list
    if (toGoPages === 0) {
      _.each(listOfBooks, function(element, index) {
        if (listObj === element) {
          completedBooks.push(element);
          listOfBooks.splice(index, 1);
          elDOM.remove();        
        }
      });

      // Clear completed books list and update with added completed book.
      $('#completedBooks').innerHTML = '';

      _.each(completedBooks, function(element) {

        var newDiv = document.createElement('div');
        newDiv.className = 'completed';

        _.makeElement('h3', element.title, undefined, undefined, newDiv);
        _.makeElement('p', 'By: ' + element.author, undefined, undefined, newDiv);

        var currentDiv = document.getElementById('div1');
        document.getElementById('completedBooks').insertBefore(newDiv, currentDiv);
      });  
    };
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Clear search results onclick.
  $('#clear').onclick = function() {
    searchResponse = [];
    $('#searchResults').innerHTML = '';
  };
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
  // Toggle content.
  var toggleButtons = function(listButton, el) {
    listButton.onclick = function() {
      if (el.style.display === 'none') {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }
  };

  toggleButtons($('#toggleBookList'), $('#bookList'));
  toggleButtons($('#toggleCompletedList'), $('#completedBooks'));
//------------------------------------------------------------------------------

/*
 - additional feature.
 - additional feature.
 - Use Local Storage to hold onto the user's chosen booklist.
 - Use Higher Order functions on my data.
 - Create my own higher order functions. 
*/