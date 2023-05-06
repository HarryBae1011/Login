var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

router.get('/login', (request, response) => {
  var html = template.HTML(
    `<h1>Login</h1>
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="id" placeholder="id"></p>
      <p><input type="password" name="password" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>`);
  response.send(html);
});

router.get('/logout', (request, response) => {
  request.logout(function(err){
    if (err) {
      return next(err);
    }
  });
  request.session.save(function(err){
    response.redirect('/');
  });
});

module.exports = router;

