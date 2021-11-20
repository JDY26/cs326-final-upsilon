const express = require('express');
const app = express();
//const port = 80;
const faker = require('faker');
//https://github.com/Marak/Faker.js#readme
require('dotenv').config();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let MONGODB_URI;

//If there is no environment variable (heroku), then use the local one (dev testing)
if(!process.env.MONGODB_URI){
    let secrets = require('./secrets.json');
    MONGODB_URI = secrets.MONGODB_URI;
    console.log(MONGODB_URI);
}
else{
    MONGODB_URI = process.env.MONGODB_URI;
}

//Session configuration
//Still need to create Secret in heroku, also other session configurations

const session = {
    secret: process.env.Secret,
    resave: false,
    saveUninitialized: false
};

const client = new MongoClient(MONGODB_URI);
//client should be correct now, await client.connect() to connect to db, and then do client.db().whateverCommand() to interact with it. should probably do a client.close() somewhere too?

//Strategy
const strategy = new LocalStrategy(
    async (username, password, done) => {
        
    }
);

//Links to pages

//homePage
app.use('/', express.static('pages/homePage/'));

//userPage
app.use('/userPages/exampleuser', express.static('pages/userPage/'));

//signinPage
app.use('/login', express.static('pages/signinPage/'));

// signupPage
app.use('/register', express.static('pages/signupPage'));


app.use(bodyParser.urlencoded({extended: false}))
//---------------------
//API Stuff 
//User Endpoints

//create user
app.post('/users/new', function (req, res) {
    res.status(201);
    let username = req.body.floatingInput;
    let password = req.body.floatingPassword;
    const user = {}; //Not sure how to include password for user yet
    user["name"] = "";
    user["picture"] = "";
    user["biography"] = "";
    user["username"] = username;
    user["uid"] = Math.floor(Math.random() * 1000000);
    user["yog"] = 2022;
    console.log(`username: ${username}, password: ${password}`);
    res.send("User created");
    res.redirect('/');
});

// login user
app.post('/signin', (req, res) => {
    res.status(200);
    let username = req.body.floatingInput;
    let password = req.body.floatingPassword;
    let remember = req.body.checkbox; 
    console.log(`username: ${username}, password: ${password}, remember-me: ${remember}`);
    res.redirect('/');
});

//update user
app.post('/users/:id', function (req, res) {
    const body = req.body;
    
    res.status(200);
    res.send("User updated");
})

//read user
app.get('/users/:id', function (req, res) {
    //let userdata = {};
    let findUserResponse = await findUserByID(req.params.id);
    if(findUserResponse !== null){
        res.status(200);
        res.send(JSON.stringify(findUserResponse));
    }
    else{
        res.status(404);
        res.send();
    }
});

//delete user. Uses POST for authentication (?)
app.post('/users/:id/delete', function (req, res) {
    try{
        await removeUser(req.params.id);
        res.status(200);
        res.send("User deleted");
    } catch(e){//TODO: impl logic for checking auth, use this temporarily
        res.status(401);//401: unauthorized
        res.send();
    }
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
    removePost(req.params.id).then();
    res.status(200);
    res.send("Post deleted");
});

app.listen(process.env.PORT, () => {
     console.log(`app listening on port ${process.env.PORT}`);
});

//--------------

//Database CRUD operations

//Retrieve a post from the database using the ID
async function findPostByID(postID) {
    try {
        await client.connect();
        const result = await client.db("upsilonTestDB").collection("posts").findOne({pid : postID});

        await client.close();
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

//Retrieve a user from the database using the ID
async function findUserByID(userID) {
    try {
        await client.connect();
        const result = await client.db("upsilonTestDB").collection("users").findOne({uid : userID});

        await client.close();
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

//Retrieve all posts from a certain user
async function findUserPosts(userID) {
    try {
        await client.connect();
        const results = await client.db("upsilonTestDB").collection("posts").find({uid : userID});

        await client.close();
        return results;
    } catch (e) {
        console.log(e);
        return null;
    }
}

//Delete a User Post
async function removePost(postID) {
    try {
        await client.connect();
        await client.db("upsilonTestDB").collection("posts").deleteOne({pid : postID});
        await client.close();
    } catch {
        console.log(e);
    }
}

async function removeUser(userID) {
    try {
        await client.connect();
        await client.db("upsilonTestDB").collection("posts").deleteOne({uid : userID});
        await client.close();
    } catch {
        console.log(e);
    }
}

//Update a User Post *Not Finsihed*
async function updatePost(postID, updates) {
    try {
        await client.connect();
        for(const update of updates) {
            await client.db("upsilonTestDB").collection("posts").updateOne({pid : postID}, {
                $set : {
                    "":""
                }
            });
        }
        await client.close();
    } catch {
        console.log(e);
    }
}

//Create a User
async function createUser(userInfo) {
    try {
        await client.connect();
        await client.db("upsilonTestDB").collection("users").insertOne(userInfo);
        await client.close();
    } catch {
        console.log(e);
    }
}

//Create a Post
async function createPost(postInfo) {
    try {
        await client.connect();
        await client.db("upsilonTestDB").collection("posts").insertOne(postInfo);
        await client.close();
    } catch {
        console.log(e);
    }
}