  class YellowBaloonLevel{
      constructor(redbaloonSprite, poppedRedBaloonSprite, yellowBaloonSprite, poppedYellowBaloonSprite, archer, arrowManager){	
          this.arrowManager = arrowManager;
          this.archer = archer;
          this.baloons = [];
          for (let i = 0; i < 15; ++i){
              if (i % 4 == 0){
                  this.baloons.push(new Baloon(250 + i * 26, 480, 480 / (5000 - Math.random() * 1000), yellowBaloonSprite, poppedYellowBaloonSprite, BaloonType.Yellow))
              }else {
                  this.baloons.push(new Baloon(250 + i * 26, 480, 480 / (5000 - Math.random() * 1000), redbaloonSprite, poppedRedBaloonSprite, BaloonType.Red))
              }
          }
      }
      
      update(time){
          this.archer.update(time);		
          this.arrowManager.update(time);
      
          for (let baloon of this.baloons){
              baloon.update(time);
              baloon.checkCollisions(this.arrowManager);
          }
      
          this.baloons = this.baloons.filter((baloon) => baloon.state != BaloonState.Dead);
      }
      
      
      draw(ctx){
          for (let baloon of this.baloons){
              baloon.draw(ctx);
          }
          this.archer.draw(ctx);
          this.arrowManager.draw(ctx);
      }
      
      isComplete(){
          return this.baloons.filter((baloon) => baloon.type == BaloonType.Red).length == 0;
      }
      
      isLost(){
          return false;
      }
      
      mousemove(x, y){
          this.archer.move(y);		
      }
      
      mousedown(button){
          if (button == 0){
              this.archer.pull();
          } else if (button == 2){
              this.archer.load();
          }
      }
      
      mouseup(button){
          if (button == 0){
              this.archer.release();
          }		
      }
      
      touchmove(x, y){
          this.archer.move(y);
          if ( x - this.touchStartLoc.x < -30){
              this.archer.stretchFull();
          } else if ( x - this.touchStartLoc.x < -15){
              this.archer.stretchALittle();
          } else{
              this.archer.relax();
          }
  
      }
      
      touchstart(x, y){
          this.touchStartLoc = {x: x, y: y};
          this.archer.load();
      }
      
      touchend(x, y){
          this.archer.release();
      }
  }