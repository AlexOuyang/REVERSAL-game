
/*************************************************************************
 			Creater - Chenxing Ouyang
 			Sept, 2015
 *************************************************************************/


/*************************
	  CANVAS SETUP
*************************/

// Water colors
var colorPalette = {
    water: '#114B5F',
    background2: '#028090',
    player: '#F45B69',
    goal: 'rgba(255, 255, 255, 0.6)',
    background3: '#202224',
    treeTrunk: '#915961',
    treeLeaf: '#63d8b1',
    grass: ["#83b3ac", "#75a19a", "#688f89", "#5b7d78", "#8fbab4", "#9bc2bc", "#a8c9c4"],
    background1: '#456990',
    deathZone: 'rgba(0, 0, 0, .4)',
    teleporterBackground: 'rgba(100, 170, 160, 0.2)',
    teleporterBeam: 'rgba(244,91,105, 0.8)'
}


var width = 1200;
var height = 600;

var canvas = document.createElement("canvas");
canvas.id = "background";
canvas.style.backgroundColor = colorPalette.background2;
document.body.appendChild(canvas);
var context = canvas.getContext('2d');
canvas.height = height;
canvas.width = width;


/*******************
	   PLAYER
*******************/

var player = function (positionX, positionY, width, height, movingSpeed, jumpingSpeed) {
    this.x = positionX;
    this.y = positionY;
    this.width = width;
    this.height = height;
    this.movingSpeed = movingSpeed;
    this.jumpingSpeed = jumpingSpeed;
    this.velX = 0;
    this.vely = 0;
    this.velocityIncrease = 0;
    this.velocityIncreaseMax = 4;
    this.color = colorPalette.player;
    this.jumping = false;
    this.grounded = false;
    this.flipped = false;
    this.isTeleporting = false;
    this.death = false;
    this.teleportTo = function (distance) {
        this.y += distance;
    }
    this.die = function () {
        this.death = true;
        console.log("You died!");
        alert("You Died! Warning: Blak colored tiles are fatal!");
        window.location.reload();
    }

}

player.prototype.updatePlayer = function () {
    // check keys
    if (Input.isDown(Input.key.UP)) {
        // up arrow or space
        if (!this.jumping && this.grounded) {
            this.jumping = true;
            this.grounded = false;

            // If teleporting, increase the teleporting velocity
            if (this.isTeleporting) {
                if (this.velocityIncrease < this.velocityIncreaseMax) this.velocityIncrease++;
                else this.velocityIncrease = this.velocityIncreaseMax;
            } else {
                this.velocityIncrease = 0;
            }

            if (gravity > 0) {
                this.velY -= (this.jumpingSpeed + this.velocityIncrease);

            } else if (gravity < 0) {
                this.velY += (this.jumpingSpeed + this.velocityIncrease);
            }
        }
    }
    if (Input.isDown(Input.key.RIGHT)) {
        // right arrow
        if (this.velX < this.movingSpeed) {
            this.velX++;
        }
    }
    if (Input.isDown(Input.key.LEFT)) {
        // left arrow
        if (this.velX > -this.movingSpeed) {
            this.velX--;
        }
    }

    // Teleporting velocity increase




    this.velX *= friction;
    this.velY += gravity;
    this.grounded = false;

    // Platform Collision Detection
    for (var i = 0; i < platformTiles.length; i++) {
        var thisTile = platformTiles[i];
        var dir = collisionDetection(this, thisTile);

        // Detecting if the player touches the goal star, delete the tile 
        if (dir && platformTiles[i].tileType === 7) {
            platformTiles.splice(i, 1);
            numOfCollectedGoals++;
        }

        if (gravity > 0) {
            if (dir === "l" || dir === "r") {
                this.velX = 0;
                this.jumping = false;
            } else if (dir === "b") {
                this.grounded = true;
                this.jumping = false;

                // This is the ground top, if this ground is death zone the player dies
                if (thisTile.isDeathZone) {
                    this.die();
                }
                // Flip the player if the tile is a teleporter
                if (thisTile.isTeleporter) {
                    this.isTeleporting = true;
                    this.flipped = !this.flipped;
                    this.teleportTo(-(height - 3 * tileDimension));
                } else {
                    this.isTeleporting = false;
                }

            } else if (dir === "t") {
                this.velY *= 0;
            }
        } else if (gravity < 0) {
            if (dir === "l" || dir === "r") {
                this.velX = 0;
                this.jumping = false;
            } else if (dir === "b") {
                this.velY *= 0;
            } else if (dir === "t") {
                this.grounded = true;
                this.jumping = false;
                // This is the ground top, if this ground is death zone the player dies
                if (thisTile.isDeathZone) {
                    this.die();
                }

                // Flip the player if the tile is a teleporter
                if (thisTile.isTeleporter) {
                    this.isTeleporting = true;
                    this.flipped = !this.flipped;
                    this.teleportTo(height - 2 * tileDimension);

                } else {
                    this.isTeleporting = false;
                }
            }
        }

    }

    if (this.grounded) {
        this.velY = 0;
    }

    if (this.flipped) {
        gravity = -1 * Math.abs(gravity);
    } else {
        gravity = Math.abs(gravity);
    }

    this.x += this.velX;
    this.y += this.velY;
}

player.prototype.drawPlayer = function () {

    context.fillStyle = this.color;
    //    context.beginPath();
    //    context.arc(this.x, this.y, this.width, 0, Math.PI * 2);
    //    context.fill();
    context.rect(this.x, this.y, this.width, this.height);
    context.fill();
}


/*******************
	   GOAL 
*******************/


//var goal = function (positionX, positionY, width, height, ID) {
//    this.x = positionX;
//    this.y = positionY;
//    this.width = width;
//    this.height = height;
//    this.id == ID;
//    this.drawStar = function (arms, x, y, outerVertexRadius, innerVertexRadius, color) {
//
//        var angle = (Math.PI / arms);
//
//        context.fillStyle = color;
//        context.beginPath();
//
//        for (var i = 0; i < 2 * arms; i++) {
//
//            var r = (i & 1) ? innerVertexRadius : outerVertexRadius;
//
//
//            var point_x = x + Math.cos(i * angle) * r;
//            var point_y = y + Math.sin(i * angle) * r;
//
//            if (!i)
//                context.moveTo(point_x + this.x, point_y + this.y);
//            else
//                context.lineTo(point_x + this.x, point_y + this.y);
//        }
//
//        //    context.closePath();
//        context.fill();
//    }
//}
//
//goal.prototype.draw = function () {
//    var starDimension = this.width / 4;
//    this.drawStar(5, this.x + 3 * this.width / 2, this.y + this.height / 2, starDimension, starDimension / 2, colorPalette.goal);
//}

/*******************
   PLATFORM TILE
*******************/

// Tile Type 1 - bottom with grass, 2 - top with grass, 3 - bottom without grass, 4 - top without grass, 5 - death zone
var platformTile = function (positionX, positionY, width, height, tileType) {
    this.x = positionX;
    this.y = positionY;
    this.width = width;
    this.height = height;
    this.tileType = tileType;
    this.isDeathZone = false;
    this.isTeleporter = false;
    this.isGoal = false;
    this.plants = new Array();
    this.spikes = new Array();

    this.init = function () {
        // Only create grass once
        this.createGrass();

        if (tileType === 5) {
            this.isDeathZone = true;
            this.createSpikes();
        }

        if (tileType === 6) {
            this.isTeleporter = true;
            this.height /= 2;
            this.y += this.height / 2;
            water.push(new fluid(this.x, this.y + (this.height / 3), this.width, this.height / 3));
        }

        if (tileType === 7) {
            this.isGoal = true;
            var newHeight = this.height / 2;
            var newWidth = this.width / 2;
            this.height = newHeight;
            this.width = newWidth;
            this.x += newWidth / 2;
            this.y += newHeight / 2;
        }
    }

    this.init();

}

platformTile.prototype.drawPlatformTile = function () {
    // The Platform First, then Create the Grass

    // Draw the grass first then draw the platform
    if (this.tileType === 1 || this.tileType === 2) {
        for (var i = 0; i < this.plants.length; i++) {
            this.plants[i].drawGrass();
        }
    }

    // Draw the death zone
    if (this.tileType === 5) {
        for (var i = 0; i < this.spikes.length; i++) {
            this.spikes[i].draw();
        }
    }

    // Draw the platform
    var grad = context.createRadialGradient(250, 450, 140, 250, 300, 600);
    grad.addColorStop(0, 'rgba(100, 170, 160, 0.6)');
    grad.addColorStop(0.1, 'rgba(100, 160, 160, 0.5)');
    grad.addColorStop(0.3, 'rgba(100, 160, 160, 0.35)');
    grad.addColorStop(0.5, 'rgba(100, 160, 160, 0.2)');
    grad.addColorStop(0.7, 'rgba(100, 160, 160, 0.35)');
    grad.addColorStop(0.9, 'rgba(100, 150, 150, 0.5)');
    grad.addColorStop(1, 'rgba(100, 170, 160, 0.6)');

    context.fillStyle = grad;

    if (this.isDeathZone) context.fillStyle = colorPalette.deathZone; // Color change for death zone tile
    if (this.isTeleporter) context.fillStyle = colorPalette.teleporterBackground; // Color change for teleporter tile
    if (this.isGoal) context.fillStyle = colorPalette.goal; // Color change for teleporter tile

    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fill();

}

// Called to make the grass on top wiggle
platformTile.prototype.updatePlatformTile = function () {
    // Only wiggle grass if there's grass on the platform
    if (this.tileType === 1 || this.tileType === 2) {
        for (var i = 0; i < this.plants.length; i++) {
            this.plants[i].update();
        }
    }
}


platformTile.prototype.createGrass = function () {
    var numOfGrass = 6;
    var averageSpacingDistanceBetweenGrasses = 2;
    for (var i = 1; i < numOfGrass; i++) {
        var grassWidth = 1;
        var grassHeight = 1;
        var flippingFactor;
        // this returns a number between min and max: Math.random() * (max - min) + min;
        var offsetX = -6 + (Math.random() * (((i) * averageSpacingDistanceBetweenGrasses * (this.width / 10)) - (i * averageSpacingDistanceBetweenGrasses * (this.width / 10))) + (i * averageSpacingDistanceBetweenGrasses * (this.width / 10)));
        var offsetY;
        var plantsRootLengthOffset = 2;

        if (this.tileType == 1 || this.tileType === 3) {
            // if this grass grows on tileType 0, it gros on top of the tile,
            offsetY = 0 - plantsRootLengthOffset;
            flippingFactor = 1;
        } else if (this.tileType === 2 || this.tileType === 4) {
            // if the tileType is 1, the grass grows on the bottom of the tile
            offsetY = -(this.height - plantsRootLengthOffset);
            flippingFactor = -1;
        }

        var grass = new tileGrass(this.x + offsetX, this.y - offsetY, (grassWidth + Math.random() * 2) / 12, flippingFactor * (grassHeight + Math.random() * 2) / 12);
        this.plants.push(grass);
        grass.drawGrass();
        // The change of growing tree is about 40%
        if (Math.random() < 0.2) {
            var treeDimensionOffset = Math.random();
            var tree = new tileTree(this.x + offsetX, this.y - offsetY, grassWidth * (1.5 + treeDimensionOffset), flippingFactor * grassHeight * (1.5 + treeDimensionOffset));
            this.plants.push(tree);
            tree.drawGrass();

        }
    }
}

platformTile.prototype.createSpikes = function () {
    var numOfSpikes = 3;
    for (var i = 1; i < numOfSpikes; i++) {
        var spikeWidth = 100;
        var spikeHeight = 100;
        // this returns a number between min and max: Math.random() * (max - min) + min;
        var offsetX;
        var offsetY;

        if (this.tileType == 1 || this.tileType === 3) {
            // if this grass grows on tileType 0, it gros on top of the tile,
            grassHeight = 1;
        } else if (this.tileType === 2 || this.tileType === 4) {
            // if the tileType is 1, the grass grows on the bottom of the tile
            grassHeight = -1;
        }
        var s = new spike(this.x + offsetX, this.y - offsetY, spikeWidth, spikeHeight);
        this.spikes.push(s);
        s.draw();

    }
}


/*****************************
     PLATFORM TILE SPIKES
******************************/
var spike = function (positionX, positionY, width, height) {
    this.x = positionX;
    this.y = positionY;
    this.color = colorPalette.spikes;
    this.width = width;
    this.height = height;
}

spike.prototype.draw = function () {
    context.fillStyle = this.color;
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fill();
};


/*****************************
     PLATFORM TILE GRASS
******************************/

var tileGrass = function (positionX, positionY, width, height, color) {
    this.x = positionX;
    this.y = positionY;
    this.width = width;
    this.height = height;
    this.color = colorPalette.grass;
    this.wiggle = false;
    this.sections = [];
    this.numOfSections = 20;
    this.fixedLength = 250;
    this.loop = 0;
    this.init = function () {
        // Initialize the shape of the grass
        for (var i = 0; i < this.numOfSections; i++) {
            this.sections[i] = 0;
        }

        // Choose a random color for the grass at the begining
        var randomColor = this.color[Math.floor(Math.random() * this.color.length)];
        this.color = randomColor;
    };
    this.init();
}

tileGrass.prototype.drawGrass = function () {
    context.save();
    // set the location of the grass
    context.translate(this.x, this.y);
    // Set the dimension of the grass
    context.scale(this.width, this.height);
    context.save();

    context.restore();
    context.save();

    context.fillStyle = this.color;

    context.beginPath();
    var step = (this.fixedLength / this.numOfSections);
    for (var i = 0; i < this.numOfSections; i++) {
        context.rotate(this.sections[i]);
        context.lineTo(-(this.numOfSections - i), -step * i);
    }

    for (var i = this.numOfSections - 2; i >= 0; i--) {
        context.rotate(-this.sections[i]);
        context.lineTo((this.numOfSections - i), -step * i);
    }
    context.fill();
    context.restore();

    context.restore();
};


tileGrass.prototype.update = function () {
    var i;
    for (i = 0; i < this.numOfSections; i++) {
        this.sections[i] = Math.sin((this.loop - (i * (50 / this.numOfSections))) / 20) / this.numOfSections;
    }
    this.loop = (this.loop + 1) % (Math.PI * 360);
};



/*****************************
     PLATFORM TILE TREE
******************************/

var tileTree = function (positionX, positionY, width, height) {
    this.x = positionX;
    this.y = positionY;
    this.width = width;
    this.height = height;
    this.wiggle = false;
    this.sections = [];
    this.numOfSections = 3;
    this.fixedLength = 20;
    this.loop = 0;
    this.init = function () {
        for (var i = 0; i < this.numOfSections; i++) {
            this.sections[i] = 0;
        }
    };
    this.init();
}

tileTree.prototype.drawLeafOnGrass = function () {
    context.save();

    context.fillStyle = colorPalette.treeLeaf;
    var step = this.fixedLength / this.numOfSections;
    var i = 2;
    context.rotate(this.sections[i]);
    context.beginPath();
    context.arc(-(this.numOfSections - i), -step * i, 10 - (i / 3), 0, Math.PI * 2, true);
    context.fill();
    context.restore();
}

tileTree.prototype.drawGrass = function () {
    context.save();
    // set the location of the grass
    context.translate(this.x, this.y);
    // Set the dimension of the grass
    context.scale(this.width, this.height);
    context.save();

    context.restore();
    context.save();
    context.fillStyle = colorPalette.treeTrunk;
    context.beginPath();
    var step = this.fixedLength / this.numOfSections;
    for (var i = 0; i < this.numOfSections; i++) {
        context.rotate(this.sections[i]);
        context.lineTo(-(this.numOfSections - i), -step * i);
    }

    for (var i = this.numOfSections - 2; i >= 0; i--) {
        context.rotate(-this.sections[i]);
        context.lineTo((this.numOfSections - i), -step * i);
    }
    context.fill();
    context.restore();

    this.drawLeafOnGrass();
    context.restore();
};


tileTree.prototype.update = function () {
    var i;
    for (i = 0; i < this.numOfSections; i++) {
        this.sections[i] = Math.sin((this.loop - (i * (50 / this.numOfSections))) / 20) / this.numOfSections;
    }
    this.loop = (this.loop + 1) % (Math.PI * 360);
};


/*******************
	   FLUID
*******************/


// Spring object is used by fluid object to simulate the wave effect
function Spring(springID) {
    this.id = springID;
    this.p = 0; // height of the string
    this.v = 0; // velocity of the string contraction
    this.update = function (damp, tens) {
        this.v += (-tens * this.p - damp * this.v);
        this.p += this.v;

    }
}


var fluid = function (positionX, positionY, width, height) {
    this.x = positionX;
    this.y = positionY;
    this.springs = [];
    this.numOfSprings = 200;
    this.width = width;
    this.height = height;
    this.color = colorPalette.teleporterBeam;
    this.waterSurfaceToFluidObjectTopOffset = 0;
    this.init = function () {
        for (var i = 0; i < this.numOfSprings; i++) {
            var stringPositionX = i * (this.width / this.numOfSprings) + this.x;
            var stringPositionY = this.waterSurfaceToFluidObjectTopOffset + this.y;
            this.springs[i] = new Spring(i);
        }
    }

    this.init();
}

fluid.prototype.rainningEffect = function (rainIntensity, waveIntensity) {
    if (Math.random() > (1 - rainIntensity))
        this.springs[Math.floor(Math.random() * this.numOfSprings)].p = waveIntensity;
}

fluid.prototype.triggerWave = function (waveID, waveHeight) {
    this.springs[waveID].p = waveHeight;
}

fluid.prototype.updateSprings = function (spread) {
    for (var i = 0; i < this.numOfSprings; i++) {
        this.springs[i].update(0.02, 0.1);
    }

    var leftDeltas = [],
        rightDeltas = [];

    for (var t = 0; t < 8; t++) {

        for (var i = 0; i < this.numOfSprings; i++) {
            if (i > 0) {
                leftDeltas[i] = spread * (this.springs[i].p - this.springs[i - 1].p);
                this.springs[i - 1].v += leftDeltas[i];
            }
            if (i < this.numOfSprings - 1) {
                rightDeltas[i] = spread * (this.springs[i].p - this.springs[i + 1].p);
                this.springs[i + 1].v += rightDeltas[i];
            }
        }

        for (var i = 0; i < this.numOfSprings; i++) {
            if (i > 0)
                this.springs[i - 1].p += leftDeltas[i];
            if (i < this.numOfSprings - 1)
                this.springs[i + 1].p += rightDeltas[i];
        }

    }

}

fluid.prototype.renderWaves = function () {
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(0 + this.x, this.height + this.y);
    var springDistance = this.width / this.numOfSprings;
    // connecting waves on top
    for (var i = 0; i < this.numOfSprings; i++) {
        context.lineTo((i * springDistance) + this.x, (this.waterSurfaceToFluidObjectTopOffset + this.springs[i].p) + this.y);
    }

    context.lineTo(this.width + this.x + 0.2, this.y); // offset

    // connecting waves on bottom
    context.lineTo(this.width + this.x, this.height + this.y);
    for (var i = 0; i < this.numOfSprings; i++) {
        context.lineTo((this.width - (i * springDistance)) + this.x, (this.height - (this.waterSurfaceToFluidObjectTopOffset + this.springs[i].p)) + this.y);
    }

    context.fill();
}

// The overall Update Function for fluid
fluid.prototype.update = function () {
    this.updateSprings(0.5);
    this.rainningEffect(0.05, 50);
    this.renderWaves();
}


/**************************
    INPUT CONTROL
**************************/
var Input = {
    pressedKey: {},

    key: {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    },

    init: function () {
        window.addEventListener('keyup', function (event) {
            Input.onKeyup(event);
            event.preventDefault(); // prevents the windows from scrolling due to arrow keys when playing the game
        }, true);
        window.addEventListener('keydown', function (event) {
            Input.onKeydown(event);
            event.preventDefault();
        }, true);
    },

    isDown: function (keyCode) {
        return this.pressedKey[keyCode];
    },

    onKeydown: function (event) {
        this.pressedKey[event.keyCode] = true;
    },

    onKeyup: function (event) {
        delete this.pressedKey[event.keyCode];
    }
};

Input.init();




/**************************
      HELPER FUNCTIONS
**************************/

// Helper Function for Updating the Player, it checks which side of entityB is entityA collides on
function collisionDetection(entityA, entityB) {
    var collisionDirectionAtoB = null;
    var vX = (entityA.x + (entityA.width / 2)) - (entityB.x + (entityB.width / 2));
    var vY = (entityA.y + (entityA.height / 2)) - (entityB.y + (entityB.height / 2));
    var collisionWidth = (entityA.width / 2) + (entityB.width / 2);
    var collisionHeight = (entityA.height / 2) + (entityB.height / 2);
    // Check shape overlapping
    if (Math.abs(vX) < collisionWidth && Math.abs(vY) < collisionHeight) {
        var oX = collisionWidth - Math.abs(vX);
        var oY = collisionHeight - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                collisionDirectionAtoB = "t";
                entityA.y += oY;
            } else {
                collisionDirectionAtoB = "b";
                entityA.y -= oY;
            }
        } else {
            if (vX > 0) {
                collisionDirectionAtoB = "l";
                entityA.x += oX;
            } else {
                collisionDirectionAtoB = "r";
                entityA.x -= oX;
            }
        }
    }
    return collisionDirectionAtoB;
}

/*************************
	INITIALIZE VARIABLES
*************************/
var totalNumOfGoals = 0;
var numOfCollectedGoals = 0;
var tileDimension = 60;
var friction = 0.8;
var gravity = 0.7;
var goals = [];
var platformTiles = [];
var water = [];
//player param:  (positionX, positionY, width, height, movingSpeed, jumpingSpeed) {
var player = new player(5, height - 70, 20, 20, 10, 10);


/********************
	ANIMATION LOOP
*********************/
if (!window.requestAnimFrame) {
    window.requestAnimFrame = (function () {
        return (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    })();
}

function loop() {
    context.clearRect(0, 0, width, height);
    update();
    requestAnimFrame(function () {
        loop();
    });
}

/*****************
	INITIALIZE
******************/

function init() {
    loop();
}

/*********************
	START THE GAME
*********************/
window.onload = function () {
    console.log("All elements are loaded!");
    init();
}

/*****************
	  UPDATE
******************/
function update() {
    player.updatePlayer();
    player.drawPlayer();

    drawAllWater();
    drawAllPlatforms(); // draw the platform, as well as update the platform grass

    detectingWinning();
}

function detectingWinning() {
    //    console.log("Total Number of Stars: " + totalNumOfGoals);
    //    console.log("Number of Stars Collected: " + numOfCollectedGoals);
    if (totalNumOfGoals === numOfCollectedGoals) {
        alert("Congrats! You Won!");
        window.location.reload();
    }
}

function drawAllPlatforms() {
    for (var i = 0; i < platformTiles.length; i++) {

        platformTiles[i].drawPlatformTile();

        platformTiles[i].updatePlatformTile();
    }
}

function drawAllWater() {
    for (var i = 0; i < water.length; i++) {
        water[i].update();
    }
}
