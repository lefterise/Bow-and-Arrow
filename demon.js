class Demon{
    constructor(x, y, sprites, animationChangeCallback){	
        this.x = x;
        this.y = y;
        this.sprites = sprites;
        this.frame = 0;
  
        this.dy = -0.05;
        this.dx = -0.07;

        this.eyeRect = {left: 17, right: 25, top: 17, bottom: 25};
        this.collisionRect = {left: 0, right: 118, top: 8, bottom: 66};

        this.frameDurations = [1500,500,500,2000];
        this.animationChangeCallback = animationChangeCallback;
    }
    
    update(time){
        if (!this.prevTime){
            this.prevTime = time;
        }
        
        let dt = time - this.prevTime;
        
        this.prevTime = time;

        this.y += this.dy * dt;
        this.x += this.dx * dt;

        if (this.y >= 480 - this.collisionRect.bottom || this.y <= -this.collisionRect.top){
            this.dy *= -1;
        }

        if (this.x >= 640 - this.collisionRect.right || this.x <= -this.collisionRect.left){
            this.dx *= -1;
        }

        if (!this.frameStartTime){
            this.frameStartTime = time;
        }

        if (time - this.frameStartTime >= this.frameDurations[this.frame]){
            this.frame = (this.frame + 1) % 3;
            this.frameStartTime = time;
            if (this.animationChangeCallback){
                this.animationChangeCallback(this.frame);
            }
        }
    }

    draw(ctx){
		ctx.drawImage(this.sprites[0], this.x, this.y);
        ctx.drawImage(this.sprites[this.frame], this.x, this.y);
    }

    getEyeCollidingArrow(arrowManager){
        if (this.frame == 0) return null;
		return arrowManager.getCollidingArrow(this.x + this.eyeRect.left, this.x + this.eyeRect.right, this.y + this.eyeRect.top, this.y + this.eyeRect.bottom);
	}

    checkCollisionWithArcher(archer){
		return archer.collidesWith(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
}

class Beam{
    constructor(x,y,dx){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.isActive = true;
        this.width = 50;
    }

    update(time){
        if (!this.prevTime){
            this.prevTime = time;
        }
        
        let dt = time - this.prevTime;
        
        this.prevTime = time;
        this.x += this.dx * dt;
        if (this.x < -this.width){
            this.isActive = false;
        }
    }

    draw(ctx){
        ctx.save();
		ctx.translate(this.x, this.y);
        ctx.strokeStyle = "#FF0000";        
		ctx.beginPath();
		ctx.moveTo(0,  0);
		ctx.lineTo(this.width, 0);
		ctx.stroke();
        ctx.restore();
    }

    checkCollisionWithArcher(archer){
		return archer.collidesWith(this.x, this.x + this.width, this.y, this.y);
	}
}

class DemonLevel{
    constructor(sprites, archer, arrowManager){	
        this.sprites = sprites;
        this.archer = archer;
        this.arrowManager = arrowManager;        
		this.levelCompleted = false;
        this.beams = [];
        this.demon = new Demon(500, 340, sprites, (frame)=>{
            if (frame == 2){
                this.beams.push(new Beam(this.demon.x - 30, this.demon.y + 21, -0.2));
            }
        });
    }

    update(time){
        if (this.gameIsLost || this.levelCompleted) {
			this.timeSpentFrozen = time - this.timeOfLevelFreeze;
			return;			
		}

		this.archer.update(time);		
		this.arrowManager.update(time);
        this.demon.update(time);

        let arrowInEye = this.demon.getEyeCollidingArrow(this.arrowManager);
        if (arrowInEye){
            this.demon.frame = 3;
            this.arrowManager.destroyArrow(arrowInEye)
            this.levelCompleted = true;
            this.timeOfLevelFreeze = time;
        }

        if (this.archer.collidesWithArrow(this.arrowManager) || this.demon.checkCollisionWithArcher(this.archer)){
			this.gameIsLost = true;
			this.timeOfLevelFreeze = time;
		}

        for (let beam of this.beams){
            beam.update(time);
            if (beam.checkCollisionWithArcher(this.archer)){
                this.gameIsLost = true;
                this.timeOfLevelFreeze = time;
            }
        }

        this.beams = this.beams.filter((beam) => beam.isActive );
    }

    draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
        this.demon.draw(ctx);
        for (let beam of this.beams){
            beam.draw(ctx);
        }
	}

	isComplete(){
		return this.levelCompleted && this.timeSpentFrozen > 1000 ;
	}
	
	isLost(){
	    return this.gameIsLost && this.timeSpentFrozen > 1000 ;
	}
	
    mousemove(x, y){
        if (this.gameIsLost) return;
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
        if (this.gameIsLost) return;
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