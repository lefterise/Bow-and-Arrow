class ScrollLevel{
	constructor(scrollSprite, message){	
		this.scrollSprite = scrollSprite;
		this.message = message;
		this.complete = false;
	}
	
	update(time){
	}
	
	
	draw(ctx){
		ctx.drawImage(this.scrollSprite, 174, 129);
		ctx.font = '16px serif';
		wrapText(ctx, this.message, 174 + 36, 129 + 38, 291 - 72, 18);
		
	}
	
	isComplete(){
		return this.complete;
	}
	
	isLost(){
		return false;
	}
	
	mousemove(x, y){}
	
	mousedown(button){}
	
	mouseup(button){
		if (button == 0){
			this.complete = true;
		}		
	}
	
	touchmove(x, y){}
	touchstart(x, y){}
	touchend(x, y){
		this.complete = true;
	}
}