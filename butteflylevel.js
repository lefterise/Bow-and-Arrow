class ButterflyLevel{
	constructor(bubbleSprite, poppedBubbleSprite, butterflySprite, archer, arrowManager){	
		this.archer = archer;
		this.arrowManager = arrowManager;
		this.butterflies = [];
		for (let i = 0; i < 12; ++i){
			this.butterflies.push(new Butterfly(250 + i * 30, Math.random() * 480, (Math.round(Math.random()) * 2 - 1) * 480 / 7000, bubbleSprite, poppedBubbleSprite, butterflySprite))
		}
	}
	
	update(time){
		this.archer.update(time);		
		this.arrowManager.update(time);
		
		for (let butterfly of this.butterflies){
			butterfly.update(time);
			butterfly.checkCollisions(this.arrowManager);
		}
	
		this.butterflies = this.butterflies.filter((butterfly) => butterfly.state != ButteflyState.Dead);
	}
	
	
	draw(ctx){
		for (let butterfly of this.butterflies){
			butterfly.draw(ctx);
		}
		this.archer.draw(ctx);
		this.arrowManager.draw(ctx);	
	}
	
	isComplete(){
		return this.butterflies.length == 0;
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