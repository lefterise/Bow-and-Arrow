class Harpy{
    constructor(x, y, dy, sprites, animationChangeCallback){	
        this.x = x;
        this.y = y;
        this.sprites = sprites;
        this.frame = 0;
        this.dy = dy;
        this.collisionRect = {left: 14, right: 65, top: 5, bottom: 60};
        this.frameDurations = [1500,500];
        this.animationChangeCallback = animationChangeCallback;
        this.state = ButteflyState.Flying;
    }
    
    update(time){
        if (!this.prevTime){
            this.prevTime = time;
        }
        
        let dt = time - this.prevTime;
        
        this.prevTime = time;

        this.y += this.dy * dt;

        if (this.state == ButteflyState.Flying){
            if (this.y >= 480 - this.collisionRect.bottom){
                this.dy = -Math.abs(this.dy);
            }

            if (this.y <= -this.collisionRect.top){
                this.dy = Math.abs(this.dy);
            }

            if (!this.frameStartTime){
                this.frameStartTime = time;
            }

            if (time - this.frameStartTime >= this.frameDurations[this.frame]){
                this.frame = (this.frame + 1) % 2;
                this.frameStartTime = time;
                if (this.animationChangeCallback){
                    this.animationChangeCallback(this.frame);
                }
            }
        }else if (this.state == ButteflyState.Poped){
            if (this.y >= 480 ){
                this.state = ButteflyState.Dead;
            }
        }
    }

    die(){
        this.state = ButteflyState.Poped;
        this.frame = 2;
        this.dy = 0.1;
    }

    draw(ctx){		
        ctx.drawImage(this.sprites[this.frame], this.x, this.y);
    }

    getCollidingArrow(arrowManager){
		return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
}

class HarpyArrow{
    constructor(x,y,dx, sprite){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.isActive = true;
        this.width = 20;
        this.sprite = sprite;
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
        ctx.drawImage(this.sprite, this.x, this.y-1);
    }

    checkCollisionWithArcher(archer){
		return archer.collidesWith(this.x, this.x + this.width, this.y, this.y);
	}
}

class HarpyLevel{
    constructor(sprites, archer, arrowManager){	
        this.sprites = sprites;
        this.archer = archer;
        this.arrowManager = arrowManager;        
		this.levelCompleted = false;
        this.tinyArrows = [];
        this.harpies = [];
        
        for (let  i = 0; i < 5; ++i){
            let harpy = new Harpy(300 + 70 * i, 340 -70*(i%3) - 50 * (i%2), -0.05 * (2 * (i%2) - 1), sprites, (frame)=>{
                if (frame == 1){
                    this.tinyArrows.push(new HarpyArrow(harpy.x - 16, harpy.y + 28, -0.2, sprites[3]));
                }
            })
            this.harpies.push(harpy);
        }
    }

    update(time){
        if (this.gameIsLost || this.levelCompleted) {
			this.timeSpentFrozen = time - this.timeOfLevelFreeze;
			return;			
		}

		this.archer.update(time);		
		this.arrowManager.update(time);

        for (let harpy of this.harpies){
            harpy.update(time);

            let arrow = harpy.getCollidingArrow(this.arrowManager);
            if (arrow && harpy.state == ButteflyState.Flying){
                harpy.die();
                this.arrowManager.destroyArrow(arrow)
            }
        }

        for (let arrow of this.tinyArrows){
            arrow.update(time);
            if (arrow.checkCollisionWithArcher(this.archer)){
                this.gameIsLost = true;
                this.timeOfLevelFreeze = time;
            }
        }

        this.tinyArrows = this.tinyArrows.filter((arrow) => arrow.isActive );
        this.harpies = this.harpies.filter((harpy) => harpy.state != ButteflyState.Dead );
    }

    draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
        for (let harpy of this.harpies){
            harpy.draw(ctx);
        }
        for (let arrow of this.tinyArrows){
            arrow.draw(ctx);
        }
	}

	isComplete(){
		return this.harpies.length == 0;
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