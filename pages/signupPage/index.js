document.getElementById('submitRegistration').addEventListener('click', async function() {
  const postObj = {};
  const email = document.getElementById('floatingInput').value;
  postObj['email'] = email;
  postObj['username'] = document.getElementById('floatingUsername').value;
  postObj['password'] = document.getElementById('floatingPassword').value;
  if (document.getElementById('floatingRepeat').value !== postObj['password']) {
    alert('Passwords do not match');
    return;
  }
  if (email.slice(-9).toLowerCase() !== 'umass.edu') {
    alert('Email must be a umass.edu email');
    return;
  }

  const res = await fetch('/api/users/new', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postObj),
  });
  if (res.status === 201) {
    window.location.href = '/login';
  } else {
    alert('Error creating user');
  }
});
