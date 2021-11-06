let musicCard = `
                <div class="card mb-3 userPost">
                    <div class="row">
                      <div class="col-md-2 albumcover">
                        <img src="./examplealbumcover.jpeg" class="img-fluid rounded-start" alt="...">
                      </div>
                      <div class="col-md-8">
                          <h2 class="postTitle">Song Title</h2>
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
                              This is a description about the song
                            </p>
                          </div>
                      </div>
                      <div class="col-md-2">
                        <div class="card-body">
                          <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex userPost">
                              <div class="row">
                                <div class="col-md-4">
                                  <span class="badge rounded-pill bg-secondary">Music</span>
                                </div>
                                <div class="col-md-4">
                                  <br>
                                  <span class="badge rounded-pill bg-secondary">Indie</span>
                                  <br>
                                  <span class="badge rounded-pill bg-secondary">Folk</span>
                                </div>
                              </div>
                            </li>
                            <li class="list-group-item d-flex userPost">
                              <div class="row">
                                <div class="col-md-4">
                                  <span class="badge rounded-pill bg-secondary">Sad</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
`
let artCard = `
<div class="card-mb-3 userPost">
                <div class="row">
                  <div class="col-md-6 artImage">
                    <img src="./exampleart.jpeg" class="img-fluid rounded-start" alt="...">
                  </div>
                  <div class="col-md-4">
                    <div class="card-body">
                      <h2 class="card-text d-flex postTitle">
                        Name of artwork
                      </h2>
                      <p class="card-text d-flex postDescription">
                        This is a description about the artwork
                      </p>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="card-body">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex userPost">
                          <div class="row">
                            <div class="col-md-4">
                              <span class="badge rounded-pill bg-secondary">Art</span>
                            </div>
                            <div class="col-md-4">
                              <br>
                              <span class="badge rounded-pill bg-secondary">Digital</span>
                              <br>
                              <br>
                              <span class="badge rounded-pill bg-secondary">Abstract</span>
                              <span class="badge rounded-pill bg-secondary">Colorful</span>
                            </div>
                            <div class="col-md-4">
                              <br>
                              <br>
                              <span class="badge rounded-pill bg-secondary">Render</span>
                            </div>
                          </div>
                        </li>
                        <li class="list-group-item d-flex userPost">
                          <div class="row">
                            <div class="col-md-4">
                              <span class="badge rounded-pill bg-secondary">Seasonal</span>
                            </div>
                            <div class="col-md-4">
                              <br>
                              <span class="badge rounded-pill bg-secondary">Fall</span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
`
let innerhtml = `
        <ul class="list-group list-group-flush">
            <li class="list-group-item userFeed">
                ${musicCard}
            </li>
            <li class="list-group-item userFeed">
              ${artCard}
            </li>
          </ul>
          `

document.getElementById('userFeed').innerHTML = innerhtml;