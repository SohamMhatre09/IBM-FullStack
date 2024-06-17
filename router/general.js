const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const SECRET_KEY = 'your_secret_key';
const jwt = require('jsonwebtoken');
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  for (const user of users) {
    if (user.username === username) {
      return res.status(400).json({ message: "Username already exists" });
    }
  }
  users.push({ username, password });
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  return res
    .status(200)
    .json({ message: "User successfully registered", token });
});

// Get the book list available in the shop..
public_users.get("/", async (req, res) => {
  const booklist = await books();
  return res.status(200).json(booklist);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const book_isbn = await books[req.params.isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const name = req.params.author.toLowerCase().trim();
  const authorBooks = [];

  for (const isbn in books) {
    if (
      books[isbn].author &&
      books[isbn].author.toLowerCase().trim() === name
    ) {
      await authorBooks.push(books[isbn]);
    }
  }

  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title",async (req, res) => {
  const title = req.params.title.toLowerCase().trim();
  const authorBooks = [];

  for (const isbn in books) {
    if (books[isbn].title && books[isbn].title.toLowerCase().trim() === title) {
      await authorBooks.push(books[isbn]);
    }
  }

  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
