class Guard{
    constructor(x,y, sprites, retreatCallback){
        this.x = x;
        this.y = y;
        this.dx = -0.15;
        this.sprites = sprites;
        this.frame = 0;
        this.collisionRectShield = {left: -14, right: 53, top: 4, bottom: 109};
        this.collisionRect = {left:  10, right: 53, top: 4, bottom: 109}; 
        this.isAlive = true;
        this.retreatCallback = retreatCallback;
    }
    update(time){
        if (this.despawnTime){
            if (time >= this.despawnTime){
                this.isAlive = false;
            }
            return;
        }
        if (!this.prevTime){
            this.prevTime = time;
        }
        
        let dt = time - this.prevTime;
        
        this.prevTime = time;

        this.x += this.dx * dt;
        if (this.x <= 420){
            this.x = 420;
            this.dx = Math.abs(this.dx);
            this.frame = 1;
            this.drawShield = false;
            if (this.retreatCallback){
                this.retreatCallback(this);
            }
        }
        if (this.x >= 740){
            this.x = 740;
            this.dx = -Math.abs(this.dx);
            this.frame = 0;
            
        }

        if (this.drawShield && time >= this.blockUntilTime){
            this.drawShield = false;
        }
    }

    die(time){
        this.frame = 2;
        this.despawnTime = time + 600;
    }
    
    draw(ctx){
        ctx.drawImage(this.sprites[this.frame], this.x, this.y);
        if (this.drawShield){
            ctx.drawImage(this.sprites[4], this.x, this.y);
        }
    }

    block(time){
        this.blockUntilTime = time + 300;
        this.drawShield = true;
    }

    getShieldCollidingArrow(arrowManager){
        if (this.frame != 0 || this.x >= 640) return null;
        return arrowManager.getCollidingArrow(this.x + this.collisionRectShield.left, this.x + this.collisionRectShield.right, this.y + this.collisionRectShield.top, this.y + this.collisionRectShield.bottom);
   }

    getCollidingArrow(arrowManager){
        if (this.frame != 1 || this.x >= 640) return null;
     	return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
}

class ImperialGuardLevel{
    constructor(sprites, archer, arrowManager){	
        this.sprites = sprites;
        this.archer = archer;
        this.arrowManager = arrowManager;        
		this.levelCompleted = false;

        this.projectiles = [];
        this.guards = [
            new Guard(400,50, sprites, (g)=>{this.projectiles.push(this.createOrb(g.x + 8, g.y + 34-8,-0.2))}),
            new Guard(600,200, sprites, (g)=>{this.projectiles.push(this.createOrb(g.x + 8, g.y + 34-8,-0.2))}),
            new Guard(500,350, sprites, (g)=>{this.projectiles.push(this.createOrb(g.x + 8, g.y + 34-8,-0.2))})
        ];
        
    }

    createOrb(x,y,dx){
        let dy = ((this.archer.y + 50) - y) / (((this.archer.x + 50) - x) / dx); 
        let orb = new Projectile(x, y, dx, dy, this.sprites[3])
        orb.collisionRect = {left: 0, right: 14, top: 8, bottom: 23};
        return orb;
    }

    update(time){
        if (this.gameIsLost) {
			this.timeSpentFrozen = time - this.timeOfLevelFreeze;
			return;			
		}

		this.archer.update(time);		
		this.arrowManager.update(time);
        for (let guard of this.guards){
            guard.update(time);
            
            let arrow = guard.getShieldCollidingArrow(this.arrowManager);
            if (arrow && !arrow.bounced){
                arrow.dx *= -1;
                arrow.bounced = true;

                arrow.x += arrow.dx * 2 * 51;
			    arrow.y += arrow.dy * 2 * 51;

                guard.block(time);
            }

            let arrow2 = guard.getCollidingArrow(this.arrowManager);
            if (arrow2){
                guard.die(time);
                this.arrowManager.destroyArrow(arrow2)
            }
        }

        for (let projectile of this.projectiles){
			projectile.update(time);

			let arrow = projectile.checkCollisions(this.arrowManager);
			if (arrow){			
				this.arrowManager.destroyArrow(arrow)
			}

			if (projectile.checkCollisionWithArcher(this.archer)){
				this.gameIsLost = true;
				this.timeOfLevelFreeze = time;
			}
		}

        if (this.archer.collidesWithArrow(this.arrowManager)){
			this.gameIsLost = true;
			this.timeOfLevelFreeze = time;
		}

        this.guards = this.guards.filter((guard) => guard.isAlive );
    }

    draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
        for (let guard of this.guards){
            guard.draw(ctx);
        }
        for (let projectile of this.projectiles){
			projectile.draw(ctx);
		}
	}

	isComplete(){
		return this.guards.length == 0;
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