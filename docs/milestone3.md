#Database Document Descriptions:
post document {
    pid: String,
    contentType: String,
    name: String,
    description: String,
    timestamp: String,
    owner: String,
    uid: String,
    tags: <Object>,
    content: Image/Audio,
    likes: Integer
}

user document {
    name: String,
    picture: String,
    biography: String,
    username: String,
    posts: Array<String>
    uid: String,
    yog: String
}

#Division of Labor
Casey:
James: Worked on back-end integration for homePage, changed some api endpoints to interact with the database, created some of the CRUD functions for interacting with the database, helped make the edit user profile functionality
Julia: