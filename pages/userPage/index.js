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
      console.error("Contenty type is not audio or image");
    }
    postElem.innerHTML = postHtml;
    generateTags(post['tags'], postElem);
    document.getElementById('userFeed').appendChild(postElem);
  };  
}
generatePosts();
