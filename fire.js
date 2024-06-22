class Fire{
	constructor(){
		this.prevTime = -1;
		this.y = 480;
		this.x = 320;
		this.collisionRect = new CollisionRect(2,25,0,31);
	}
	
	checkCollisions(arrowManager){
		let arrow = arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);

		if (arrow){			
			if (!arrow.onFire){
				arrow.drawAttachment = (ctx)=>{
					ctx.drawImage(sprites[31], 0, -8);
				}
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
