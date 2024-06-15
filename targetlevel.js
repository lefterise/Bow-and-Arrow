class TargetLevel{
	constructor(targetSprite, arrowSprite, archer, arrowManager){	
		this.archer = archer;
		this.arrowManager = arrowManager;		
		this.target = new Target(580, 400, 480/5000, targetSprite, arrowSprite);
	}
	
	update(time){
		this.archer.update(time);		
		this.arrowManager.update(time);
		
		this.target.update(time);
		this.target.checkCollisions(this.arrowManager);
	}
	
	
	draw(ctx){
		this.target.draw(ctx);
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);	
	}
	
	isComplete(){
		return this.target.state == TargetState.Dead;
	}
	
	isLost(){
		return false;
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