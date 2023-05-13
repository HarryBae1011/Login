var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var db = require('../db.js');

module.exports = function(passport){
  router.get('/login', (request, response) => {
    var html = template.HTML(
      `<!DOCTYPE html>
  <head>
    <link rel="stylesheet" href="/CSS/login.css"/>
    <title>Cloud Container - login</title>
  </head>
  <body>
    <div class="outline">
      <div class="mainlogo">
        <div class="logowrapper">
          <img src="/CSS/logo1.png" width="192" height="108" />
        </div>
        <div class="main">
          <h1 class="logo">Login</h1>
          <div class="container">
          <form action="/auth/login_process" method="post">
            <input type="text" placeholder="ID" name="id" class="account" />
            <input type="password" placeholder="Password" name="password" class="account" />
            <button type="submit" id="login" class="account" value="login">login</button>
            </form>
          </div>
          <a href="/auth/register" class="signup">sign up</a>
        </div>
      </div>
    </div>
  </body>`, ''
  
      /*`<h1>Login</h1>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="id" placeholder="id"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>`*/);
    response.send(html);
  });
  
  router.post('/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));
  
  router.get('/register', (request, response) => {
    var html = template.HTML(
      `<h1>Register</h1>
      <form action="/auth/register_process" method="post">
        <p><input type="text" name="id" placeholder="id"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="password" name="password2" placeholder="password double check"></p>
        <p>
          <input type="submit" value="register">
        </p>
      </form>`, '');
    response.send(html);
  });
  
  router.post('/register_process', (request, response) => {
    var post = request.body;
    var id = post.id;
    var password = post.password;
    var password2 = post.password2;
    if (id && password && password2) {
      db.query('SELECT * FROM login WHERE id = ?', [id], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
          if (error) throw error;
          if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
              db.query('INSERT INTO login (id, password) VALUES(?,?)', [id, password], function (error, data) {
                  if (error) throw error2;
                  response.send(`<script type="text/javascript">alert("회원가입 완료!");
                  document.location.href="/";</script>`);
              });
          } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
              response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
              document.location.href="/auth/register";</script>`);    
          }
          else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
              response.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
              document.location.href="/auth/register";</script>`);    
          }            
      });
  
  } else {        // 입력되지 않은 정보가 있는 경우
      response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
      document.location.href="/auth/register";</script>`);
    }
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
  return router;
}
