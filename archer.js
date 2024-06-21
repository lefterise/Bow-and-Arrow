const ArcherState = {
    Idle: 0,
    Loaded: 1,
    Arming: 2,
    Armed: 3,
    Manual: 4
  };
  
class Archer{
	constructor(fireFunc, archerSprites){
		this.collisionRect = new CollisionRect(13, 95, 23, 122);
		this.y = 0;
		this.x = 10;
		this.state = ArcherState.Idle;
		this.sprite = archerSprites.Idle;
		this.pullAnimationStartTime = 0;
		this.fire = fireFunc;
		this.sprites = archerSprites;
    }
	
	move(y){
		this.y = y-70;
	}

	load(){
		if (this.state == ArcherState.Idle){
			this.state = ArcherState.Loaded;
			this.sprite = this.sprites.Loaded;
		}		
	}
	
	pull(){
		if (this.state == ArcherState.Loaded){
			this.pullAnimationStartTime = -1;
			this.state = ArcherState.Arming;
			this.sprite = this.sprites.Arming;
		}		
	}
	
	relax(){
		this.state = ArcherState.Loaded;
		this.sprite = this.sprites.Loaded;
	}
	
	stretchALittle(){
		this.state = ArcherState.Manual;
		this.sprite = this.sprites.Arming;
	}
	
	stretchFull(){
		this.state = ArcherState.Armed;
		this.sprite = this.sprites.Armed;
	}

	release(){
		if (this.state == ArcherState.Arming || this.state == ArcherState.Armed){
			this.state = ArcherState.Idle;
			this.sprite = this.sprites.Idle;
			this.fire(this.y + 61);
		}
		if (this.state == ArcherState.Manual){
			this.state = ArcherState.Loaded;
			this.sprite = this.sprites.Loaded;
		}
	}
	
	update(time){
		if (this.state == ArcherState.Arming){
			if (this.pullAnimationStartTime == -1){
				this.pullAnimationStartTime = time;
			}
			var elapsedTimeInMs = time - this.pullAnimationStartTime;
			
			if (elapsedTimeInMs > 60){
				this.state == ArcherState.Armed;
				this.sprite = this.sprites.Armed;				
			}			
		}		
	}
	
	draw(ctx){
		ctx.drawImage(this.sprite, this.x, this.y);
	}
	
	collidesWith(left,right,top,bottom){
		return this.x + this.collisionRect.left < right
			&& this.x + this.collisionRect.right > left
			&& this.y + this.collisionRect.top <=bottom
			&& this.y + this.collisionRect.bottom >= top;		
	}

	collidesWithArrow(arrowManager){
		return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
}