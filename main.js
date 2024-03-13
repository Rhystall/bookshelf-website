const books = [];
const RENDER_EVENT = 'render_book';


document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })
})

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
})

function generateID() {
    return +new Date();
}

function generateBookItem(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').value;

    const id = generateID();
    const bookItem = generateBookItem(id, title, author, year, isComplete);
    books.push(bookItem);

    document.dispatchEvent(new Event(RENDER_EVENT))

}


function makeBook(bookItem) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookItem.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookItem.writer;

    const bookYear = document.createElement('p');
    bookYear.innerText = bookItem.year;


    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.append(bookTitle, bookWriter, bookYear);

}

