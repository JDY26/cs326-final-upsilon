const express = require('express');
const app = express();
const port = 8080;
const faker = require('faker');

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
    let userdata = {};
    userdata['name'] = faker.name.findName();
    userdata['picture'] = faker.internet.avatar();
    userdata['biography'] = faker.lorem.sentence();
    userdata['username'] = faker.internet.userName();
    userdata['uid'] = req.params.id;
    userdata['posts'] = [Math.floor(Math.random()*1000), Math.floor(Math.random()*1000), Math.floor(Math.random()*1000), Math.floor(Math.random()*1000)];
    res.send(JSON.stringify(userdata));
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
    let postdata = {};
    const postTypes = ['image', 'audio', 'video']
    postdata['contentType'] = postTypes[Math.floor(Math.random()* 3)];//get a random postType
    postdata['name'] = faker.lorem.words();
    postdata['description'] = faker.lorem.sentences();
    postdata['timestamp'] = faker["datatype"].timestamp;
    postdata['owner'] = faker.internet.userName();
    postdata['uid'] = req.params.id;
    postdata['tags'] = faker.datatype.json();
    postdata['content'] = faker.datatype.json();
    res.send(JSON.stringify(postdata));
});

//delete post. need POST for auth ?
app.post('/posts/:id/delete', function (req, res) {

});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});