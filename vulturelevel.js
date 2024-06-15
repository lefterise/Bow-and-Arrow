class VultureLevel{
	constructor(spawnableLevel){
		this.spawnableLevel = spawnableLevel;
		var pigeonCollisionRect = new CollisionRect(0,26,11,25);
		this.pigeon = new SpawnableEnemy(600, 240, new Velocity(0.13, 0.06), [sprites[24], sprites[25]], [sprites[25]], pigeonCollisionRect, 280);
		this.pigeonAlive = true;
	}
	
	update(time){
		this.spawnableLevel.update(time);
		this.pigeon.update(time);
		
		var arrow = this.pigeon.checkCollisions(this.spawnableLevel.arrowManager);
		if (arrow){
			this.pigeon.die(); 
			this.spawnableLevel.arrowManager.destroyArrow(arrow);
			this.pigeonAlive = false;
		}
	}
	
	
	draw(ctx){
		this.spawnableLevel.draw(ctx);
		this.pigeon.draw(ctx);
	}
	
	isComplete(){
		if (this.spawnableLevel.isComplete()){
			this.pigeonAlive &&= this.spawnableLevel.numEscaped == 0;
			return true;
		}
	}
	
	isLost(){
		return this.spawnableLevel.isLost();
	}
	
	mousemove(x, y){
		this.spawnableLevel.mousemove(x, y);
	}
	
	mousedown(button){
		this.spawnableLevel.mousedown(button);
	}
	
	mouseup(button){
		this.spawnableLevel.mouseup(button);
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
