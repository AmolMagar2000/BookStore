const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/customer.js').authenticated;
const genl_routes = require('./router/public.js').general;

let users = [];

// Function to check if the user exists
const doesExist = (username) => {
  return users.some(user => user.username === username);
}

// Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

const app = express();
app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", (req, res, next) => {
  if (req.session.authorization) {
    const token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
