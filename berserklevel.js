const BerserkState = {
	Walking: 0,
    Charging: 1,
	Dead: 2
}

class Berserk{
    constructor(x, y, dx, sprites){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.sprites = sprites;        
        this.state = BerserkState.Walking;
        this.collisionRect = {left: 0, right: 68, top: 18, bottom: 120};
    }

    update(time){
		if (this.state == BerserkState.Walking || this.state == BerserkState.Charging){
            if (this.previousUpdateTime === undefined) {
                this.previousUpdateTime = time;
            }
            let timeSincePrevUpdateMs = time - this.previousUpdateTime;
            this.previousUpdateTime = time;

            this.x += this.dx * timeSincePrevUpdateMs;

			if (this.x < -68){
				this.state = BerserkState.Dead;
			}
        }
    }

    isAlive(){
        return this.state != BerserkState.Dead;
    }

    draw(ctx){
        ctx.drawImage(this.sprites[this.state], this.x, this.y);
    }

    checkCollisions(arrowManager){
		if (this.state == BerserkState.Walking || this.state == BerserkState.Charging){
			return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);            			
		}
		return null;
	}

    hit(){
        if (this.state == BerserkState.Walking){
            this.state = BerserkState.Charging;
            this.collisionRect = {left: 52, right: 120, top: 18, bottom: 120};
            this.x -= 45;
        }else{
            this.state = BerserkState.Dead;
        }
    }

	checkCollisionWithArcher(archer){
		return archer.collidesWith(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
}

class PeriodicEvent{
	constructor(numRepetitions, interval, callback){
		this.numRepetitions = numRepetitions;
		this.interval = interval;
		this.callback = callback;		
	}

	update(time){
		if (this.previousEventTime == undefined){
			this.previousEventTime = time;
		}

		if (time >= this.previousEventTime + this.interval && this.numRepetitions > 0){
			this.callback();
			this.numRepetitions--;
			this.previousEventTime = time;
		}
	}
}

class Projectile{
	constructor(x, y, dx, dy, sprite){
        this.x = x;
        this.y = y;
        this.dx = dx;
		this.dy = dy;
        this.sprite = sprite;
        this.collisionRect = {left: 0, right: 26, top: 0, bottom: 26};
		this.isAlive = true;
    }

	update(time){
		if (this.previousEventTime == undefined){
			this.previousEventTime = time;
		}
		let dt = time - this.previousEventTime;
		this.x += this.dx * dt;
		this.y += this.dy * dt;
		this.previousEventTime = time;
		if (this.x < -37){
			this.isAlive = false;
		}
	}

	draw(ctx){
        ctx.drawImage(this.sprite, this.x, this.y);
    }

	checkCollisions(arrowManager){
		return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}

	checkCollisionWithArcher(archer){
		return archer.collidesWith(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
}

class BerserkLevel{
    constructor(berserkGuardingSprite, berserkAttackingSprite, axeSprite, archer, arrowManager){	
        this.archer = archer;
		this.arrowManager = arrowManager;
        this.sprites = [berserkGuardingSprite, berserkAttackingSprite, axeSprite];
		this.berserks = [];
		this.projectiles = [];
		this.gameIsLost = false;
        
		this.spawner = new PeriodicEvent(20, 2500, ()=>{
			this.berserks.push(new Berserk(640, 360 * Math.random(), -0.1, this.sprites));
		});
    }

    update(time){
		if (this.gameIsLost) {
			this.timeSinceArcherDeath = time - this.timeOfArcherDeath;
			return;			
		}
		this.spawner.update(time);
		this.archer.update(time);		
		this.arrowManager.update(time);

        for (let berserk of this.berserks){
			berserk.update(time);
            var arrow = berserk.checkCollisions(this.arrowManager);
			if (arrow){
				if (berserk.state == BerserkState.Walking){
					this.projectiles.push(new Projectile(berserk.x - 40, berserk.y + 20, -0.2, 0.0, this.sprites[2]));
				}

				berserk.hit();
                this.arrowManager.destroyArrow(arrow);								
			}

			if (berserk.checkCollisionWithArcher(this.archer)){
				this.gameIsLost = true;
				this.timeOfArcherDeath = time;
			}
		}
        this.berserks = this.berserks.filter((berserk) => berserk.isAlive() );
		
		for (let projectile of this.projectiles){
			projectile.update(time);

			var arrow = projectile.checkCollisions(this.arrowManager);
			if (arrow){			
				this.arrowManager.destroyArrow(arrow)
			}

			if (projectile.checkCollisionWithArcher(this.archer)){
				this.gameIsLost = true;
				this.timeOfArcherDeath = time;
			}
		}

		this.projectiles = this.projectiles.filter((berserk) => berserk.isAlive );
	}
	
	
	draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
        for (let berserk of this.berserks){
			berserk.draw(ctx);
		}
		for (let projectile of this.projectiles){
			projectile.draw(ctx);
		}
	}
	
	isComplete(){
		return this.berserks.length == 0 && this.spawner.numRepetitions == 0;
	}
	
	isLost(){
		return this.gameIsLost && this.timeSinceArcherDeath > 1000 ;
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