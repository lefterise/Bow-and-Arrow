const BaloonState = {
    Flying: 0,
    Poped: 1,
    Dead: 2,
  };
  
  class Baloon{
      constructor(x, y, risePixelsPerMs, baloonSprite, poppedBaloonSprite, type){
          this.x = x;
          this.y = y;
          this.risePixelsPerMs = risePixelsPerMs;
          this.previousUpdateTime = -1;
          this.state = BaloonState.Flying;
          this.baloonSprite = baloonSprite;
          this.poppedBaloonSprite = poppedBaloonSprite;
          this.type = type;
      }
      
      checkCollisions(arrowManager){
          if (this.state == BaloonState.Flying && arrowManager.collidesWith(this.x, this.x + 24, this.y + 6, this.y + 30)){
              this.state = BaloonState.Poped;
              this.previousUpdateTime = -1;
          }	
      }
      
      update(time){
          if (this.state == BaloonState.Flying){
              if (this.previousUpdateTime == -1){
                  this.previousUpdateTime = time;
              }
              var timeSincePrevUpdateMs = time - this.previousUpdateTime;
              this.previousUpdateTime = time;			
              this.y = this.y - timeSincePrevUpdateMs * this.risePixelsPerMs;
              if (this.y < -50) {
                  this.y = 480;
              }
          }
          if (this.state == BaloonState.Poped){
              if (this.previousUpdateTime == -1){
                  this.previousUpdateTime = time;
              }
              var timeSincePrevUpdateMs = time - this.previousUpdateTime;
              this.previousUpdateTime = time;
              var pixelsPerMs = 480 / 3000;
              this.y = this.y + timeSincePrevUpdateMs * pixelsPerMs;
              if (this.y > 480){
                  this.state = BaloonState.Dead;
              }
          }
      }
      
      draw(ctx){
          ctx.drawImage(this.state == BaloonState.Flying ? this.baloonSprite : this.poppedBaloonSprite, this.x, this.y);
      }
  }