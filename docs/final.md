## TEAM UPSILON
## UMASS CREATORS
## Fall 2021
## Overview
Our application is meant to be a space for UMass students to share any creative projects they have been working on. 
## Team Members
 - Julia Lin
 - Casey Ryan
 - James Yang
## User Interface
## APIs
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
 - /homePage: The home page of the application
 - /userPages/:user: The profile of the user specified in :user
 - /login: The login page for the application
 - /signup: The sign-up page for the application
## Authentication/Authorization
Authentication is done through the Sign-Up/Login page, where users enter a username and password. Authenticated users have special permissions for their own user page, where they can create, edit, and delete posts as well as edit their profile. When accessing other user pages, all of these functions are hidden and users can only view the profile and posts.
## Division of Labor
 - Julia:
 - Casey:
 - James:
## Conclusion

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