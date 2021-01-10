var testFolder='./data';
var fs=require('fs');

fs.readdir(testFolder, function(err, filelist){
    console.log(filelist) //file의 목록을 배열로 리턴한다.
})