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
}

class BerserkLevel{
    constructor(berserkGuardingSprite, berserkAttackingSprite, axeSprite, archer, arrowManager){	
        this.archer = archer;
		this.arrowManager = arrowManager;
        this.sprites = [berserkGuardingSprite, berserkAttackingSprite, axeSprite];

        this.berserks = [new Berserk(500, 100, -0.1, this.sprites)];
    }

    update(time){
		this.archer.update(time);		
		this.arrowManager.update(time);

        for (let berserk of this.berserks){
			berserk.update(time);
            var arrow = berserk.checkCollisions(this.arrowManager);
			if (arrow){
				berserk.hit();
                this.arrowManager.destroyArrow(arrow);
			}
		}
        this.berserks = this.berserks.filter((berserk) => berserk.isAlive() );
	}
	
	
	draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
        for (let berserk of this.berserks){
			berserk.draw(ctx);
		}
	}
	
	isComplete(){
		return false;
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