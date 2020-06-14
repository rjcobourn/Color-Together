// server.js

// init project
var express = require("express");
var app = express();
var server = app.listen(process.env.PORT || 25565);
var socket = require("socket.io");
var io = socket(server);
var clientColors = {};

console.log("STARTING");

io.on("connection", newConnection);

function newConnection(socket) {
  console.log("new connection: " + socket.id);
  clientColors[socket.id] = {};
  clientColors[socket.id].r = Math.random()*255;
  clientColors[socket.id].g = Math.random()*255;
  clientColors[socket.id].b = Math.random()*255;

  socket.on("mouse", mouseMsg);

  function mouseMsg(data) {
    let position = data;
    let color = clientColors[socket.id];
    console.log("broadcasting data: " + data);

    socket.broadcast.emit("mouse", {position, color});
  }
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});
