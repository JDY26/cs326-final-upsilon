function generateTags(tags, postElement){;
  let htmlStr = '';
  let closingStack = [];
  for(let i = 0; i < tags["l1tags"].length; i++){//2 levels of tags
    htmlStr += '<li class="list-group-item d-flex userPost tagGroup">';
    closingStack.push('</li>');
    htmlStr += '<div class="row">'
    htmlStr += '<div class="col-md-4 tagl1">';
    htmlStr += `<span class="badge rounded-pill bg-secondary">${tags["l1tags"][i]}</span></div>`;
    htmlStr += '<div class="col-md-4 tagl2">';
    closingStack.push('</div>')
    for(let j = 0; j < tags[tags["l1tags"][i]].length; j++){
      htmlStr += `<br><span class="badge rounded-pill bg-secondary">${tags[tags["l1tags"][i]][j]}</span>`;
    }
    htmlStr += closingStack.pop();
    htmlStr += closingStack.pop();
  }
  postElement.getElementsByClassName("tagList")[0].innerHTML = htmlStr;
}
function generateMusicCard(albumURL, songURL, title, description){
  let musicCard = `
    <div class="card mb-3 userPost">
      <div class="row">
        <div class="col-md-2 albumcover">
          <img src=${albumURL} class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <h2 class="postTitle">${title}</h2>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <button class="btn btn-secondary d-flex" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
              </svg>
            </button>
            <p class="d-flex">
              2:40/3:07
            </p>
            <div class="card-body">
              <p class="card-text d-flex postDescription">
                ${description}
              </p>
            </div>
        </div>
        <div class="col-md-2">
          <div class="card-body">
            <ul class="list-group list-group-flush tagList">
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="btn-group float-end" role="group">
            <button type="button" class="btn btn-warning float-end editPost">Edit</button>
            <button type="button" class="btn btn-danger float-end deletePost">Delete</button>
          </div>
        </div>
      </div>
    </div>
`
  return musicCard;
}

function generateArtCard(image, title, description){
  let artCard = `
  <div class="card-mb-3 userPost">
                  <div class="row">
                    <div class="col-md-6 artImage">
                      <img src=${image} class="img-fluid rounded-start" alt="...">
                    </div>
                    <div class="col-md-4">
                      <div class="card-body">
                        <h2 class="card-text d-flex postTitle">
                          ${title}
                        </h2>
                        <p class="card-text d-flex postDescription">
                          ${description}
                        </p>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="card-body">
                        <ul class="list-group list-group-flush tagList">
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="btn-group float-end" role="group">
                        <button type="button" class="btn btn-warning float-end editPost">Edit</button>
                        <button type="button" class="btn btn-danger float-end deletePost">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
  `
  return artCard;
}
async function generatePosts(){
  let userId = window.location.pathname.split('/').slice(-2)[0];
  let response = await fetch(`https://cs326-finalupsilon.herokuapp.com/users/${userId}`);
  let userData = await response.json();
  let feedHtml = '';
  for(let i = 0; i < userData["posts"].length; i++){
    let postElem = document.createElement('li');
    postElem.classList.add('list-group-item');
    postElem.classList.add('userFeed');
    let postHtml = '';
    //postHtml += '<li class="list-group-item userFeed">';
    let postResponse = await fetch(`https://cs326-finalupsilon.herokuapp.com/posts/${userData["posts"][i]}`)
    let post = await postResponse.json();
    if(post["contentType"] === "audio"){
      postHtml += generateMusicCard(post["content"]["albumArt"],post["content"]["songUrl"],post["name"],post["description"],post["tags"]);
    }
    else if(post["contentType"] === "image"){
      postHtml += generateArtCard(post["content"]["imageUrl"],post["name"],post["description"],post["tags"]);
    }
    else{
      console.error("Content type is not audio or image");
    }
    postElem.innerHTML = postHtml;
    generateTags(post['tags'], postElem);
    postElem.getElementsByClassName('deletePost')[0].addEventListener('click', async () =>{
      try {     
        const response = await fetch(`https://cs326-finalupsilon.herokuapp.com/posts/${userData["posts"][i]}/delete`, {
          method: 'post',
          body: {
            // delete post here
          }
        });
      } catch(err) {
        console.error(`Error: ${err}`);
      }    
    });
    postElem.getElementsByClassName('editPost')[0].addEventListener('click', async ()=>{
      try {     
        const response = await fetch(`https://cs326-finalupsilon.herokuapp.com/posts/${userData["posts"][i]}`, {
          method: 'post',
          body: {
            //edit post here
          }
        });
      } catch(err) {
        console.error(`Error: ${err}`);
      }    
    });
    document.getElementById('userFeed').appendChild(postElem);
  };  
}
async function fillInHeader(){
  let userId = window.location.pathname.split('/').slice(-2)[0];//TODO: Better way to fetch
  let response = await fetch(`https://cs326-finalupsilon.herokuapp.com/users/${userId}`);
  let userData = await response.json();
  let avatarDiv = document.getElementById('userAvatar');
  let nameDiv = document.getElementById('name');
  let bioDiv = document.getElementById('bio');
  let yogDiv = document.getElementById('yog');
  
  let avatar = document.createElement('img');
  avatar.src = userData['profile_picture'];
  avatar.classList.add('rounded-circle');
  avatarDiv.appendChild(avatar);

  let name = document.createElement('h2');
  name.innerText = userData['name'];
  nameDiv.appendChild(name);

  let bio = document.createElement('p');
  bio.innerText = userData['biography'];
  bioDiv.appendChild(bio);

  let yog = document.createElement('p');
  yog.innerText = `Class of ${userData['yog']}`;
  yogDiv.appendChild(yog);
}
//Modal event listeners
document.getElementById('newPostForm').addEventListener('shown.bs.modal', function() {
  document.getElementById('newPostTitle').focus();
});
document.getElementById('newPostImageType').addEventListener('click', function() {
  document.getElementById('newPostAudioUrl').disabled = true;
  document.getElementById('newPostImageUrl').required = false;
});
document.getElementById('newPostAudioType').addEventListener('click', function() {
  document.getElementById('newPostAudioUrl').disabled = false;
  document.getElementById('newPostImageUrl').required = true;
});
document.getElementById('newPostTags').addEventListener('keypress', function(e){//When pressing enter, add tag currently typed. Add field to add subtags with similar behavior
  if(e.key === 'Enter'){
    const tagName = document.getElementById('newPostTags').value;
    document.getElementById('newPostTags').value = '';
    const tagElem = document.createElement('li');
    tagElem.classList.add('list-group-item');
    tagElem.innerText = tagName;
    document.getElementById('l1taglist').appendChild(tagElem);
    const div = document.createElement('div');
    div.classList.add('mb-3');
    const label = document.createElement('label');
    label.for = `tagEntry-${tagName}`;
    label.innerText = `Subtags for ${tagName}`;
    const subTagEntry = document.createElement('input');
    const subTagList = document.createElement('ul');
    subTagList.classList.add('list-group');
    subTagList.classList.add('subtag');
    //subTagList.classList.add('l1tags');
    subTagEntry.classList.add('form-control');
    subTagEntry.id = `tagEntry-${tagName}`;
    subTagList.id = `tagList-${tagName}`;
    div.appendChild(label);
    div.appendChild(subTagList);
    div.appendChild(subTagEntry);
    document.getElementById('newPostFormData').appendChild(div);

    subTagEntry.addEventListener('keypress', function(e2){//add subtags to tag list
      if(e2.key === 'Enter'){
        const subTagName = subTagEntry.value;
        subTagEntry.value = '';
        const subTag = document.createElement('li');
        subTag.classList.add('list-group-item');
        subTag.innerText = subTagName;
        subTagList.appendChild(subTag);
      }
    });
  }
});
//Submit new post form data to server
document.getElementById('newPostSubmit').addEventListener('click', async function() {
  let postObj = {};
  postObj['name'] = document.getElementById('newPostTitle').value;
  if(document.getElementById('newPostImageType').checked){
    postObj['contentType'] = 'image';
  }
  else{
    postObj['contentType'] = 'audio';
  }
  postObj['description'] = document.getElementById('newPostDescription').value;
  postObj['tags'] = {'l1tags':[]};
  Array.prototype.forEach.call(document.getElementById('l1taglist').getElementsByTagName('li'), (function(tag){
    postObj['tags']['l1tags'].push(tag.innerText);
    postObj['tags'][tag.innerText] = [];
  }));
  postObj['tags']['l1tags'].forEach(function(tag){
    let subTagList = document.getElementById(`tagList-${tag}`);
    Array.prototype.forEach.call(subTagList.getElementsByTagName('li'), (function(subTag){
      postObj['tags'][tag].push(subTag.innerText);
    }));
  });
  postObj['content'] = {'imageUrl': document.getElementById('newPostImageUrl').value};
  if(postObj['contentType'] === 'audio'){
    postObj['content']['audioUrl'] = document.getElementById('newPostAudioUrl').value;
  }
  postObj['likes'] = 0;
  const username = window.location.pathname.split('/').slice(-2)[0];//TODO: Use session cookie from auth stuff instead
  postObj['owner'] = username;//TODO: dynamically assign owner in a better way
  postObj['pid'] = "";//TODO: dynamically assign pid in server.js
  postObj['timestamp'] = Date.now();

  //POST postObj to /posts/new endpoint
  const res = await fetch("https://cs326-finalupsilon.herokuapp.com/posts/new", {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postObj)
  });
  if(res.status !== 201){
    window.alert(`create post server response: ${res.status} : ${res.body}`);
  }
});

//Edit User Modal Event Listeners
document.getElementById('editUserForm').addEventListener('shown.bs.modal', function() {
  document.getElementById('newProfileName').focus();
});

//Post New User Data
document.getElementById("editUserSubmit").addEventListener("click", async ()=> {
  const userObj = {};
  userObj["name"] = document.getElementById("newProfileName");
  userObj["biography"] = document.getElementById("newBiography");
  userObj["profile_picture"] = document.getElementById("newProfilePicture");
  userObj["yog"] = document.getElementById("newYoG");

  const res = await fetch(`https://cs326-finalupsilon.herokuapp.com/usersUpdate/${window.location.pathname.split('/').slice(-2)[0]}`, {
    method : "POST",
    headers : {
      "Accept" : "application/json",
      "Content-type" : "application/json"
    },
    body : JSON.stringify(userObj)
  });
});
fillInHeader();
generatePosts();