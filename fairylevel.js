
class Cloud {
    constructor(x, y, dy, cloudSprite, darkCloudSprite, level) {
        this.x = x;
        this.y = y;
        this.dy = dy;
        this.sprites = [cloudSprite, darkCloudSprite];
        this.color = 0;
        this.previousUpdateTime = -1;
        this.level = level;
        this.lastLigtningBoltTime = -1;
    }

    draw(ctx) {
        ctx.drawImage(this.sprites[this.color], this.x, this.y);
    }

    update(time) {
        if (this.previousUpdateTime == -1) {
            this.previousUpdateTime = time;
        }
        var timeSincePrevUpdateMs = time - this.previousUpdateTime;
        this.previousUpdateTime = time;
        this.y += timeSincePrevUpdateMs * this.dy;
        if (this.y < -50) {
            this.dy = Math.abs(this.dy);
        }
        if (this.y > 480) {
            this.dy = -Math.abs(this.dy);
        }

        if (this.color == 1 && time >= this.lastLigtningBoltTime + 1500) {
            this.level.throwLightning(this.x, this.y + 25);
            this.lastLigtningBoltTime = this.previousUpdateTime;
        }
    }

    checkCollisions(arrowManager) {
        if (this.color == 0 && arrowManager.collidesWith(this.x, this.x + 30, this.y, this.y + 50)) {
            this.color = 1;
            this.level.throwLightning(this.x, this.y + 25);
            this.lastLigtningBoltTime = this.previousUpdateTime;
        }
    }
}

class Lightning {
    constructor(x, y, dx, sprite) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.sprite = sprite;
        this.previousUpdateTime = -1;
        this.isActive = true;
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y);
    }
    update(time) {
        if (this.previousUpdateTime == -1) {
            this.previousUpdateTime = time;
        }
        var timeSincePrevUpdateMs = time - this.previousUpdateTime;
        this.previousUpdateTime = time;
        this.x += timeSincePrevUpdateMs * this.dx;
        if (this.x < -50) {
            this.isActive = false;
        }
    }

    checkCollisionWithArcher(archer) {
        return archer.collidesWith(this.x, this.x + 58, this.y, this.y + 10);
    }
}

class FairyLevel extends ButterflyLevel {
    constructor(bubbleSprite, poppedBubbleSprite, butterflySprite, cloudSprite, darkCloudSprite, lightningSprite, archer, arrowManager) {
        super(bubbleSprite, poppedBubbleSprite, butterflySprite, archer, arrowManager);
        this.clouds = [
            new Cloud(450, 40, -0.05, cloudSprite, darkCloudSprite, this),
            new Cloud(350, 250, -0.05, cloudSprite, darkCloudSprite, this),
            new Cloud(550, 440, -0.05, cloudSprite, darkCloudSprite, this)
        ];
        this.lightningSprite = lightningSprite;
        this.lightnings = [];
    }

    throwLightning(x, y) {
        this.lightnings.push(new Lightning(x - 52, y, -0.2, this.lightningSprite));
    }

    update(time) {
        if (this.gameIsLost) {
            this.timeSinceArcherDeath = time - this.timeOfArcherDeath;
            return;
        }

        super.update(time);

        for (let cloud of this.clouds) {
            cloud.update(time);
            cloud.checkCollisions(this.arrowManager);
        }

        for (let lightning of this.lightnings) {
            lightning.update(time);

            if (lightning.checkCollisionWithArcher(this.archer)) {
                this.gameIsLost = true;
                this.timeOfArcherDeath = time;
            }
        }

        this.lightnings = this.lightnings.filter((lightning) => lightning.isActive);
    }

    draw(ctx) {
        super.draw(ctx);
        for (let cloud of this.clouds) {
            cloud.draw(ctx);
        }

        for (let lightning of this.lightnings) {
            lightning.draw(ctx);
        }
    }

    isLost() {
        return this.gameIsLost && this.timeSinceArcherDeath > 1000;
    }
}