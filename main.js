const book_item = [];
const RENDER_EVENT = 'render_book';


document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })
    if (isStorageExist()) {
        loadStorage();
    }
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
    updateLocal();
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
    updateLocal();
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

    bookTarget.isComplete = bookTarget.isComplete ? false : true
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateLocal();
}

function removeBookList(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget == -1) return;

    if (confirm(`Yakin ingin menghapus buku "${bookTarget.title}"?`)) {
        book_item.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
    updateLocal();
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

function search(query) {
    return book_item.filter(bookItem => bookItem.title.toLowerCase().includes(query.toLowerCase()));
}


document.getElementById('searchBook').addEventListener('submit', function () {
    event.preventDefault();
    const query = document.getElementById('searchBookTitle').value;
    const filteredBooks = search(query);
    displaySearchResults(filteredBooks);
})

function displaySearchResults(filteredBooks) {
    const incompleteBook = document.getElementById('incompleteBookshelfList');
    incompleteBook.innerHTML = '';
    const completeBook = document.getElementById('completeBookshelfList');
    completeBook.innerHTML = '';

    for (const bookItem of filteredBooks) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            completeBook.append(bookElement);
        } else {
            incompleteBook.append(bookElement);
        }
    }
}

function updateLocal() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(book_item)
        localStorage.setItem('book_item', parsed);
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadStorage() {
    const serializedData = localStorage.getItem('book_item');
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            book_item.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}