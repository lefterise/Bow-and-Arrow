class VultureLevel{
	constructor(vultureAliveSprites, vultureDeadSprites, pigeonAliveSprites, pigeonDeadSprites, archer, arrowManager){
		let vultureCollisionRect = new CollisionRect(0,54,32,52);
		let vultureFactory = (x,y) =>{
			return new SpawnableEnemy(x, y, new Velocity(640 / 5500, 0), vultureAliveSprites, vultureDeadSprites, vultureCollisionRect, 300, null, (enemy)=>{ this.numEscaped++;});
		}
		this.spawnableLevel = new SpawnableEnemyLevel(1800, 1, archer, arrowManager, null, vultureFactory);
		let pigeonCollisionRect = new CollisionRect(0,26,11,25);
		this.pigeon = new SpawnableEnemy(600, 240, new Velocity(0.13, 0.06), pigeonAliveSprites, pigeonDeadSprites, pigeonCollisionRect, 280);
		this.pigeonAlive = true;
		this.numEscaped = 0;
	}
	
	update(time){
		this.spawnableLevel.update(time);
		this.pigeon.update(time);
		
		let arrow = this.pigeon.checkCollisions(this.spawnableLevel.arrowManager);
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
			this.pigeonAlive &&= this.numEscaped == 0;
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
		this.spawnableLevel.touchmove(x, y);
	}
	
	touchstart(x, y){
		this.spawnableLevel.touchstart(x, y);
	}
	
	touchend(x, y){
		this.spawnableLevel.touchend(x, y);
	}	
}
