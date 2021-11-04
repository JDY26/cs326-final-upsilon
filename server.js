const express = require('express');
const app = express();
const port = 8080;

//Links to pages

//homePage
app.use('/', express.static('pages/homePage/'));

//userPage
app.use('/users/exampleuser', express.static('pages/userPage/'));

//signinPage

app.use('/login', express.static('pages/signinPage/'));




//---------------------
//API Stuff 
//User Endpoints

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

//--------------------------------------------------------
//Post Endpoints

//create post
app.post('/posts/new', function (req, res) {

});

//update post
app.post('/posts/:id', function (req, res) {

});

//read post
app.get('/posts/:id', function (req, res) {

});

//delete post. need POST for auth ?
app.post('/posts/:id/delete', function (req, res) {

});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});