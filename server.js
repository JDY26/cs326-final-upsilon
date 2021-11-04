const express = require('express');
const app = express();
const port = 8080;

//create user
app.post('/users/new', function (req, res) {

});

//update user
app.post('/users/:id', function (req, res) {

})

//read user
app.get('/users/:id', function (req, res) {

});

//delete user. Uses POST for authentication (?)
app.post('/users/:id/delete', function (req, res) {

});