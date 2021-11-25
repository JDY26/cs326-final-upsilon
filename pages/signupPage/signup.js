import { createUser } from './server.js';

document.getElementById('submitButton').addEventListener('click', () => {
    console.log("here");
    const userInfo = {
        profile_picture: "",
        name: "",
        biography: "",
        posts: [],
        username: document.getElementById('floatingInput').value,
        yog: -1
    };
    createUser(userInfo);
});