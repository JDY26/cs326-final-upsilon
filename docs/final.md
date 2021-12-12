## TEAM UPSILON
## UMASS CREATORS
## Fall 2021
## Overview
Our application is a space for members of the UMass Community to share their visual and audio art privately with other students. It is a social media platform restricted to just UMass students, so they can share their songs and pictures with a smaller & relatively intimate crowd, compared to posting it on the internet where it is hard to gain a following. It also features a hierarchical-tag system so users can label their creations very precisely, and group them with different-sized sets of similar posts. With some intelligent API use, users can filter all posts to contain a very specific subset of whatever type of content they like. 
## Team Members
 - Julia Lin, [hyuelin](https://github.com/hyuelin)
 - Casey Ryan, [caseyryan22465](https://github.com/caseyryan22465)
 - James Yang, [jdy26](https://github.com/jdy26)
## User Interface
* Login
* Register
* Home Page
* User Page
* Create Post
* Edit Post
* Edit Profile
* Menu
## APIs
 - /api/users/new - Creates a new user, the username is passed in req.body
 - /signin - Used to authenticate a login attempt
 - /api/usersUpdate/:username - Update the user sepcified by :username, the updates are passed in req.body
 - /api/users/:username - Retrieves the user data specified in :username
 - /api/users/:username/delete - Deletes user specified by :username
 - /api/posts/new - Create a new post, post data is passed in req.body
 - /api/posts/:id - Update the post specified by :id, the updates are passed in req.body, POST
 - /api/posts/:id - Retrieve the post specified by :id, GET
 - /api/posts/:id/delete - Deletes the post specified by :id and removes the post from the associated user
 - /api/like/:id - Increments the likes of the post specified by :id by 1
 - /api/:order/:content - Retrieves three posts of type :content, either image or audio, based on the ordering specified by :order, either top, popular, or new.
## Database
Post document
```js
{
    pid: String, //The posts unique id, used to get posts from the database
    contentType: String, //The type of upload it is, Audio or Image
    name: String, //The name of the post
    description: String, //The description of the post
    timestamp: double, //The time the post was uploaded
    owner: String, //The username of the uploader of the post
    tags: Object, //An object of arrays of tags describing the post
    content: Object, //The url for the image/audio uploaded
    likes: Integer //The number of likes on the post
}
```
User document 
```js
{
    name: String, //The users name
    profile_picture: String, //The users prfile picture
    biography: String, //The users description of their profile/themself
    username: String, //The users username, used for authentication and routing to their profile
    posts: Array<Object> //An array of all of a users posts, stored using the posts id to access it in the post document
        pid: String,
    yog: String //The users year of graduation
}
```
Login document
```js
{
    email: String, //Users email used to sign-up
    username: String, //Users username, used for authentication as well as being what users are referred to
    hash: String, //Hashed password
    salt: String //Salt generated on sign-up
}
```
## URL Routes/Mappings
 - /home: The home page of the application
 - /userPages/:id: The profile of the user specified in :id
 - /login: The login page for the application, every page redirects here if the user is not logged in
 - /register: The sign-up page for the application
## Authentication/Authorization
Authentication is done through the Sign-Up/Login page, where users enter a username and password. Authenticated users have special permissions for their own user page, where they can create, edit, and delete posts as well as edit their profile. When accessing other user pages, all of these functions are hidden and users can only view the profile and posts.

Passsword Hashing was done with the crypto module from Node.js, using SHA256 hash function and a salt. Login and Session-Authentication was done with Passport.
## Division of Labor
 - Julia:
 - Casey:
 - James: Wrote the html, js, and css for the home page. Helped make some of the API endpoints, wrote some of the mongodb CRUD functions, helped a little with authentication and sessions. Also helped with the delete/edit post functionality and some of the post interface.
## Conclusion
This project was a good experience for working on an application as part of a team. Initially, our design was to create a tumblr/Reddit style application for UMass students to share projects they have created. During the creation of the application, we decided to focus down to images and audio uploads to make it simpler. Authentication also proved to add some difficulties as we had to adjust the way the pages were being served so they would work with passports redirects. Audio also proved to be a bit more difficult than initially expected, so instead of playing audio through our application and taking audio file uploads, we simply store links to other music/video hosting sites. While the audio is not stored locally, we figured this would be a good solution as we still offer a medium to share. Besides these large changes, some smaller adjustments from our original idea were made to the interface and posts. This project was also a good opportunity to learn more about routing, database interactions, authentication and front-end development beyond what we learned in class.


Hosted Application Link: https://cs326-finalupsilon.herokuapp.com/

## Rubric
Authentication: 10 Points
 - Create a user in Sign-Up page
 - Login a user, and create an authenticated session
 - Allow edit permissions on owned profile, hidden for other profiles
  
Routing : 10 Points
 - Successful login routes to home page
 - Home Page posts route to the user page of the owner
  
Home Page: 20 Points
 - View posts chosen based on popularity, upload date, or overall likes
 - Search for a user using the search bar
 - Like the featured posts
 - Redirect to the user page of the owners of the featured posts
  
User Page: 30 Points
 - View all of a users posts
 - View a users profile picture, year of graduation, name, and biography
 - Create, edit, and delete your own posts
 - Edit and delete your own profile
  
Sign-In: 15 Points
 - Allow the a user to sign-up, creating a profile for them
 - Allow the user to sign-in, creating an authenticated session

Style: 5 Points
 - No erroneous code fragments
 - Thorough and detailed commenting
 - Linted and consistent coding style

CRUD: 5 Points
 - Create
 - - Create a user
 - - Create a post
 - Read
 - - View a user profile
 - - View a user's posts
 - - View front-page posts
 - Update
 - - Edit a post you own
 - - Edit your own profile
 - - Liking a post
 - Delete
 - - Delete a post you own
 - - Delete your profile

Video: 5 Points
