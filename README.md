# bookClub
Web App using vanilla Javascript only. Makes XMLHttpRequests to Google Books API.

## Description:
I used the google books api to create a web app that allows a user to track their reading progress on multiple books at once. The app tracks percentage complete, pages left and automatically moves a book from a users booklist to a completed list when finished. Arrays that hold search results, book list, completed books and the DOM are continuously updated throughout this process.

In my code I have created a jquery and an underscore style libraries to make the development process easier and cleaner. I have left some separator comments in my code that helped me follow the flow of the projects global elements.

## Since my first iteration of this project I have done the following: 

- Created a jquery style library that allows me to select or create individual elements and arrays of elements and use custom on them. This was particularly useful when creating and appending DOM elements for each list. This libarary made everything much cleaner.

- Made it so local storage was updated with the current status of all lists before close or refresh of page. This was a great feature to learn how to use in that with an app like this the whole point is to save and track your book progress!

- Added a remove book feature to current and completed book lists to make the app more rounded. Now you can remove books from any list. As you read more books you can delete what you want.

- Added a date feature to completed books. When you complete a book the date will be displayed under the book you have just completed. This is useful for reference to books read in the pase.

- To eliminate confusion on which book is current in the list of books. Created 'selected' id that would highlight which book in the list is current. This updates when current book is changed. 

- Made it so you can mark a book as current staight from the book list instead of only in current book.

- Refactored all code to make use of newly created jquery style library.

- Made a custom clear method to remove redundancy in clearing items.


Please let me know what you think!

Github pages link:   http://nickdaniele.github.io/bookClub/


