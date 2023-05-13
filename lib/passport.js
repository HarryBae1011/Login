module.exports = function(app){
  /*var authData = {
    id:'harry06',
    password:'1111',
    nickname:'harry'
  };*/
  var db = require('../db');
  var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function(user, done) {
  done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
  //done(null, authData);
  var userinfo;
    var sql = 'SELECT * FROM login WHERE id=?';
    db.query(sql , [id], function (err, result) {
      if(err) console.log('mysql 에러');     
     
      console.log("deserializeUser mysql result : " , result);
      var json = JSON.stringify(result[0]);
      userinfo = JSON.parse(json);
      done(null, userinfo);
    })    
  });
  
  passport.use(new LocalStrategy(
  {
  usernameField: 'id',
  passwordField: 'password' 
  },
  function(username, password, done) {
  var sql = 'SELECT * FROM login WHERE id=? AND password=?';
    db.query(sql , [username, password], function (err, result) {
      if(err) console.log('mysql 에러');  

      // 입력받은 ID와 비밀번호에 일치하는 회원정보가 없는 경우   
      if(result.length == 0){
        console.log("결과 없음");
        return done(null, false, { message: 'Incorrect' });
      }else{
        console.log(result);
        var json = JSON.stringify(result[0]);
        var userinfo = JSON.parse(json);
        console.log("userinfo " + userinfo);
        return done(null, userinfo);  // result값으로 받아진 회원정보를 return해줌
      }
    });

  /*if(username == authData.id){
    if(password == authData.password){
      return done(null, authData);
    } else{
      return done(null, false, {
        message: 'Incorrect password.'
      });
    }
    } else{
      return done(null, false, {
        message: 'Incorrect name.'
      });
    }*/
  }
  ));
  return passport;
}