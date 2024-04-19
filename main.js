const book_item = [];
let isEditing = false;
const RENDER_EVENT = 'render_book';


document.addEventListener('DOMContentLoaded', function () {
    addBookHandler();
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

function addBookHandler() {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        document.dispatchEvent(new Event(RENDER_EVENT));
        updateLocal();

    });
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

    const editButton = document.createElement('button');
    editButton.classList.add('yellow');
    editButton.innerText = 'Edit Buku';

    completeButton.addEventListener('click', function () {
        addCompleteList(bookItemObject.id);
    });

    editButton.addEventListener('click', function () {
        editBook(bookItemObject.id);
    });

    removeButton.addEventListener('click', function () {
        removeBookList(bookItemObject.id);
    })

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    actionContainer.append(completeButton, editButton, removeButton);

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
    const index = book_item.findIndex(book => book.id === bookID);

    if (index === -1) return;

    const bookTarget = book_item[index];
    if (confirm(`Yakin ingin menghapus buku "${bookTarget.title}"?`)) {
        book_item.splice(index, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        updateLocal();
    }
}


function editBookListHandler(bookTarget) {
    const form = document.getElementById('inputBook');
    const titleInput = form.querySelector('#inputBookTitle');
    const authorInput = form.querySelector('#inputBookAuthor');
    const yearInput = form.querySelector('#inputBookYear');
    const isCompleteInput = form.querySelector('#inputBookIsComplete');
    let editButton = form.querySelector('#bookEdit');

    titleInput.value = bookTarget.title;
    authorInput.value = bookTarget.author;
    yearInput.value = bookTarget.year;
    isCompleteInput.checked = bookTarget.isComplete;

    form.style.display = 'block';

    // Menghapus event listener agar tidak terduplikasi dengan cara mengcole button tersebut dan menggantinya
    const newEditButton = editButton.cloneNode(true);
    editButton.parentNode.replaceChild(newEditButton, editButton);
    editButton = newEditButton;

    editButton.addEventListener('click', function (event) {
        event.preventDefault();
        const index = book_item.findIndex(book => book.id === bookTarget.id);
        if (index !== -1) {
            book_item[index] = {
                ...book_item[index],
                title: titleInput.value,
                author: authorInput.value,
                year: yearInput.value,
                isComplete: isCompleteInput.checked
            };
            document.dispatchEvent(new Event(RENDER_EVENT));
            updateLocal();
            form.reset();
            isEditing = false;
            document.getElementById('bookEdit').style.display = 'none';
        }
    });
}



function editBook(bookID) {
    const bookTarget = findBook(bookID);
    if (bookTarget == null) return;

    isEditing = true;
    document.getElementById('bookEdit').style.display = 'block';
    editBookListHandler(bookTarget);
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