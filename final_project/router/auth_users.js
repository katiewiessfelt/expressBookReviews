const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    if(users.hasOwnProperty( username )) {
        return true;
    };

    return false;
}

const authenticatedUser = (username, password) => {
    for (let i = 0; i<users.length; i++) {
        // return users[i][username]
        if (users[i].hasOwnProperty(username) && users[i][username] === password) {
            return true
        }
    }

    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username.replaceAll(" ", "");
    const password = req.body.password;

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 600 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "User successfully logged in" });
    }
    return res.status(404).json({ message: "Unable to authenticate user" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    if (!review) {
        return res.status(404).send("Please enter a review");
    }
    if (!req.params.isbn) {
        return res.status(404).send("ISBN required");
    }
    const book = books[req.params.isbn]
    if (!book) {
        return res.status(404).send("Invalid ISBN");
    }
    books[req.params.isbn].reviews[req.session.authorization.username] = review

    return res.status(200).json(books[req.params.isbn].reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (books[req.params.isbn].reviews[req.session.authorization.username]) {
        delete books[req.params.isbn].reviews[req.session.authorization.username];
        return res.status(200).json({reviews: books[req.params.isbn].reviews, message: "review successfully deleted"});
    } else {
        return res.status(404).send("You have no reviews for this book");
    }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
