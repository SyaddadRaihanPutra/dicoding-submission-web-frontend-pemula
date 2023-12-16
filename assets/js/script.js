document.addEventListener('DOMContentLoaded', function () {
  const books = JSON.parse(localStorage.getItem('books')) || [];

  function renderBooks(booksToShow = books) {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    booksToShow.forEach((book) => {
      const bookCard = document.createElement('article');
      bookCard.classList.add('card', 'my-4');

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const title = document.createElement('h3');
      title.textContent = book.title;

      const author = document.createElement('p');
      author.textContent = `Penulis: ${book.author}`;

      const year = document.createElement('p');
      year.textContent = `Tahun: ${book.year}`;

      const actionButtons = document.createElement('div');
      actionButtons.classList.add('action');

      const markAsReadButton = document.createElement('button');
      markAsReadButton.classList.add('btn', 'btn-sm', 'btn-primary');
      markAsReadButton.innerHTML = '<i class="bi bi-check"></i>';
      markAsReadButton.addEventListener('click', () => markAsRead(book.id));

      const removeButton = document.createElement('button');
      removeButton.classList.add('btn', 'btn-sm', 'mx-1', 'btn-danger');
      removeButton.innerHTML = '<i class="bi bi-x"></i>';
      removeButton.addEventListener('click', () => removeBookWithConfirmation(book.id));

      actionButtons.appendChild(markAsReadButton);

      if (book.isComplete) {
        const resetButton = createResetButton(book.id);
        actionButtons.appendChild(resetButton);
      }

      actionButtons.appendChild(removeButton);

      if (!book.isComplete) {
            markAsReadButton.style.display = 'inline-block';
          } else {
            markAsReadButton.style.display = 'none';
          }

      cardBody.appendChild(title);
      cardBody.appendChild(author);
      cardBody.appendChild(year);
      cardBody.appendChild(actionButtons);

      bookCard.appendChild(cardBody);

      if (book.isComplete) {
        completeBookshelfList.appendChild(bookCard);
      } else {
        incompleteBookshelfList.appendChild(bookCard);
      }
    });
  }

  function addBook(title, author, year, isComplete) {
    // Convert the year to a number
    const numericYear = parseInt(year, 10);

    // Check if the conversion is successful
    if (isNaN(numericYear)) {
      showToast('Tahun harus berupa angka');
      return;
    }

    const newBook = {
      id: new Date().getTime(),
      title,
      author,
      year: numericYear, // Use the converted numericYear
      isComplete,
    };

    books.push(newBook);

    localStorage.setItem('books', JSON.stringify(books));

    renderBooks();

    showToast('Buku berhasil ditambahkan');
  }


  function markAsRead(bookId) {
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books[index].isComplete = true;

      localStorage.setItem('books', JSON.stringify(books));

      renderBooks();

      showToast('Buku berhasil ditandai sebagai sudah selesai dibaca');
    }
  }

  function resetToIncomplete(bookId) {
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books[index].isComplete = false;

      localStorage.setItem('books', JSON.stringify(books));

      renderBooks();

      showToast('Buku berhasil direset ke Daftar Belum Selesai Dibaca');
    }
  }

  function showConfirmationDialog(message, callback) {
    const isConfirmed = confirm(message);
    if (isConfirmed) {
      callback();
    }
  }

  function removeBookWithConfirmation(bookId) {
    showConfirmationDialog('Apakah Anda yakin ingin menghapus buku ini?', () => {
      removeBook(bookId);
      showToast('Buku berhasil dihapus');
    });
  }

  function removeBook(bookId) {
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books.splice(index, 1);

      localStorage.setItem('books', JSON.stringify(books));

      renderBooks();
    }
  }

  function searchBooks(query) {
    const searchResults = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );

    renderBooks(searchResults);
  }

  function resetBookshelf() {
    renderBooks();
  }

  const form = document.getElementById('inputBook');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    addBook(title, author, year, isComplete);

    form.reset();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const searchQuery = document.getElementById('searchBookTitle').value;
    searchBooks(searchQuery);
  });

  const resetButton = document.getElementById('searchReset');
  resetButton.addEventListener('click', resetBookshelf);

  function createResetButton(bookId) {
    const resetButton = document.createElement('button');
    resetButton.classList.add('btn', 'btn-sm', 'mx-1', 'btn-secondary');
    resetButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    resetButton.addEventListener('click', () => resetToIncomplete(bookId));
    return resetButton;
  }

  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `
      <div class="toast-body">${message}</div>
    `;
    toastContainer.appendChild(toast);

    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();

    toast.addEventListener('hidden.bs.toast', function () {
      toast.remove();
    });
  }

  renderBooks();
});
