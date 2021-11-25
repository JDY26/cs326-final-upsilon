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
const crypto = require('crypto');

const DB_NAME = process.env.DB_NAME || "upsilonTestDB";//Specify which DB to use

let MONGODB_URI;

//If there is no environment variable (heroku), then use the local one (dev testing)
if(!process.env.MONGODB_URI){
    let secrets = require('./secrets.json');
    MONGODB_URI = secrets.MONGODB_URI;
    console.log(MONGODB_URI);
}
else{
    MONGODB_URI = process.env.MONGODB_URI + `/${DB_NAME}?retryWrites=true&w=majority`;
}


//Session configuration
//Still need to create Secret in heroku, also other session configurations

const session = {
    secret: process.env.Secret,
    resave: false,
    saveUninitialized: false
};

const client = new MongoClient(MONGODB_URI);
(async function() {
    await client.connect();
})();
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
app.use('/userPages/:id', express.static('pages/userPage/'));

//signinPage
app.use('/login', express.static('pages/signinPage/'));

// signupPage
app.use('/register', express.static('pages/signupPage'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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
app.post('/usersUpdate/:username', async function (req, res) {
    const updatedUser = req.body;
    try {
        await updateUser(req.params.username, updatedUser);
        res.status(200);
        res.send("User updated");
    } catch(e){
        res.status(500);
        res.send();
    }
})

//read user
app.get('/users/:username', async function (req, res) {
    let findUserResponse = await findUserByUsername(req.params.username);
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
app.post('/users/:username/delete', async function (req, res) {
    try{
        await removeUser(req.params.username);
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
app.post('/posts/new', async function (req, res) {
    let postObj = req.body;
    const stringToHash = postObj["timestamp"] + postObj["owner"];//String to hash is timestamp followed by owner username, should be unique
    const hashed = crypto.createHash('sha1').update(stringToHash).digest("hex");//can use sha1 since its not supposed to be secure, just unique
    postObj["pid"] = hashed;
    const dbStatus = await createPost(postObj);//maybe stringify?

    
    if(dbStatus !== null){
        res.status(201);
        //res.send("Post Created");
    }
    else{
        res.status(500);
        res.send("Could not insert post into database");
    }
    //add the post to the user's post collection
    try{
        await client.db().collection('users').updateOne({username:postObj['owner']}, {
            $push : {
                posts: hashed
            }
        });
    } catch(e){
        res.status(500);
        res.send("Error inserting post to user")
    }
});

//update post
app.post('/posts/:id', function (req, res) {
    res.status(200);
    res.send("Post updated");
});

//read post
app.get('/posts/:id', async function (req, res) {
    const postdata = await findPostByID(req.params.id);
    if(postdata !== null){
        res.status(200);
        res.send(JSON.stringify(postdata));
    } else {
        res.status(404);
        res.send(`could not find post with id ${req.params.id}`);
    }
});

//delete post. need POST for auth ?
app.post('/posts/:id/delete', async function (req, res) {
    try {
        await removePost(req.params.id);
        res.status(200);
        res.send("Post deleted");
    } catch(e) {
        res.status(401);
        res.send("Unable to delete");
    }
});

//like post
app.post('/like/:id', async function (req, res) {
    try {
        await client.db().collection("posts").updateOne({pid : req.params.id}, {
            $inc : {
                likes : 1
            }
        });
    } catch(e) {
        res.status(401);
        res.send("Like failed");
    }
});

app.listen(process.env.PORT, () => {
     console.log(`app listening on port ${process.env.PORT}`);
});

//--------------

//Database CRUD operations

//Retrieve a post from the database using the ID
async function findPostByID(postID) {
    try {
        const result = await client.db().collection("posts").findOne({pid : postID});
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

//Retrieve a user from the database using the ID
async function findUserByID(userID) {
    try {
        const result = await client.db().collection("users").findOne({uid : userID});
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

//Retrieve a user from the database using the username
async function findUserByUsername(username) {
    try {
        const result = await client.db().collection("users").findOne({username : username});
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

//Retrieve all posts from a certain user
async function findUserPosts(userID) {
    try {
        const results = await client.db().collection("posts").find({uid : userID});
        return results;
    } catch (e) {
        console.log(e);
        return null;
    }
}

//Delete a User Post
async function removePost(postID) {
    try {
        await client.db().collection("posts").deleteOne({pid : postID});
    } catch {
        console.log(e);
    }
}

async function removeUser(userID) {
    try {
        await client.db().collection("posts").deleteOne({uid : userID});
    } catch {
        console.log(e);
    }
}

//Update a user profile
async function updateUser(userID, userUpdate){
    const updatedUser = JSON.parse(userUpdate);
    try {
        await client.db().collection("users").updateOne({uid : userID}, {
            $set : {
                "name" : updatedUser["name"],
                "biography" : updatedUser["biography"],
                "profile_picture" : updatedUser["profile_picture"],
                "yog" : updatedUser["yog"]
            }
        });
    } catch(e) {
        console.log(e);
    }
}

//Update a User Post *Not Finsihed*
async function updatePost(postID, updates) {
    try {
        let results = [];//Array of all results
        for(const update of updates) {
            const res = await client.db().collection("posts").updateOne({pid : postID}, {
                $set : {
                    "":""
                }
            });
            results.push(res);//add each result to array
        }
        return results;//return array of results? maybe just return if all (promise.all) were successful?
    } catch {
        console.log(e);
    }
}

//Create a User
async function createUser(userInfo) {
    try {
        const result = await client.db().collection("users").insertOne(userInfo);
        return result;
    } catch {
        console.log(e);
    }
}

//Create a Post
async function createPost(postInfo) {
    try {
        const result = await client.db().collection("posts").insertOne(postInfo);
        return result;
    } catch {
        console.log(e);
    }
}

// When the process closes, close the mongodb connection.
async function cleanup(){
    await client.close();
    process.exit();
}
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);