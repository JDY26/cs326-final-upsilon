const popular = document.getElementsByClassName("popular");

for(const button of popular){
    button.addEventListener("click", async () => {
        if(button.classList.contains("audio")){
            const response = JSON.parse(await (await fetch("/api/popular/audio")).json);
            for(const post of response){
                await makeCard("music", post["pid"]);
            }
        } else {
            const response = await (await fetch("/api/popular/image")).json();
            console.log(response);
            const json = JSON.parse(response);
            await makeCard("art", json["pid"]);
            /*for(const post in response){
                await makeCard("art", post["pid"]);
            }*/
        }
    });
}



document.getElementById("search").addEventListener("click", () => {
    const searched = document.getElementById("searchField").value;
    window.location.href = `/api/userPages/${searched}`;
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

async function makeCard(id, pid){
    const response = await fetch(`/api/posts/${pid}`);
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
    cardSubtitle.href = `/api/userPages/${json['owner']}`;
    cardSubtitle.textContent = json["owner"];
    card.appendChild(cardSubtitle);
    const timestamp = document.createElement("p");
    timestamp.classList.add("card-subtitle", "text-muted", "text-center");
    timestamp.textContent = json["timestamp"];
    card.appendChild(timestamp);
    const like = document.createElement("button");
    like.classList.add("btn", "btn-outline-light", "btn-sm", "like-button");
    like.textContent = "Like";
    like.addEventListener("click", async () => {
        await fetch(`/api/like/${pid}`);
    });
    card.appendChild(like);
    row.appendChild(card);
}