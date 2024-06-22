class Dragon{
    constructor(x,y, sprites){	
        this.x = x;
        this.y = y;
        this.sprites = sprites;
        this.frame = 0;
        this.hasFire = false;

        this.dy = -0.05;
        this.dx = -0.07;

        this.mouthRect = {left: 26, right: 30, top: 22, bottom: 27};
        this.mouthCavity = {left: 13, right: 30, top: 20, bottom: 29};
        this.collisionRect = {left: 13, right: 132, top: 8, bottom: 92};
        this.flameRect = {left: 8, right: 76, top: 7, bottom: 49};
        this.flameOffset = {x: -47};
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

        if (time - this.frameStartTime >= 300){
            this.frame = (this.frame + 1) % 2;
            this.frameStartTime = time;
        }

        if (!this.fireStartTime){
            this.fireStartTime = time;
        }

        if (time - this.fireStartTime >= 1500){
            this.hasFire = !this.hasFire;
            this.fireStartTime = time;
        }

    }

    draw(ctx){
		ctx.drawImage(this.sprites[this.frame], this.x, this.y);
        if (this.hasFire){
            ctx.drawImage(this.sprites[2], this.x + this.flameOffset.x, this.y);
        }
    }

    getCollidingArrow(arrowManager){
        let inMouthCavity = arrowManager.getCollidingArrow(this.x + this.mouthCavity.left, this.x + this.mouthCavity.right, this.y + this.mouthCavity.top, this.y + this.mouthCavity.bottom);
        if (inMouthCavity)
            return null;

		return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}

    getMouthCollidingArrow(arrowManager){
        if (this.hasFire) 
            return null;

		return arrowManager.getCollidingArrow(this.x + this.mouthRect.left, this.x + this.mouthRect.right, this.y + this.mouthRect.top, this.y + this.mouthRect.bottom);
	}


    getFlameCollidingArrow(arrowManager){
        if (!this.hasFire) 
            return null;

		return arrowManager.getCollidingArrow(this.x + this.flameRect.left + this.flameOffset.x, this.x + this.flameRect.right + this.flameOffset.x, this.y + this.flameRect.top, this.y + this.flameRect.bottom);
	}

    checkCollisionWithArcher(archer){
		return archer.collidesWith(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom)
            || (this.hasFire && archer.collidesWith(this.x + this.flameRect.left + this.flameOffset.x, this.x + this.flameRect.right + this.flameOffset.x, this.y + this.flameRect.top, this.y + this.flameRect.bottom));
	}
}

class DragonLevel{
    constructor(sprites, archer, arrowManager){	
        this.sprites = sprites;
        this.archer = archer;
        this.arrowManager = arrowManager;        
		this.levelCompleted = false;
        this.dragon = new Dragon(500, 340, sprites);
    }

    update(time){
        if (this.gameIsLost || this.levelCompleted) {
			this.timeSpentFrozen = time - this.timeOfLevelFreeze;
			return;			
		}

		this.archer.update(time);		
		this.arrowManager.update(time);
        this.dragon.update(time);

        let arrowInMouth = this.dragon.getMouthCollidingArrow(this.arrowManager);
        if (arrowInMouth){
            this.levelCompleted = true;
            this.timeOfLevelFreeze = time;
        }

        let arrowOnFlame = this.dragon.getFlameCollidingArrow(this.arrowManager);
        if (arrowOnFlame && !arrowOnFlame.hasMelted){
            arrowOnFlame.dx = 0;
            arrowOnFlame.dy = 0.3;
            arrowOnFlame.hasMelted = true;

            arrowOnFlame.x += arrowOnFlame.dx * 2 * 51;
			arrowOnFlame.y += arrowOnFlame.dy * 2 * 51;
        }

        let arrow = this.dragon.getCollidingArrow(this.arrowManager);
        if (arrow && !arrow.bouncedOnDragon && !arrow.hasMelted){
            arrow.dx *= -1;
            arrow.bouncedOnDragon = true;

            arrow.x += arrow.dx * 2 * 51;
			arrow.y += arrow.dy * 2 * 51;
        }

        if (this.archer.collidesWithArrow(this.arrowManager) || this.dragon.checkCollisionWithArcher(this.archer)){
			this.gameIsLost = true;
			this.timeOfLevelFreeze = time;
		}
    }

    draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
        this.dragon.draw(ctx);
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