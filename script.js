const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generatedId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    const searchButton = document.getElementById('searchSubmit');
    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
        const bookList = document.querySelectorAll(".book_item > h2");
        for (search of bookList) {
            if (searchTitle !== '') {
                if (searchTitle !== search.innerText.toLowerCase()) {
                    search.parentElement.style.display = "none";
                } else {
                    search.parentElement.style.display = "block";
                }
            } else {
                search.parentElement.style.display = "block";
            }
        }
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generatedId();
    const bookObject = generateBookObject(generatedID, title, author, year, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = "";

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});

function makeBook(bookObject) {

    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis : " + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun : " + bookObject.year;

    const itemArticle = document.createElement('article');
    itemArticle.classList.add('book_item');
    itemArticle.append(textTitle, textAuthor, textYear);
    itemArticle.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = "Belum Selesai dibaca";
        undoButton.classList.add('green');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "Hapus buku";
        deleteButton.classList.add('red');

        deleteButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
            alert('Apakah anda ingin menghapus buku ini?');
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(undoButton, deleteButton);
        itemArticle.append(buttonContainer);
    } else {
        const doneButton = document.createElement('button');
        doneButton.innerText = "Selesai dibaca";
        doneButton.classList.add('green');

        doneButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "Hapus buku";
        deleteButton.classList.add('red');

        deleteButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
            alert('Apakah anda ingin menghapus buku ini?');
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        buttonContainer.append(doneButton, deleteButton);
        itemArticle.append(buttonContainer);
    }

    return itemArticle;
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser tidak mendukung local storage");
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}