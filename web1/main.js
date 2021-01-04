var http = require('http');
var fs = require('fs');
var url = require('url'); //url 모듈 

function templateHTML(title, list, body){
  return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
    </body>
    </html>
  `;
}

function templateList(filelist){
  var list='<ul>';
  var i=0;
  while(i<filelist.length){
    list=list+ `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i=i+1;
  }
  list=list+'</ul>'
  return list;
}



var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

   
    if(pathname === '/'){
      if(queryData.id===undefined){
        fs.readdir('./data', function(errpr, filelist){
          var title='Welcome';
          var description='Hello, Node.js';
          var list=templateList(filelist);
          var template=templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200); //웹서버가 브라우저에게 200이라는 숫자 전송 시 성공
          response.end(template);
        })          
      }
      else{
        fs.readdir('./data', function(errpr, filelist){
          var title='Welcome';
          var description='Hello, Node.js';
          var list='<ul>';
          var list=templateList(filelist);
          fs.readFile(`./data/${queryData.id}`, 'utf-8', function(err, description){
            var title=queryData.id;
            var template=templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200); //웹서버가 브라우저에게 200이라는 숫자 전송 시 성공
            response.end(template);
          });
       });
      }
    }
    else{
      response.writeHead(404); // 404라는 숫자 전송 시 실패임
      response.end('Not Found'); 
    }

 
});
app.listen(3000);