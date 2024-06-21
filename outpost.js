class Catapult{
    constructor(sprites, x, y, callback){	
        this.sprites = sprites;
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.callback = callback;
        this.collisionRect = {left: 8, right: 99, top: 45, bottom: 115};
		this.deflectionRect = {left: 4, right: 11, top: 57, bottom: 64};
    }

    update(time){
        if (this.lastThrowTime == undefined){
            this.lastThrowTime = time;
        }

        if (time > this.lastThrowTime + 500){
            this.frame = 1;
        }

        if (time > this.lastThrowTime + 3000){
            this.frame = 2;
            this.lastThrowTime = time;
            this.callback();
        }        
    }

    draw(ctx){
	    ctx.drawImage(this.sprites[this.frame], this.x, this.y);
	}
    
    checkCollisions(arrowManager){
		return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}

	checkDeflections(arrowManager){
		return this.frame == 1 && arrowManager.getCollidingArrow(this.x + this.deflectionRect.left, this.x + this.deflectionRect.right, this.y + this.deflectionRect.top, this.y + this.deflectionRect.bottom);
	}
}

class OutpostLevel{
    constructor(sprites, archer, arrowManager){	
        this.sprites = sprites;
        this.archer = archer;
        this.arrowManager = arrowManager;
        this.catapult = new Catapult(this.sprites, 410, 306, ()=>{ this.throwRock()});
        this.projectiles = [];
    }
    
    createRock(){
        //let dy = (2 * Math.random() - 1.4) * 0.1; //random
        let dy = ((this.archer.y + 50) - 306) / (((this.archer.x + 50) - 410) / -0.2);  //aim at archer center
        let rock = new Projectile(410, 306, -0.2, dy, this.sprites[4])
        rock.collisionRect = {left: 0, right: 26, top: 4, bottom: 26};
        return rock;
    }

    throwRock(){
        this.projectiles.push(this.createRock());
    }

	update(time){
        if (this.gameIsLost) {
			this.timeSinceArcherDeath = time - this.timeOfArcherDeath;
			return;			
		}

		this.archer.update(time);		
		this.arrowManager.update(time);
        this.catapult.update(time);

		let arrow1 = this.catapult.checkDeflections(this.arrowManager);
		if (arrow1){
			arrow1.dx =   200 / 2000;
			arrow1.dy = - 600 / 2000;
			arrow1.dodjedCatapult = true;
		}

        let arrow = this.catapult.checkCollisions(this.arrowManager);
        if (arrow && !arrow.dodjedCatapult){
            this.arrowManager.destroyArrow(arrow)
        }

        for (let projectile of this.projectiles){
			projectile.update(time);

			let arrow = projectile.checkCollisions(this.arrowManager);
			if (arrow){			
				this.arrowManager.destroyArrow(arrow)
			}

			if (projectile.checkCollisionWithArcher(this.archer)){
				//this.gameIsLost = true;
				//this.timeOfArcherDeath = time;
			}
		}
    }

    draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
        this.catapult.draw(ctx);
		for (let projectile of this.projectiles){
			projectile.draw(ctx);
		}
        ctx.drawImage(this.sprites[3], 540, 360);
	}

	isComplete(){
		return false;
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