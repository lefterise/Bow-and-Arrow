class SpawnableEnemyLevel{
	constructor(aliveSprites, deadSprites, collisionRect, animationSpeed, spawnRateMs, rows, archer, arrowManager, enemyVelocity, animationFrameChangedCallback, arrowEnemyCollisionCallback){	
		this.archer = archer;
		this.arrowManager = arrowManager;
		this.enemies = [];
		this.aliveSprites = aliveSprites;
		this.deadSprites = deadSprites;
		this.levelStartTime = -1;
		this.timeElapsed = 0;
		this.previousSpawnTime = -1;
		this.timeOfArcherDeath = -1;
		this.timeSinceArcherDeath = -1;
		this.gameIsLost = false;
		this.collisionRect = collisionRect;
		this.animationSpeed = animationSpeed;
		this.spawnRateMs = spawnRateMs;
		this.rows = rows;
		this.numEscaped = 0;
		this.enemyVelocity = enemyVelocity;
		this.animationFrameChangedCallback = animationFrameChangedCallback;
		this.arrowEnemyCollisionCallback = arrowEnemyCollisionCallback;

		if (this.arrowEnemyCollisionCallback == undefined){
			this.arrowEnemyCollisionCallback = (arrow, enemy, level) =>{
				enemy.die(); 
				level.arrowManager.destroyArrow(arrow)
			}
		}
	}
		
	update(time){
		if (this.gameIsLost) {
			this.timeSinceArcherDeath = time - this.timeOfArcherDeath;
			return;
		}
		
		this.archer.update(time);
		this.arrowManager.update(time);
		
		if (this.levelStartTime == -1){
			this.levelStartTime = time;
		}
		
		this.timeElapsed = time - this.levelStartTime;
				
		var second = Math.floor(this.timeElapsed / this.spawnRateMs);
		if (second != this.previousSpawnTime && this.timeElapsed < 25000){
			var rowHeight = 380 / this.rows;
			var rowSpace = 10;
			for (var row = 0; row < this.rows; ++row){
				this.enemies.push(new SpawnableEnemy(640, 10 + (rowHeight + rowSpace) * row + rowHeight * Math.random(), this.enemyVelocity, this.aliveSprites, this.deadSprites, this.collisionRect, this.animationSpeed, this.animationFrameChangedCallback, (enemy)=>{ this.numEscaped++;}));
			}
						
			this.previousSpawnTime = second;
		}
		
		for (let enemy of this.enemies){
			enemy.update(time);
			var arrow = enemy.checkCollisions(this.arrowManager);
			if (arrow){
				this.arrowEnemyCollisionCallback(arrow, enemy, this);
			}
			
			if (enemy.checkCollisionWithArcher(this.archer)){
				this.gameIsLost = true;
				this.timeOfArcherDeath = time;
			}
		}
	
		this.enemies = this.enemies.filter((enemy) => enemy.state != SpawnableEnemyState.Dead);
	}
	
	draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);	
		for (let enemy of this.enemies){
			enemy.draw(ctx);
		}
	}
	
	isComplete(){
		return this.timeElapsed > 30000;
	}
	
	isLost(){
		return this.gameIsLost && this.timeSinceArcherDeath > 1000;
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