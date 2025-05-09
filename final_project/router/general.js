const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username.replaceAll(" ", "");
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error creating user. Make sure you provide a username and password." });
    }

    let exists = false; // check if user already exists
    for (let i = 0; i < users.length; i++) {
        if (users[i][username]) {
            exists = true;
            break;
        }
    };

    if (!exists) {
        const user = { [username]: password }
        users.push(user);
        return res.status(200).send("User session successfully created");
    }
    return res.status(404).json({ message: "Error creating user. Username already exists." });
});

public_users.get('/users', function (req, res) {
    return res.status(200).json(users);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books)
        }, 6000)
    })
    getBooks.then((data) => {
        return res.status(200).json(data)
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let getBook = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books[req.params.isbn])
        }, 6000)
    })
    getBook.then((data) => {
        return res.status(200).json(data)
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let getBook = new Promise((resolve, reject) => {
        setTimeout(() => {
            let book = {}
            Object.keys(books).forEach(key => {
                if (books[key].author == req.params.author) {
                    book = books[key];
                }
            })
            if (Object.keys(book).length > 0) {
                resolve(book)
            } else {
                reject("Author not found")
            }
        }, 6000)
    })
    getBook.then((data) => {
        return res.status(200).json(data)
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let getBook = new Promise((resolve, reject) => {
        setTimeout(() => {
            let book = {}
            Object.keys(books).forEach(key => {
                if (books[key].title == req.params.title) {
                    book = books[key];
                }
            })
            if (Object.keys(book).length > 0) {
                resolve(book)
            } else {
                reject("Title not found")
            }
        }, 6000)
    })
    getBook.then((data) => {
        return res.status(200).json(data)
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    return res.status(200).json(books[req.params.isbn]['reviews']);
});

module.exports.general = public_users;
