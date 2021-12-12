document.getElementById('loginButton').addEventListener('click', function() {
    let postObj = {};
    postObj['email'] = document.getElementById('floatingInput').value;
    postObj['password'] = document.getElementById('floatingPassword').value;

    const res = fetch("/signin", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postObj)
      });
    window.location.href = "/home";
});