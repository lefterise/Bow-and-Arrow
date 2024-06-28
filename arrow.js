class ArrowTip{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

class Arrow{
	constructor(x, y, dx, dy){
		this.y = y;
		this.x = x;
		this.dx = dx;
		this.dy = dy;
		this.prevX = x;
		this.prevY = y;
		this.isAlive = true;
		this.color = "#000000";
	}
	
	update(time){
		if (this.isAlive){
			if (this.prevTime == undefined){
				this.prevTime = time;
			}
			let elapsedTimeMs = time - this.prevTime;
			this.prevTime = time;

			this.prevX = this.x;
			this.prevY = this.y;

			this.x += elapsedTimeMs * this.dx;
			this.y += elapsedTimeMs * this.dy;

			if ( this.x < -60 || this.y < -60 || this.x > 640 || this.y > 480) {
				this.isAlive = false;
			}
		}
	}
	
	draw(ctx){	
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.atan2(-this.dy, -this.dx));

		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(2,  0);
		ctx.lineTo(51, 0);
		ctx.stroke();

		ctx.strokeStyle = "#C0C0C0";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(2, 0);
		ctx.stroke();

		ctx.strokeStyle = "#FF0000";
		ctx.beginPath();
		ctx.moveTo(42, -2);
		ctx.lineTo(49, -2);
		ctx.moveTo(42, -1);
		ctx.lineTo(49, -1);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(42, 2);
		ctx.lineTo(49, 2);
		ctx.moveTo(42, 1);
		ctx.lineTo(49, 1);
		ctx.stroke();

		if (this.drawAttachment){
			this.drawAttachment(ctx);
		}
		
		ctx.restore();
	}
	
	collidesWith(left,right,top,bottom){
		//this formula works for horizontal movement, but what about diagonal?
		let collided = (this.y >= top && this.y <= bottom && this.prevX <= right && this.x >= left);
		
		return collided;
	}
}

class ArrowManager{
	constructor(){	
		this.arrows = [];
	}
	
	createArrow(y){
		let arrow = new Arrow(51+60, y, 640 / 2000, 0);
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
	
	getCollidingArrow(l, r, t, b){
		for (let arrow of this.arrows){
			if (arrow.collidesWith(l, r, t, b)){
				return arrow;
			}
		}
		return null;
	}

	collidesWith(l, r, t, b){
		return this.getCollidingArrow(l, r, t, b) != null;
	}
	
	destroyArrow(arrow){
		const index = this.arrows.indexOf(arrow);
		if (index > -1) {
			this.arrows.splice(index, 1);
		}
	}
}