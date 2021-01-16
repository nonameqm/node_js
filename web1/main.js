var http = require("http");
var fs = require("fs");
var url = require("url"); //url 모듈
var qs = require('querystring');

var template={
  html: function(title, list, body, control) {
    return `
      <!doctype html>
      <html>
      <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
      </head>
      <body>
      <h1><a href="/">WEB1</a></h1>
      ${list}
      ${control}
      ${body}
      </body>
      </html>
    `;
  },

  list: function(filelist) {
    var list = "<ul>";
    var i = 0;
    while (i < filelist.length) {
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + "</ul>";
    return list;
  }
}



var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (errpr, filelist) {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = template.list(filelist);
        var html = template.html(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a> `
        );
        response.writeHead(200); //웹서버가 브라우저에게 200이라는 숫자 전송 시 성공
        response.end(html);
      });
    } else {
      fs.readdir("./data", function (errpr, filelist) {
        var list = "<ul>";
        var list = template.list(filelist);
        fs.readFile(
          `./data/${queryData.id}`,
          "utf-8",
          function (err, description) {
            var title = queryData.id;
            var html = template.html(
              title,
              list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
               <a href="/update?id=${title}">update</a>
               <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
               </form>
               `
            );
            response.writeHead(200); //웹서버가 브라우저에게 200이라는 숫자 전송 시 성공
            response.end(html);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (errpr, filelist) {
      var title = "Web - create";
      var list = template.list(filelist);
      var html = template.html(
        title,
        list,
        `
        <form action="http://localhost:3000/create_process" method="post">
          <!-- action string의 서버로 해당 정보를 보냄 -->
          <p><input type="text" name="title" placeholder="title" /></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
        `,
        ''
      );
      response.writeHead(200); //웹서버가 브라우저에게 200이라는 숫자 전송 시 성공
      response.end(html);
    });
  } else if(pathname=='/create_process'){
      var body='';
      //data를 나눠서 수신함
      request.on('data', function(data){
        body=body+data;
      });
      //data 수신이 끝났을 때 
      request.on('end', function(){
        var post=qs.parse(body);
        var title=post.title;
        var description=post.description;
        fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
      
  } else if(pathname === '/update'){
    fs.readdir("./data", function (errpr, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.html(
          title,
          list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <!-- action string의 서버로 해당 정보를 보냄 -->
            <p><input type="text" name="title" placeholder="title" value="${title}" /></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>
          `,
          `<a href="/create">create</a> `
        );
        response.writeHead(200); //웹서버가 브라우저에게 200이라는 숫자 전송 시 성공
        response.end(html);
      })
    });    
  } else if(pathname === '/update_process'){
    var body='';
    //data를 나눠서 수신함
    request.on('data', function(data){
      body=body+data;
    });
    //data 수신이 끝났을 때 
    request.on('end', function(){
      var post=qs.parse(body);
      var title=post.title;
      var id=post.id;
      var description=post.description;
      fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    })
  } else if(pathname === '/delete_process'){
    var body='';
    //data를 나눠서 수신함
    request.on('data', function(data){
      body=body+data;
    });
    //data 수신이 끝났을 때 
    request.on('end', function(){
      var post=qs.parse(body);
      var id=post.id;
      console.log(id);
      fs.unlink(`data/${id}`, function(error){
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    })
  } else {
    response.writeHead(404); // 404라는 숫자 전송 시 실패임
    response.end("Not Found");
  }
});
app.listen(3000);
