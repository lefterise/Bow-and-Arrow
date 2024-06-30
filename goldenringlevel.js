class GoldenRing{
    constructor(x,y,dy,ringSprite){
        this.x = x;
        this.y = y;
        this.dy = dy;
        this.ringSprite = ringSprite;
        this.collisionRect = {left: 1, right: 5, top: 9, bottom: 22};
        this.minY = -50;
        this.maxY = 480+32;
    }

    update(time){
        if (this.prevTime == undefined){
            this.prevTime = time;
        }
        let dt = time - this.prevTime;
        this.prevTime = time;

        this.y += this.dy * dt;

        if (this.y <= this.minY){
            this.dy = Math.abs(this.dy);
            this.y = this.minY;
        }

        if (this.y >= this.maxY - 32){
            this.dy = -Math.abs(this.dy);
            this.y = this.maxY - 32;
        }
    }

    draw(ctx){
        ctx.drawImage(this.ringSprite, this.x, this.y);
    }

    getCollidingArrow(arrowManager){     
		return arrowManager.getCollidingArrow(this.x + this.collisionRect.left, this.x + this.collisionRect.right, this.y + this.collisionRect.top, this.y + this.collisionRect.bottom);
	}
}

class GoldenRingLevel extends TargetLevel{
    constructor(targetSprite, ringSprite, archer, arrowManager){	
        super(targetSprite, archer, arrowManager);
        this.target.bullseyeRadius = 6;
        this.target.requiredColor = '#FFCC00';
        this.goldenRing = new GoldenRing(300,50 + 280, -0.1, ringSprite);
    }

    update(time){
        super.update(time);
        this.goldenRing.update(time);
        let arrow = this.goldenRing.getCollidingArrow(this.arrowManager);
        if (arrow){
            arrow.color = '#FFCC00';
        }
    }

    draw(ctx){
        super.draw(ctx);
        this.goldenRing.draw(ctx);
    }
}