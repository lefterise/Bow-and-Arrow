class DarkForest{
	constructor(archer, arrowManager, vultureLevel){
		this.archer = archer;
		this.arrowManager = arrowManager;
		var collisionRect = new CollisionRect(7,72,2,72);
		this.enemies = [];
		this.enemies.push(new SpawnableEnemy(560,   0, new Velocity(0,0), [sprites[26],sprites[27]], [sprites[28]], collisionRect, 1500, (frame, enemy)=>this.spawnProjectile(frame, 0, enemy.x, enemy.y + 40)));
		this.enemies.push(new SpawnableEnemy(560, 100, new Velocity(0,0), [sprites[27],sprites[26]], [sprites[28]], collisionRect, 1500, (frame, enemy)=>this.spawnProjectile(frame, 1, enemy.x, enemy.y + 40)));
		this.enemies.push(new SpawnableEnemy(560, 200, new Velocity(0,0), [sprites[26],sprites[27]], [sprites[28]], collisionRect, 1500, (frame, enemy)=>this.spawnProjectile(frame, 0, enemy.x, enemy.y + 40)));
		this.enemies.push(new SpawnableEnemy(560, 300, new Velocity(0,0), [sprites[27],sprites[26]], [sprites[28]], collisionRect, 1500, (frame, enemy)=>this.spawnProjectile(frame, 1, enemy.x, enemy.y + 40)));
		this.enemies.push(new SpawnableEnemy(560, 400, new Velocity(0,0), [sprites[26],sprites[27]], [sprites[28]], collisionRect, 1500, (frame, enemy)=>this.spawnProjectile(frame, 0, enemy.x, enemy.y + 40)));
		
		this.projectiles = [];
		
		this.levelStartTime = -1;
		this.timeElapsed = 0;
		this.previousSpawnTime = 0;
		
		this.spawnRateMs = 2000;
		this.appleCollisionRect = new CollisionRect(0,13,0,14);
		this.gameIsLost = false;
		
		this.fire = new Fire();
		
		this.timeSinceArcherDeath = -1;
		this.vultureLevel = vultureLevel;
	}
	
	update(time){
		if (this.gameIsLost) {
			this.timeSinceArcherDeath = time - this.timeOfArcherDeath;
			return;
		}


		this.archer.update(time);
		this.arrowManager.update(time);
		
		
		if (this.vultureLevel.pigeonAlive == true){
			this.fire.update(time);		
			this.fire.checkCollisions(this.arrowManager);
		}
		
		this.enemies = this.updateEnemies(time, this.enemies, true);
		this.projectiles = this.updateEnemies(time, this.projectiles, false);		
	}
	
	spawnProjectile(frame, frameToShootAt, x, y){
		if (frame == frameToShootAt){
			this.projectiles.push(new SpawnableEnemy(x, y, new Velocity(640 / 5000,0), [sprites[30]], [sprites[30]], this.appleCollisionRect, 500));			
		}
	}
	
	updateEnemies(time, enemies, onlyFlamingArrowsKill){
		for (let enemy of enemies){
			enemy.update(time);
			let arrow = enemy.checkCollisions(this.arrowManager);
			if (arrow){
				this.arrowManager.destroyArrow(arrow);
				if (!onlyFlamingArrowsKill || arrow.onFire && arrow.onFire == true){
					enemy.die();
				}
			}
			if (enemy.checkCollisionWithArcher(this.archer)){
				this.gameIsLost = true;
				this.timeOfArcherDeath = time;
			}
		}
		
		return enemies.filter((enemy) => enemy.state != SpawnableEnemyState.Dead);
	}	
	
	draw(ctx){
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);
		this.fire.draw(ctx);
		
		for (let enemy of this.enemies){
			enemy.draw(ctx);
		}
		for (let projectile of this.projectiles){
			projectile.draw(ctx);
		}
	}

	isComplete(){
		return this.enemies.length == 0;
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