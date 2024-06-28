class BlackArcher{
    constructor(sprites, animationChangeCallback, archer, arrowManager){	
        this.sprites = sprites;
        this.x = 500;
        this.y = 200;
        this.frameDurations = [600,300,200,2000];
        this.frame = 0;
        this.animationChangeCallback = animationChangeCallback;
        this.gameIsLost = false;
        this.collisionRect = {left: 70, right: 119, top: 22, bottom: 114};
        this.archer = archer;
        this.arrowManager = arrowManager;
        this.waistY = 70;
        this.isDead = false;
    }

    update(time){        
        if (!this.prevTime){
            this.prevTime = time;
        }
        
        let dt = time - this.prevTime;
        
        this.prevTime = time;

        if (this.frame != 3){
            const wiggleRoom = 10;

            let dy = 0;
            if (this.y < this.archer.y){
                dy = 0.1;
            }

            if (this.y > this.archer.y){
                dy = -0.1;
            }

            let playerArrows = this.arrowManager.arrows.filter((arrow)=>arrow.dx > 0).sort((a,b)=>b.x - a.x);                        
            for (let arrow of playerArrows){
                if (arrow.y > this.y + this.collisionRect.top - wiggleRoom && arrow.y < this.y + this.collisionRect.bottom + wiggleRoom){
                    if (arrow.y > this.y + this.waistY){
                        dy = -0.1;
                        break;
                    }
                    if (arrow.y < this.y + this.waistY){
                        dy = +0.1;
                        break;
                    }
                }
            }
  

            this.y += dy * dt;
        }

        if (!this.frameStartTime){
            this.frameStartTime = time;
        }

        if (time - this.frameStartTime >= this.frameDurations[this.frame]){
            if (this.frame == 3){
                this.isDead = true;
                return;
            }
            this.frame = (this.frame + 1) % 3;
            this.frameStartTime = time;
            if (this.animationChangeCallback){
                this.animationChangeCallback(this.frame);
            }
        }
    }

    draw(ctx){
        ctx.drawImage(this.sprites[this.frame], this.x, this.y);
    }

    getCollidingArrow(arrowManager){
		return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
}

class BlackArcherLevel{
    constructor(sprites, archer, arrowManager){	
		this.archer = archer;
		this.arrowManager = arrowManager;
        this.blackArcher = new BlackArcher(sprites, (frame)=>{
            if (frame == 2){                
                let arrow = new Arrow(this.blackArcher.x, this.blackArcher.y + 51, -640 / 2000, 0);
                this.arrowManager.arrows.push(arrow);
            }
        }, archer, arrowManager);
		
	}
	
	update(time){
        if (this.gameIsLost || this.levelCompleted) {
			this.timeSpentFrozen = time - this.timeOfLevelFreeze;
			return;			
		}

		this.archer.update(time);		
		this.arrowManager.update(time);
		this.blackArcher.update(time);

        if (this.archer.collidesWithArrow(this.arrowManager)){
			this.gameIsLost = true;
			this.timeOfLevelFreeze = time;
		}

        if (this.blackArcher.getCollidingArrow(this.arrowManager)){
            this.blackArcher.frame = 3;
        }
	}
	
	
	draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
        this.blackArcher.draw(ctx);
	}
	
	isComplete(){
		return this.blackArcher.isDead;
	}
	
	isLost(){
		return this.gameIsLost && this.timeSpentFrozen > 1000;
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