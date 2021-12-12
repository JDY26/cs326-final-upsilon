const express = require('express');
const app = express();
const {v4 : uuidv4} = require('uuid');
//const port = 80;
const faker = require('faker');
//https://github.com/Marak/Faker.js#readme
require('dotenv').config();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const flash = require('express-flash');

const DB_NAME = process.env.DB_NAME || "upsilonTestDB";//Specify which DB to use

let MONGODB_URI;

//If there is no environment variable (heroku), then use the local one (dev testing)
if(!process.env.MONGODB_URI){
    let secrets = require('./secrets.json');
    MONGODB_URI = secrets.MONGODB_URI + `/${DB_NAME}?retryWrites=true&w=majority`;
    console.log(MONGODB_URI);
}
else{
    MONGODB_URI = process.env.MONGODB_URI + `/${DB_NAME}?retryWrites=true&w=majority`;
}


//Session configuration
//Still need to create Secret in heroku, also other session configurations


const client = new MongoClient(MONGODB_URI);
(async function() {
    await client.connect();
})();
//client should be correct now, await client.connect() to connect to db, and then do client.db().whateverCommand() to interact with it. should probably do a client.close() somewhere too?
app.use(function(err, req, res, next) {//prints out all errors
    console.log(err);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'},//maybe redundant?

    async function(username, password, done) {
        const res = await findLoginByEmail(username);
        if(res && res.hash === crypto.createHmac('sha256', res.salt).update(password).digest('hex')){
            //console.log("Logged in");
            return done(null, res);//? I think null for done?
        }
        else{
            //sconsole.log("Failed to log in");
            return done(null, false, {message: 'Error authenticating.'});
        }
    }
));

passport.serializeUser(function(user, done){
    //console.log("Serializing user");
    done(null, user.username);
});

passport.deserializeUser(function(username,done){
    //console.log("Deserializing user");
    findUserByUsername(username).then(res => {
        const jsonRes = JSON.stringify(res);
        done(null, jsonRes);
    });
});

app.use(session({
    genid: (req) => {
        return uuidv4();
    },
    secret: process.env.SECRET || "devSecret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Links to pages

//homePage
app.use('/home', loggedIn, express.static('pages/homePage/'));
//userPage
app.use('/userPages/:id', loggedIn, express.static('pages/userPage/'));

//signinPage
app.use('/login', express.static('pages/signinPage'));

// signupPage
app.use('/register', express.static('pages/signupPage'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function loggedIn(req, res, next) {
    req.isAuthenticated() ? next() : res.redirect('/login');
}

//app.use(flash);
//---------------------
//API Stuff 
//User Endpoints

//create user
app.post('/api/users/new', async function (req, res) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHmac('sha256', salt).update(req.body.password).digest('hex');
    try {
        const dbRes1 = await createLogin({'email' : req.body.email, 'username' : req.body.username, 'hash' : hash, 'salt' : salt});
        const user = {};
        user["username"] = req.body.username;//what does this do?

        //Default values for rest of user
        user["name"] = "Default Name";
        user["biography"] = "Default Bio";
        user["posts"] = [];
        user["yog"] = "2023";
        const dbRes2 = await createUser(user);
        res.status(201);
        res.redirect('/login');
        res.send();
    } catch(e) {
        console.log(e);
        res.status(500);
        res.send();
    }
});

// login user
app.post('/signin', passport.authenticate('local', {failureRedirect: '/login'})); // upon successful login, signinPage/index.js will redirect to the homePage

//update user
app.post('/api/usersUpdate/:username', async function (req, res) {
    const updatedUser = req.body;
    try {
        const dbReq = await updateUser(req.params.username, JSON.stringify(updatedUser));
        res.status(200);
        res.send("User updated");
    } catch(e){
        console.log(e);
        res.status(500);
        res.send();
    }
})

//read user
app.get('/api/users/:username', async function (req, res) {
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
app.post('/api/users/:username/delete', async function (req, res) {
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
app.post('/api/posts/new', async function (req, res) {//TODO: move the 'add post to user's post collection' to the createPost function
    let postObj = req.body;
    const stringToHash = postObj["timestamp"] + postObj["owner"];//String to hash is timestamp followed by owner username, should be unique
    const hashed = {"pid" : crypto.createHash('sha1').update(stringToHash).digest("hex")};//can use sha1 since its not supposed to be secure, just unique
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
        res.status(201);
        res.send();
    } catch(e){
        res.status(500);
        res.send("Error inserting post to user")
    }
});

//update post
app.post('/api/posts/:id', async function (req, res) {
    let postObj = req.body;
    let update = await updatePost(req.params.id, postObj);
    res.status(200);
    res.send("Post updated");
});

//read post
app.get('/api/posts/:id', async function (req, res) {
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
app.post('/api/posts/:id/delete', async function (req, res) {
    try {
        const body = req.body;
        await removePost(req.params.id, body["username"]);
        res.status(200);
        res.send("Post deleted");
    } catch(e) {
        res.status(401);
        res.send("Unable to delete");
    }
});

//like post
app.post('/api/like/:id', async function (req, res) {
    try {
        await client.db().collection("posts").updateOne({"pid" : req.params.id}, {
            $inc : {
                likes : 1
            }
        });
    } catch(e) {
        res.status(401);
        res.send("Like failed");
    }
});

//Get posts for Popular Sorting
//Popularity is determined by most likes within past week
app.get("/api/popular/:content", async function(req, res) {
    try {
        const postCursor = await client.db().collection("posts").find({"contentType" : req.params.content}, {
            $orderby : {
                "likes" : -1
            }
        });
        let count = 0;
        const posts = [];
        while(postCursor.hasNext() && count < 3){
            posts.push(postCursor.next());
            count += 1;
        }
        res.status(200);
        res.send(JSON.stringify(posts[0]));
    } catch(e) {
        res.status(401);
        res.send("Couldn't retrieve posts");
    }
});

app.listen(process.env.PORT || 3000, () => {
     console.log(`app listening on port ${process.env.PORT || 3000}`);
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

//Delete a User Post
async function removePost(postID, username) {
    try {
        await client.db().collection("posts").deleteOne({"pid" : postID});
        await client.db().collection("users").updateOne({"username" : username}, 
            {
                $pull : {
                    "posts" : {
                        "pid" : postID
                    }
                }
            });
    } catch(e){
        console.log(e);
    }
}

async function removeUser(userID) {
    try {
        await client.db().collection("posts").deleteOne({uid : userID});//TODO: remove this, we only do username
    } catch(e) {
        console.log(e);
    }
}

//Update a user profile
async function updateUser(username, userUpdate){
    const updatedUser = JSON.parse(userUpdate);
    try {
        await client.db().collection("users").updateOne({username : username}, {
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
        const res = await client.db().collection("posts").updateOne({pid : postID}, {
            $set : updates
        });
        return res;
    } catch(e) {
        console.log(e);
    }
}

//Create a User
async function createUser(userInfo) {
    try {
        const result = await client.db().collection("users").insertOne(userInfo);
        return result;
    } catch(e) {
        console.log(e);
    }
}

//Create a login for User
async function createLogin(loginInfo) {
    try {
        const result = await client.db().collection("logins").insertOne(loginInfo);
        return result;
    } catch(e) {
        console.log(e);
    }
}

async function findLoginByEmail(email) {
    try {
        const result = await client.db().collection("logins").findOne({email : email});
        return result;
    } catch(e) {
        console.log(e);
    }
}

//Create a Post
async function createPost(postInfo) {
    try {
        const result = await client.db().collection("posts").insertOne(postInfo);
        return result;
    } catch(e) {
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
process.on('SIGQUIT', cleanup);