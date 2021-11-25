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
James:
Julia: