const bookShelf = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, author, timestamp, isCompleted) {
  return {
    id,
    task,
    author,
    timestamp,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of bookShelf) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookShelf) {
    if (bookShelf[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookShelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      bookShelf.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(todoObject) {
  const { id, task, author, timestamp, isCompleted } = todoObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = task;

  const textAuthor = document.createElement("h3");
  textAuthor.innerText = author;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book_Bag");
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBook() {
  const textTodo = document.getElementById("title").value;
  const authorTodo = document.getElementById("author").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    authorTodo,
    timestamp,
    false
  );
  bookShelf.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId) {
  const todoTarget = findBook(bookId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId) {
  const isDelete = window.confirm("Apakah yakin ingin menghapus buku ini?");

  if (isDelete) {
    const todoTarget = findBookIndex(bookId);
    if (todoTarget === -1) return;
    bookShelf.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Buku berhasil dihapus");
  } else {
    alert("Buku gagal dihapus");
  }
}

function undoTaskFromCompleted(bookId) {
  const todoTarget = findBook(bookId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  const inputSearchBook = document.getElementById("searchBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  inputSearchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("bookShelf");
  const listCompleted = document.getElementById("completed-bookShelf");

  uncompletedTODOList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const todoItem of bookShelf) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});

function searchBook() {
  const searchBook = document.getElementById("searchBookTitle");
  const filter = searchBook.value.toUpperCase();
  const bookItem = document.querySelectorAll(".book_Bag > h2");
  for (const book of bookItem) {
    if (book.innerText.toUpperCase().includes(filter)) {
      book.parentElement.parentElement.style.display = "block";
    } else {
      book.parentElement.parentElement.style.display = "none";
    }
  }
}
