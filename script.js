// Assignment 11 - Vibe Coding: Reading List App Using Vanilla JS
// Incorporates all prompts, defect fixes (duplicates & 60 char limit), and additional features (delete & summary counts).

const STORAGE_KEY = "vibe_reading_list_books_v1";

// Initial default sample data if empty
const defaultBooks = [
    { id: "1", title: "Clean Code", status: "Finished" },
    { id: "2", title: "The Pragmatic Programmer", status: "Reading" },
    { id: "3", title: "Designing Data-Intensive Applications", status: "Want to Read" }
];

let books = loadBooks();

// DOM references
const addBookForm = document.getElementById("addBookForm");
const bookTitleInput = document.getElementById("bookTitle");
const initialStatusSelect = document.getElementById("initialStatus");
const formFeedback = document.getElementById("formFeedback");
const statusFilter = document.getElementById("statusFilter");
const booksGrid = document.getElementById("booksGrid");
const emptyState = document.getElementById("emptyState");
const totalBooksCountEl = document.getElementById("totalBooksCount");
const readingCountEl = document.getElementById("readingCount");
const finishedCountEl = document.getElementById("finishedCount");

function loadBooks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Could not read from localStorage, using default data.", e);
    }
    return [...defaultBooks];
}

function saveBooks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
        console.warn("Could not write to localStorage.", e);
    }
}

function updateSummary() {
    const total = books.length;
    const reading = books.filter(b => b.status === "Reading").length;
    const finished = books.filter(b => b.status === "Finished").length;

    totalBooksCountEl.textContent = total;
    readingCountEl.textContent = reading;
    finishedCountEl.textContent = finished;
}

function renderBooks() {
    const filter = statusFilter.value;
    const filtered = filter === "All" ? books : books.filter(b => b.status === filter);

    booksGrid.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.style.display = "block";
        if (filter !== "All" && books.length > 0) {
            emptyState.querySelector("p").textContent = `No books with status "${filter}".`;
        } else {
            emptyState.querySelector("p").textContent = "Your reading list is empty. Add your first book.";
        }
    } else {
        emptyState.style.display = "none";
        filtered.forEach(book => {
            const card = document.createElement("div");
            card.className = "book-card";

            const info = document.createElement("div");
            info.className = "book-info";

            const badge = document.createElement("span");
            const badgeClass = book.status === "Want to Read" ? "want" : (book.status === "Reading" ? "reading" : "finished");
            badge.className = `status-badge ${badgeClass}`;
            badge.textContent = book.status;

            const title = document.createElement("span");
            title.className = "book-title";
            title.textContent = book.title;

            info.appendChild(badge);
            info.appendChild(title);

            const actions = document.createElement("div");
            actions.className = "book-actions";

            // Status select dropdown
            const select = document.createElement("select");
            select.className = "status-select";
            select.setAttribute("aria-label", `Change status for ${book.title}`);
            ["Want to Read", "Reading", "Finished"].forEach(optVal => {
                const opt = document.createElement("option");
                opt.value = optVal;
                opt.textContent = optVal;
                if (book.status === optVal) opt.selected = true;
                select.appendChild(opt);
            });

            select.addEventListener("change", (e) => {
                changeBookStatus(book.id, e.target.value);
            });

            // Delete button (Additional-Features Prompt)
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "btn-delete";
            deleteBtn.textContent = "Delete";
            deleteBtn.setAttribute("aria-label", `Delete ${book.title}`);
            deleteBtn.addEventListener("click", () => {
                deleteBook(book.id);
            });

            actions.appendChild(select);
            actions.appendChild(deleteBtn);

            card.appendChild(info);
            card.appendChild(actions);

            booksGrid.appendChild(card);
        });
    }

    updateSummary();
}

function normalizeTitle(title) {
    return title.trim().replace(/\s+/g, " ").toLowerCase();
}

// Add Book submission with Defect Checks
addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formFeedback.textContent = "";

    const rawTitle = bookTitleInput.value;
    const cleanTitle = rawTitle.trim().replace(/\s+/g, " ");

    // Defect Check 2: Limit book title to maximum 60 characters
    if (cleanTitle.length > 60) {
        formFeedback.textContent = "Book title must be 60 characters or fewer.";
        return;
    }

    if (cleanTitle.length === 0) {
        formFeedback.textContent = "Please enter a valid book title.";
        return;
    }

    // Defect Check 1: Prevent duplicate book titles, ignoring case & extra spaces
    const normalizedInput = normalizeTitle(cleanTitle);
    const isDuplicate = books.some(b => normalizeTitle(b.title) === normalizedInput);

    if (isDuplicate) {
        formFeedback.textContent = "This book is already in your reading list.";
        return;
    }

    const newBook = {
        id: Date.now().toString(),
        title: cleanTitle,
        status: initialStatusSelect.value
    };

    books.unshift(newBook);
    saveBooks();
    renderBooks();

    bookTitleInput.value = "";
    formFeedback.textContent = "";
});

function changeBookStatus(bookId, newStatus) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.status = newStatus;
        saveBooks();
        renderBooks();
    }
}

function deleteBook(bookId) {
    books = books.filter(b => b.id !== bookId);
    saveBooks();
    renderBooks();
}

statusFilter.addEventListener("change", renderBooks);

// Initial render
renderBooks();
