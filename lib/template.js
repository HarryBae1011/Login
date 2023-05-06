module.exports = {
    HTML:function(body, authStatusUI = `<a href="/auth/login">login</a>`){
      return `
      <!doctype html>
      <html>
      <body>
        ${authStatusUI}
        ${body}
      </body>
      </html>
      `;
    }
  }