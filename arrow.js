class ArrowTip{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

class Arrow{
	constructor(y, arrowSprite){
		this.y = y;
		this.x = 51;
		this.prevX = 51;
		this.animationStartTime = -1;
		this.arrowSprite = arrowSprite;
		this.isAlive = true;
		this.tip = new ArrowTip(60, 2);
	}
	
	update(time){
		if (this.isAlive){
			if (this.animationStartTime == -1){
				this.animationStartTime = time;
			}
			var elapsedTimeMs = time - this.animationStartTime;
			var pixelsPerMs = 640 / 2000;
			this.prevX = this.x;
			this.x = 51 + elapsedTimeMs * pixelsPerMs;
			if (this.x > 640) {
				this.isAlive = false;
			}
		}
	}
	
	draw(ctx){	
		ctx.drawImage(this.arrowSprite, this.x, this.y);
	}
	
	collidesWith(left,right,top,bottom){
		let tipX = this.x + this.tip.x;
		let prevTipX = this.prevX + this.tip.x;
		let collided = (this.y + this.tip.y >= top && this.y + this.tip.y <= bottom && prevTipX <= right && tipX >= left);
		
		return collided;
	}
}

class ArrowManager{
	constructor(arrowSprite, destroyArrowOnCollision){	
		this.arrows = [];
		this.arrowSprite = arrowSprite;
		this.destroyArrowOnCollision = destroyArrowOnCollision;
	}
	
	createArrow(y){
		var arrow = new Arrow(y, this.arrowSprite, this.destroyArrowOnCollision);
		this.arrows.push(arrow);
	}
	
	update(time){
		for (let arrow of this.arrows){
			arrow.update(time);		
		}
	
		this.arrows = this.arrows.filter((arrow) =>arrow.isAlive);
	}
	
	draw(ctx){
		for (let arrow of this.arrows){
			arrow.draw(ctx);
		}
	}
	
	collidesWith(l, r, t, b){
		return this.arrows.reduce((accumulator, arrow) => accumulator || arrow.collidesWith(l, r, t, b), false);
	}
	
	getCollidingArrow(l, r, t, b){
		for (let arrow of this.arrows){
			if (arrow.collidesWith(l, r, t, b)){
				return arrow;
			}
		}
		return null;
	}
	
	destroyArrow(arrow){
		const index = this.arrows.indexOf(arrow);
		if (index > -1) {
			this.arrows.splice(index, 1);
		}
	}
}