class Score{
	constructor(){
		this.score = 0;
		this.highscore = 0;
		this.level = 0;
		this.levelName = "";
		this.lives = 0;
		this.arrows = 0;
	}	

	add(num){
		this.score += num;
	}

    addArrows(num){
        this.arrows += num;
    }

    changeLevel(title){
        this.arrows += 15;
        this.lives++;
        this.level++;
        this.levelName = title;
    }
	
 	draw(ctx){
		ctx.clearRect(0, 0, 640, 46);

		ctx.strokeStyle = "#606060";
		ctx.beginPath();
		ctx.moveTo(4,  46-4);
		ctx.lineTo(4,  4);
		ctx.lineTo(640 - 4, 4);
		ctx.stroke();
		
		ctx.strokeStyle = "#F0F0F0";
		ctx.beginPath();
		ctx.moveTo(640 - 4, 4);
		ctx.lineTo(640 - 4, 46-4);
		ctx.lineTo(4, 46-4);
		ctx.stroke();

		ctx.fillStyle = "#000000";
		ctx.font = '14px serif';
		ctx.fillText("Score: " + this.score, 12, 20);
		ctx.fillText("High Score: " + this.highscore, 12, 36);

		ctx.fillText("Level " + this.level, 320 - ctx.measureText("Level " + this.level).width /2, 20);
		ctx.fillText(this.levelName, 320 - ctx.measureText(this.levelName).width /2, 36);

		for (let i = 0; i < Math.min(12, this.lives); i++){
			ctx.drawImage(sprites[48], 640 - 25 - i * 12, 12);
		}

		for (let i = 0; i < Math.min(30, this.arrows); i++){
			ctx.drawImage(sprites[10], 640 - 16 - i * 5, 28);
		}
	}
}