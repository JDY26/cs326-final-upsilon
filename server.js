const express = require('express');
const app = express();
//const port = 80;
const faker = require('faker');
//https://github.com/Marak/Faker.js#readme
//Links to pages

//homePage
app.use('/', express.static('pages/homePage/'));

//userPage
app.use('/userPages/exampleuser', express.static('pages/userPage/'));

//signinPage

app.use('/login', express.static('pages/signinPage/'));




//---------------------
//API Stuff 
//User Endpoints

//create user
app.post('/users/new', function (req, res) {
    res.status(201);
    res.send("User created");
});

//update user
app.post('/users/:id', function (req, res) {
    res.status(200);
    res.send("User updated");
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
    userdata['yog'] = Math.floor(Math.random() * 5)+2021;
    res.status(200);
    res.send(JSON.stringify(userdata));
});

//delete user. Uses POST for authentication (?)
app.post('/users/:id/delete', function (req, res) {
    res.status(200);
    res.send("User deleted");
});

//--------------------------------------------------------
//Post Endpoints

//create post
app.post('/posts/new', function (req, res) {
    res.status(201);
    res.send("Post Created");
});

//update post
app.post('/posts/:id', function (req, res) {
    res.status(200);
    res.send("Post updated");
});

//read post
app.get('/posts/:id', function (req, res) {
    let postdata = {};
    const postTypes = ['image', 'audio']
    postdata['contentType'] = postTypes[Math.floor(Math.random()* 2)];//get a random postType
    postdata['name'] = faker.lorem.words();
    postdata['description'] = faker.lorem.sentences();
    postdata['timestamp'] = faker.datatype.timestamp;
    postdata['owner'] = faker.internet.userName();
    postdata['uid'] = req.params.id;
    let tag1 = faker.lorem.word();
    let tag2 = faker.lorem.word();
    let subtags1 = [faker.lorem.word(), faker.lorem.word()];
    let subtags2 = [faker.lorem.word()];
    postdata['tags'] = {"l1tags":[tag1,tag2]};
    postdata['tags'][tag1] = subtags1;
    postdata['tags'][tag2] = subtags2;
    postdata['content'] = postdata['contentType'] === 'image' ? {"imageUrl": faker.image.city()} : {"albumArt": faker.image.nightlife(), "songUrl": faker.internet.url()};
    res.status(200);
    res.send(JSON.stringify(postdata));
});

//delete post. need POST for auth ?
app.post('/posts/:id/delete', function (req, res) {
    res.status(200);
    res.send("Post deleted");
});

app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
});