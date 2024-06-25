class Bat{
	constructor(x, y, movePixelsPerMs, aliveSprites, deadSprites, collisionRect, animationSpeed, animationFrameChangedCallback, escapedCallback, yRange){
		this.x = x;
		this.y = y;
		this.movePixelsPerMs = movePixelsPerMs;
		this.previousUpdateTime = -1;
		this.timeSpawned = -1;
		this.timeOfDeath = -1;
		this.state = SpawnableEnemyState.Alive;
		this.aliveSprites = aliveSprites;
		this.deadSprites = deadSprites;
		this.animationFrame = 0;
		this.collisionRect = collisionRect;
		this.animationSpeed = animationSpeed;
		this.animationFrameChangedCallback = animationFrameChangedCallback;
		this.escapedCallback = escapedCallback;
        this.minY = y - yRange;
        this.maxY = y + yRange;
	}
	
	die(){
		this.state = SpawnableEnemyState.Dying;
		this.timeOfDeath = -1;
		this.animationFrame = 0;
	}
	
	checkCollisions(arrowManager){
		if (this.state == SpawnableEnemyState.Alive && arrowManager.collidesWith(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom)){			
			let arrow = arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
			return arrow;					
		}
		return null;
	}
	
	checkCollisionWithArcher(archer){
		return archer.collidesWith(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
	
	update(time){
		if (this.state == SpawnableEnemyState.Alive){
			if (this.previousUpdateTime == -1){
				this.previousUpdateTime = time;
			}
			if (this.timeSpawned == -1){
				this.timeSpawned = time;
			}
			var timeSincePrevUpdateMs = time - this.previousUpdateTime;
			this.previousUpdateTime = time;			
			this.x += timeSincePrevUpdateMs * this.movePixelsPerMs.dx;
			this.y += timeSincePrevUpdateMs * this.movePixelsPerMs.dy;            
			if (this.x < -this.collisionRect.right) {
				this.state = SpawnableEnemyState.Dead;
				if (this.escapedCallback){
					this.escapedCallback(this);
				}
			}
            if (this.y >= this.maxY){
                this.movePixelsPerMs.dy = -Math.abs(this.movePixelsPerMs.dy);
            }
            if (this.y <= this.minY){
                this.movePixelsPerMs.dy = Math.abs(this.movePixelsPerMs.dy);
            }

			var prevAnimFrame = this.animationFrame;
			this.animationFrame = Math.floor((time - this.timeSpawned)/this.animationSpeed) % this.aliveSprites.length;
			if (this.animationFrame != prevAnimFrame && this.animationFrameChangedCallback){
				this.animationFrameChangedCallback(this.animationFrame, this);
			}
		}
		if (this.state == SpawnableEnemyState.Dying){
			if (this.timeOfDeath == -1){
			    this.timeOfDeath = time;
			}
			var timeSinceDeath = time - this.timeOfDeath;
			
			if (timeSinceDeath > 500){
				this.state = SpawnableEnemyState.Dead;
			}
			this.animationFrame = Math.floor(timeSinceDeath/this.animationSpeed) % this.deadSprites.length;
		}
	}
	
	draw(ctx){
		if (this.animationFrame != 0 && this.state == SpawnableEnemyState.Dying){
			console.log(this.animationFrame);
		}
		
		if (this.state == SpawnableEnemyState.Alive || this.state == SpawnableEnemyState.Dying){
			ctx.drawImage(this.state == SpawnableEnemyState.Alive ? this.aliveSprites[this.animationFrame] : this.deadSprites[this.animationFrame], this.x, this.y);
		}
	}
}