var fs=require('fs');


//readFileSync
// console.log('A');
// var result=fs.readFileSync('nodejs/sample.txt', 'utf-8');
// console.log(result);
// console.log('C');

//async
console.log('A');
fs.readFile('nodejs/sample.txt', 'utf-8', function(err, result){
    console.log(result)
});
    //error가 있으면 정보를 err에 집어 넣고, result에는 파일을 읽은 결과가 들어감
console.log('C');
