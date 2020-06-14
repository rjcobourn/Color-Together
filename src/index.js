require("./styles.css");
//hehe haha testing
let sketch = function(p) {
  var socket = io.connect('http://70.163.134.193:25565');
  var cnv = p.createCanvas(GAME_WIDTH, GAME_HEIGHT);
  const GAME_WIDTH = 1920;
  const GAME_HEIGHT = 1080;
  const canvasRatio = GAME_WIDTH / GAME_HEIGHT;
  let mouseSize = 32;

  p.setup = function() {
    p.windowResized();
    socket.on("mouse", p.newDrawing);
  };

  p.draw = function() {
    if(p.keyIsDown(189) && mouseSize > 5) {
      mouseSize--;
    }
    if(p.keyIsDown(187) && mouseSize <= 50) {
      mouseSize++;
    }
  };

  p.newDrawing = function(data) {
    p.push();
    p.scale(p.width / GAME_WIDTH);
    p.noStroke();
    p.fill(data.color.r, data.color.g, data.color.b);
    p.ellipse(data.position.x, data.position.y,
              data.position.size/data.position.scale, data.position.size/data.position.scale);
    p.pop();
  };

  p.mouseDragged = function() {
    console.log(`sending: ${p.mouseX}, ${p.mouseY}`);
    var data = {
      x: p.mouseX/(p.width/GAME_WIDTH),
      y: p.mouseY/(p.width/GAME_WIDTH),
      size: mouseSize,
      scale: (p.width / GAME_WIDTH)
    };
    socket.emit("mouse", data);

    p.push();
    p.noStroke();
    p.fill(255);
    p.ellipse(p.mouseX, p.mouseY, mouseSize, mouseSize);
    p.scale(p.width / GAME_WIDTH);
    p.pop();
  };

  //window resize handling
  p.windowResized = function() {
    let newWidth = p.windowWidth;
    let newHeight = p.windowHeight;
    let newRatio = newWidth / newHeight;

    if (newRatio >= canvasRatio) {
      //Width is bigger than wanted
      newWidth = newHeight * canvasRatio;
      p.resizeCanvas(newWidth, newHeight);
    } else if (newRatio < canvasRatio) {
      //Height is bigger than wanted
      newHeight = newWidth / canvasRatio;
      p.resizeCanvas(newWidth, newHeight);
    }
    var xPos = (p.windowWidth - newWidth) / 2;
    var yPos = (p.windowHeight - newHeight) / 2;
    cnv.position(xPos, yPos);
    p.background(200);
  };
};

let myp5 = new p5(sketch);
