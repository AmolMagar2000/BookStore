const express = require('express');
const public_users = express.Router();
let books = require("./booksdb.js");
let isValid = require("./customer.js").isValid;
let users = require("./customer.js").users;
const axios = require('axios');

// Function to check if the user exists
const doesExist = (username) => {
  return users.some(user => user.username === username);
}

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const result = Object.values(books).filter(book => book.author === author);
  if (result.length > 0) {
    res.send(result);
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const result = Object.values(books).filter(book => book.title === title);
  if (result.length > 0) {
    res.send(result);
  } else {
    res.status(404).json({ message: "Title not found" });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  res.send(books[isbn].reviews);
});

// Task 10: Get all books using async callback function
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Task 11: Search by ISBN using Promises
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => res.send(response.data))
    .catch(error => res.status(500).send("Error fetching book by ISBN"));
});

// Task 12: Search by Author
public_users.get('/promise/author/:author', (req, res) => {
  const { author } = req.params;
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => res.send(response.data))
    .catch(error => res.status(500).send("Error fetching book by author"));
});

// Task 13: Search by Title
public_users.get('/promise/title/:title', (req, res) => {
  const { title } = req.params;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => res.send(response.data))
    .catch(error => res.status(500).send("Error fetching book by title"));
});

module.exports.general = public_users;
