const book_item = [];
const RENDER_EVENT = 'render_book';


document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })
})

document.addEventListener(RENDER_EVENT, function () {
    console.log(book_item);
    const incompleteBook = document.getElementById('incompleteBookshelfList');
    incompleteBook.innerHTML = '';
    const completeBook = document.getElementById('completeBookshelfList');
    completeBook.innerHTML = '';

    for (const bookItem of book_item) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            completeBook.append(bookElement);
        } else {
            incompleteBook.append(bookElement);
        }
    }
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
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const id = generateID();
    const bookItemObject = generateBookItem(id, title, author, year, isComplete);
    book_item.push(bookItemObject);

    document.dispatchEvent(new Event(RENDER_EVENT))

}


function makeBook(bookItemObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookItemObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + bookItemObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + bookItemObject.year;

    const completeButton = document.createElement('button');
    completeButton.classList.add('green');
    if (bookItemObject.isComplete) {
        completeButton.innerText = 'Belum selesai dibaca';
    } else {
        completeButton.innerText = 'Selesai dibaca';
    }

    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = 'Hapus Buku';

    completeButton.addEventListener('click', function () {
        addCompleteList(bookItemObject.id);
    });

    removeButton.addEventListener('click', function () {
        removeBookList(bookItemObject.id);
    })

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    actionContainer.append(completeButton, removeButton);

    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.append(bookTitle, bookAuthor, bookYear, actionContainer);
    bookContainer.setAttribute('id', `book-${bookItemObject.id}`)

    return bookContainer;
}

function addCompleteList(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget == null) return;

    if (bookTarget.isComplete) {
        bookTarget.isComplete = false;
    } else {
        bookTarget.isComplete = true;
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBookList(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget == -1) return;

    book_item.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

}

function findBook(bookID) {
    for (const index in book_item) {
        if (book_item[index].id === bookID) {
            return index;
        }
    }

    return -1;
}

function findBook(bookID) {
    for (const bookItem of book_item) {
        if (bookItem.id === bookID) {
            return bookItem;
        }
    }
    return null;
}



