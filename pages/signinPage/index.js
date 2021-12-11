document.getElementById('loginButton').addEventListener('click', async function() {
    let postObj = {};
    postObj['email'] = document.getElementById('floatingInput').value;
    postObj['password'] = document.getElementById('floatingPassword').value;

    const res = await fetch("/signin", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postObj)
      });
    if(res.status === 201) {
        window.location.href = '/home';
    }
    else{
        alert("Error creating user");
    }
});