      var canvas = document.getElementById("theCanvas");
      var ct = canvas.getContext("2d");
      var csizeheight = canvas.height / 320
      var csizewidth = canvas.width / 480
      var dx = 5
      var dy = -5
      var min = canvas.height/2
      var max = canvas.height
      var x = Math.floor((Math.random() * canvas.width) + 1);
      var y = Math.floor((Math.random() * (max - min)) + min);
      var ballRadius = 10*csizeheight
      var paddleHeight = 10*csizeheight
      var paddleWidth = 75*csizewidth
      var paddleX = (canvas.width-paddleWidth)/2;
      var rightKey = false
      var leftKey = false

      var rowCount = 5
      var columnCount = 3
      var bWidth = 75*csizewidth
      var bHeight = 20*csizeheight
      var bPadding = 10*csizewidth
      var bOffsetTop = 30*csizeheight
      var bOffsetLeft = 30*csizewidth
      var bricks = []
      var score = 0
      var normalized;
      var hand;


      var bricks = [];
      for(c=0; c<columnCount; c++) {
          bricks[c] = [];
          for(r=0; r<rowCount; r++) {
              bricks[c][r] = { x: 0, y: 0, status: 1 };
          }
      }

      document.addEventListener('touchmove', ontouchmove, false)
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);
      document.addEventListener("click", clickHandler, false);
                function clickHandler (e){
                  var clickX = e.clientX - stage.OffsetLeft + document.documentElement.scrollLeft;
                  var clickY = e.clientY - stage.OffsetTop + document.documentElement.scrollTop
                  console.log( clickY + clickX)
                }
      function keyDownHandler(e) {
          if(e.keyCode == 39) {
              rightKey = true;
          }
          else if(e.keyCode == 37) {
              leftKey = true;
          }
      }
      function keyUpHandler(e) {
          if(e.keyCode == 39) {
              rightKey = false;
          }
          else if(e.keyCode == 37) {
              leftKey = false;
          }
      }
      function ontouchmove(e){
        var touchobj = e.changedTouches[0] 
        var area = window.innerWidth/2
        var area2 = canvas.width / window.innerWidth
        var dist = parseInt(touchobj.clientX) * area2
        if (dist < area && paddleX < canvas.width-paddleWidth){
          paddleX = dist - 150
        }else if(dist > area && paddleX > 0)
          paddleX = dist - 150
        if (paddleX == 0) {
          paddleX += 1
        }else if (paddleX == canvas.width-paddleWidth){
          paddleX -= 1
        }
        
      }
      function collisionDetection() {
          for(c=0; c<columnCount; c++) {
              for(r=0; r<rowCount; r++) {
                  var b = bricks[c][r];
                  if(b.status == 1) {
                      if(x > b.x && x < b.x+bWidth && y > b.y && y < b.y+bHeight) {
                          dy = -dy;
                          b.status = 0;
                          score++;
                          if(score == rowCount*columnCount) {
                                ct.font = "15vh Arial";
                                ct.fillStyle = "#FFFFFF";
                                ct.fillText("Congrats You Win!!!", 300, 540);
                                document.location.reload();
                          }
                      }
                  }
              }
          }
      }

      function drawBall() {
          ct.beginPath();
          ct.arc(x, y, ballRadius, 0, Math.PI*2);
          ct.fillStyle = "#F8C957";
          ct.fill();
          ct.closePath();
      }
      function drawPaddle() {
          ct.beginPath();
          ct.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
          ct.fillStyle = "#ECF0F1";
          ct.fill();
          ct.closePath();
      }
      function drawBricks() {
          for(c=0; c<columnCount; c++) {
              for(r=0; r<rowCount; r++) {
                  if(bricks[c][r].status == 1) {
                      var brickX = (r*(bWidth+bPadding))+bOffsetLeft;
                      var brickY = (c*(bHeight+bPadding))+bOffsetTop;
                      bricks[c][r].x = brickX;
                      bricks[c][r].y = brickY;
                      ct.beginPath();
                      ct.rect(brickX, brickY, bWidth, bHeight);
                      ct.fillStyle = "#3498DB";
                      ct.fill();
                      ct.closePath();
                  }
              }
          }
      }
      function drawScore() {
          ct.font = "4vw Arial";
          ct.fillStyle = "#F8C957";
          ct.fillText("Score: "+score, 50, 60);
      }

      function draw() {

          ct.clearRect(0, 0, canvas.width, canvas.height);
          drawBricks();
          drawBall();
          drawPaddle();
          drawScore();
          collisionDetection();
          
          if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
              dx = -dx;
          }
          if(y + dy < ballRadius) {
              dy = -dy;
          }
          else if(y + dy > canvas.height-ballRadius) {
              if(x > paddleX && x < paddleX + paddleWidth) {
                  dy = -dy - 1;
                  dx = dx + 1
              }
              else {
                var redow = 200
                var redoh = 100
                var posW = (canvas.width - redow)/2
                var posH = canvas.height - 400
                ct.font = "15vh Arial";
                ct.fillStyle = "#FFFFFF";
                ct.fillText("Game Over", 540, 540);
                ct.font = "75px Arial";
                ct.fillStyle = "#00000";
                ct.fillText("Redo", posW+10, posH+60); 
                ct.beginPath();
                ct.rect( posW, posH, redow, redoh);
                ct.fillStyle = "rgba(52, 73, 94, 0)";
                ct.fill();
                ct.closePath(); 

              }
          }
          if(rightKey && paddleX < canvas.width-paddleWidth) {
              paddleX += 7;
          }
          else if(leftKey && paddleX > 0) {
              paddleX -= 7;
          }
          

          x += dx;
          y += dy;
        Leap.loop({enableGestures: true}, function(frame) {

          frame.pointables.forEach(function(pointable) {
          var position = pointable.stabilizedTipPosition;
          normalized = frame.interactionBox.normalizePoint(position);
          hand = frame.hands.length
          if (paddleX <canvas.width-paddleWidth && paddleX > 0 && hand >0){
            paddleX += normalized[0]/35
          }else if (paddleX <= 0){
            paddleX +=1
          }else{
            paddleX -=1
          
          }
          });
       });

      }

      setInterval(draw, 10);