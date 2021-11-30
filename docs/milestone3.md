# Database Document Descriptions:
Post document
```js
{
    pid: String,
    contentType: String,
    name: String,
    description: String,
    timestamp: double,
    owner: String,
    uid: String,
    tags: Object,
    content: Object,
    likes: Integer
}
```
User document 
```js
{
    name: String,
    picture: String,
    biography: String,
    username: String,
    posts: Array<String>,
    yog: String
}
```

## [Link to website](http://https://cs326-finalupsilon.herokuapp.com/ "Link to website")
# Division of Labor
### Casey:
- Dynamically generate user page according to database data
- Dynamically route and generate a user's page
- add functionality to create new post
 - Frontend and backend
  - Modal form with nice UI and dynamic elements
  - Post-tagging with 2 'levels' of tags
- Some MongoDB client code
- Heroku Environment Variables
- Refactoring MongoDB client code
  - Reduced outgoing connections causing slowdown & rate limiting
- Bugfixing on Edit User Feature
- Project Planning (Issues & Feature Tracking)

James: Worked on back-end integration for homePage, changed some api endpoints to interact with the database, created some of the CRUD functions for interacting with the database, helped make the edit user profile functionality

Julia: