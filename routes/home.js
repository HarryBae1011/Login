var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');   

router.get('/', function(request,response){
    var homepage = template.HTML(
    `<h1>Homepage</h1>`,
    auth.StatusUI(request, response) 
    );
    response.send(homepage);
});

module.exports = router;