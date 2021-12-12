document.getElementById('loginButton').addEventListener('click', function() {
  const postObj = {};
  postObj['email'] = document.getElementById('floatingInput').value;
  postObj['password'] = document.getElementById('floatingPassword').value;

  fetch('/signin', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postObj),
  }).then(() => {
    window.location.href = '/home';
  });
  // window.location.href = "/home";
});
