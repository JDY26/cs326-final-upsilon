/*const popular = document.getElementsByClassName("popular")

for(button of popular){
    button.addEventListener("click", () => {
        const art = document.getElementById("card-wrapper");
        const children = art.children;
        const newCards = document.createDocumentFragment();
        const arr = [1, 2, 0];
    
        arr.forEach((index) => {
            newCards.appendChild(children[index].cloneNode(true));
        });
    
        art.innerHTML = null;
        art.appendChild(newCards);
    });
}*/

document.getElementById("search").addEventListener("click", () => {
    const searched = document.getElementById("searchField").value;
    window.location.href = `https://cs326-finalupsilon.herokuapp.com/userPages/${searched}`;
});

window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const navbar = document.getElementsByClassName("navbar")[0];
    let lastScrollTop = 0;
    if(scrollTop > lastScrollTop){
        navbar.style.top="-80px";
    } else {
        navbar.style.top="0";
    }
    lastScrollTop = scrollTop;
});

//render a single post
//Take the div surrounding all of the cards
//Make a card
//Fetch img, name, user, likes, timestamp
//Append it to the parent with an id
//Initially Sort By Popular
//Store number of likes

async function makeCard(id, pid){
    const response = await fetch(`https://cs326-finalupsilon.herokuapp.com/posts/${pid}`);
    const json = await response.json();

    const row = document.getElementById(id);
    const card = document.createElement("div");
    card.classList.add("card", "col-3", "site-element");
    const img = document.createElement("img");
    img.src = json["content"]["imageUrl"];//modified to fit API Schema
    img.classList.add("card-img-top", "center-img");
    card.appendChild(img);
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title", "text-center", "display-6");
    cardTitle.textContent = json["name"];
    card.appendChild(cardTitle);
    const cardSubtitle = document.createElement("a");
    cardSubtitle.classList.add("card-subtitle", "text-muted", "text-center", "card-link");
    cardSubtitle.href = `https://cs326-finalupsilon.herokuapp.com/userPages/${json['owner']}`;
    cardSubtitle.textContent = json["owner"];
    card.appendChild(cardSubtitle);
    const timestamp = document.createElement("p");
    timestamp.classList.add("card-subtitle", "text-muted", "text-center");
    timestamp.textContent = json["timestamp"].split(" ")[1];
    card.appendChild(timestamp);
    const like = document.createElement("button");
    like.classList.add("btn", "btn-outline-light", "btn-sm", "like-button");
    like.textContent = "Like";
    like.addEventListener("click", async () => {
        await fetch(`https://cs326-finalupsilon.herokuapp.com/like/${pid}`);
    });
    card.appendChild(like);
    row.appendChild(card);
}

makeCard("music", "000001").then();
makeCard("music", "000001").then();
makeCard("music", "000001").then();
makeCard("art", "000001").then();
makeCard("art", "000001").then();
makeCard("art", "000001").then();