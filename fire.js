class Fire{
	constructor(){
		this.prevTime = -1;
		this.y = 480;
		this.x = 320;
		this.collisionRect = new CollisionRect(2,25,0,31);
	}
	
	checkCollisions(arrowManager){
		if (arrowManager.collidesWith(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom)){			
			let arrow = arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
			
			if (arrow.arrowSprite != sprites[31]){
				arrow.arrowSprite = sprites[31];
				arrow.tip = new ArrowTip(60, 7);
				arrow.y -= 5;
				arrow.onFire = true;
			}
		}	
	}
	
	update(time){
		if (this.prevTime == -1){
			this.prevTime = time;
		}
		var timeSincePrevUpdateMs = time - this.prevTime;
		this.prevTime = time;
		
		this.y = this.y - 0.1 * timeSincePrevUpdateMs;
		if (this.y < -31){
			this.y = 480;
		}
	}
	
	draw(ctx){
		ctx.drawImage(sprites[29], this.x, this.y);
	}
}
