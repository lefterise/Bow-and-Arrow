const ButteflyState = {
    Flying: 0,
    Poped: 1,
    Dead: 2,
  };
  
  class Butterfly{
      constructor(x, y, risePixelsPerMs, bubbleSprite, poppedBubbleSprite, butterflySprite){
          this.x = x;
          this.y = y;
          this.risePixelsPerMs = risePixelsPerMs;
          this.previousUpdateTime = -1;
          this.state = ButteflyState.Flying;
          this.bubbleSprite = bubbleSprite;
          this.poppedBubbleSprite = poppedBubbleSprite;
          this.butterflySprite = butterflySprite;
          this.points = 100;          
      }
      
      checkCollisions(arrowManager){
          if (this.state == ButteflyState.Flying && arrowManager.collidesWith(this.x, this.x + 24, this.y + 6, this.y + 30)){
              this.state = ButteflyState.Poped;
              this.previousUpdateTime = -1;
              this.butterflyX = this.x;
              this.butterflyY = this.y;
              score.add(this.points);
          }	
      }
      
      update(time){
          if (this.state == ButteflyState.Flying){
              if (this.previousUpdateTime == -1){
                  this.previousUpdateTime = time;
              }
              var timeSincePrevUpdateMs = time - this.previousUpdateTime;
              this.previousUpdateTime = time;			
              this.y -= timeSincePrevUpdateMs * this.risePixelsPerMs;
              if (this.y < -50) {
                  this.risePixelsPerMs = -Math.abs(this.risePixelsPerMs);
                  this.points = Math.max(this.points - 10, 0);
              }
              if (this.y > 480) {
                  this.risePixelsPerMs = Math.abs(this.risePixelsPerMs);
                  this.points = Math.max(this.points - 10, 0);
              }
          }
          if (this.state == ButteflyState.Poped){
              if (this.previousUpdateTime == -1){
                  this.previousUpdateTime = time;
              }
              var timeSincePrevUpdateMs = time - this.previousUpdateTime;
              this.previousUpdateTime = time;
              var pixelsPerMs = 480 / 3000;
              this.y += timeSincePrevUpdateMs * pixelsPerMs;
              
              this.butterflyY -= timeSincePrevUpdateMs * 480/4000;
              this.butterflyX -= timeSincePrevUpdateMs * 480/4000;
              
              if (this.y > 480 && (this.butterflyY < -20 || this.butterflyX < -20)){
                  this.state = ButteflyState.Dead;
              }
          }
      }
      
      draw(ctx){
          if (this.state == ButteflyState.Flying){
              ctx.drawImage(this.bubbleSprite, this.x, this.y);
          }else{
              ctx.drawImage(this.poppedBubbleSprite, this.x, this.y);
              ctx.drawImage(this.butterflySprite, this.butterflyX, this.butterflyY);	
          }
      }
  }