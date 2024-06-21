const TargetState = {
	Intact: 0,
	Dying: 1,
	Dead: 2
}

class Target{
	constructor(x, y, risePixelsPerMs, targetSprite){
		this.x = x;
		this.y = y;
		this.risePixelsPerMs = risePixelsPerMs;
		this.previousUpdateTime = -1;
		this.state = TargetState.Intact;
		this.targetSprite = targetSprite;
		this.stuckArrows = [];

		this.arrowTemplate = new Arrow(0,0,1,0);
	}
	
	checkCollisions(arrowManager){		
		if (this.state != TargetState.Dead && arrowManager.collidesWith(this.x + 33, this.x + 49, this.y + 24, this.y + 29)){
			this.state = TargetState.Dying;
			this.hitTime = -1;
		}
		if (this.state != TargetState.Dead && arrowManager.collidesWith(this.x + 33, this.x + 49, this.y + 7, this.y + 46)){
			let arrow = arrowManager.getCollidingArrow(this.x + 33, this.x + 49, this.y + 7, this.y + 46);
			this.stuckArrows.push(arrow.y - this.y);
			arrowManager.destroyArrow(arrow);
		}
	}
	
	update(time){
		if (this.state == TargetState.Intact){
			if (this.previousUpdateTime == -1){
				this.previousUpdateTime = time;
			}
			var timeSincePrevUpdateMs = time - this.previousUpdateTime;
			this.previousUpdateTime = time;			
			this.y -= timeSincePrevUpdateMs * this.risePixelsPerMs;
			if (this.y < -50) {
				this.risePixelsPerMs = -Math.abs(this.risePixelsPerMs);
			}
			if (this.y > 480) {
				this.risePixelsPerMs = Math.abs(this.risePixelsPerMs);
			}
		}
		if (this.state == TargetState.Dying){
			if (this.hitTime == -1){
			    this.hitTime = time;
			}
			if (time - this.hitTime > 1000){
				this.state = TargetState.Dead;
			}
		}
	}
	
	draw(ctx){
		ctx.drawImage(this.targetSprite, this.x, this.y);
		for (let arrowYDelta of this.stuckArrows){
			this.arrowTemplate.x = this.x + 39;
			this.arrowTemplate.y = this.y + arrowYDelta;
			this.arrowTemplate.draw(ctx);
		}
	}
}