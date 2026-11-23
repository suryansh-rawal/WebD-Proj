const express = require("express");

const app = express();
const PORT = 3000;


app.use(express.json());

let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];


function isValidBook(book) {
    return (
        book &&
        typeof book === "object" &&
        !Array.isArray(book) &&
        typeof book.title === "string" &&
        book.title.trim() !== "" &&
        typeof book.author === "string" &&
        book.author.trim() !== "" &&
        typeof book.genre === "string" &&
        book.genre.trim() !== "" &&
        Number.isInteger(book.publishedYear) &&
        book.publishedYear > 0 &&
        typeof book.available === "boolean"
    );
}

app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

app.post("/api/books", (req, res) => {
    const newBook = req.body;

    if (!isValidBook(newBook)) {
        return res.status(400).json({
            message: "Invalid book data. Please provide all required fields."
        });
    }

    const newId = Math.max(...books.map(book => book.id), 100) + 1;

    const book = {
        ...newBook,
        id: newId
    };

    books.push(book);

    res.status(201).json({
        message: "Book added successfully.",
        book: book
    });
});

app.get("/api/books/filter", (req, res) => {
    const author = req.query.author;

    if (!author || typeof author !== "string") {
        return res.status(400).json({
            message: "Please provide an author query parameter."
        });
    }

    const filteredBooks = books.filter(book =>
        book.author.toLowerCase().includes(author.trim().toLowerCase())
    );

    res.status(200).json(filteredBooks);
});

app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!Number.isInteger(id) || !book) {
        return res.status(404).json({
            message: "Book not found."
        });
    }

    res.status(200).json(book);
});

app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Book not found."
        });
    }

    const updatedBook = req.body;

    if (!isValidBook(updatedBook)) {
        return res.status(400).json({
            message: "Invalid book data. Please provide all required fields."
        });
    }

    books[index] = {
        ...updatedBook,
        id: id
    };

    res.status(200).json({
        message: "Book updated successfully.",
        book: books[index]
    });
});

app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Book not found."
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully."
    });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON format."
        });
    }

    next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});