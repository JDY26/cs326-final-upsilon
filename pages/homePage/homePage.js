document.getElementById("popular").addEventListener("click", () => {
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

window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const navbar = document.getElementsByClassName("navbar")[0];
    const lastScrollTop = 0;
    if(scrollTop > lastScrollTop){
        navbar.style.top="-80px";
    } else {
        navbar.style.top="0";
    }
    lastScrollTop = scrollTop;
});