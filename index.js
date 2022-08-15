var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let words = [];
let players = {};
http.listen(3000, function () {
  console.log('listening on *:3000');
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {
  client.on('addWord', (playerName, currentWordNeeded ,inputWords) => {
    let wordArray = JSON.parse(inputWords);
    let newWords = [];
    let wordNeeded = currentWordNeeded;
    for(let word of wordArray){
      if(words.find(x=>x===word) === undefined){
        newWords.push(word);
        wordNeeded--;
      }
    }
    words = words.concat(newWords);
    client.emit('wordAdded', wordNeeded);
  });
  client.on('readyCheck', (playerName) => {
    players[playerName] = client;
    console.log("Player", playerName, 'is ready.');
  });
  client.on('disconnect', ()=>{
    console.log('player','disconnected');
  })
});