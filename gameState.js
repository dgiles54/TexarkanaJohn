var map;
var layerWall, layerPlatforms, layerLadders, layerDetails;
//var mapLayers, layer;
var player, health = 5,
    attackRate = 200,
    nextAttack = 0,
    playerAttacking = false;
var cursors, useKey, attackKey;
var keyInventory, endDoor, snake, snakes;
var levers, plates, keys, keyholes, doors, darts;
var keyCreated = false;
var hintText, inventory, healthBar;
var hasKey = false,
    switchTriggered = false,
    blowdartCreated = false;
var leverSound, plateSound;
var attackAnim;
var levelNum = 2;

var gameState = {

    preload: function () {

        game.load.tilemap('level1', 'assets/tilemaps/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'assets/tilemaps/Level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tilesets/tileset.png');
        game.load.spritesheet('healthBar', 'assets/sprites/health.png', 320, 64);
        game.load.spritesheet('player', 'assets/sprites/player.png', 78, 66);
        game.load.spritesheet('snake', 'assets/sprites/snake.png', 96, 48,3);
        game.load.spritesheet('lever', 'assets/sprites/lever.png', 32, 32, 2);
        game.load.image('lever', 'assets/sprites/lever.png');
        game.load.image('pressurePlate', 'assets/sprites/pressurePlate.png');
        game.load.image('key', 'assets/sprites/key.png');
        game.load.image('keyHole', 'assets/sprites/keyHole.png');
        game.load.image('door', 'assets/sprites/door.png');
        game.load.image('blowdart', 'assets/sprites/blowdart.png');
        game.load.audio('leverSound', 'assets/audio/lever.wav');
        game.load.audio('plateSound', 'assets/audio/pressure_plate.wav');


    },


    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#787878';

        // map level loader      
        loadLevel(levelNum);

        // set map collisions
        map.setCollisionBetween(1, 10, true, 'Wall');
        map.setCollisionBetween(1, 15, true, 'Platforms');
        

        // add game objects
        levers = game.add.group();
        levers.enableBody = true;
        map.createFromObjects('Levers', 26, 'lever', 0, true, false, levers);
        plates = game.add.group();
        plates.enableBody = true;
        map.createFromObjects('Plates', 27, 'pressurePlate', 0, true, false, plates);
        keys = game.add.group();
        keys.enableBody = true;
        map.createFromObjects('Keys', 28, 'key', 0, true, false, keys);
        keys.visible = false;
        keyholes = game.add.group();
        keyholes.enableBody = true;
        map.createFromObjects('Keyholes', 29, 'keyHole', 0, true, false, keyholes);
        doors = game.add.group();
        doors.enableBody = true;
        map.createFromObjects('Doors', 30, 'door', 0, true, false, doors);
        game.physics.enable(doors);
        doors.setAll('body.immovable', true);
        darts = game.add.group();
        darts.enableBody = true;
        map.createFromObjects('Darts', 31, 'blowdart', 0, true, false, darts);
        
        


        //door = game.add.sprite(700, 125, 'door');
        //game.physics.enable(door);
        //door.body.immovable = true;
        //door.body.setSize(50, 160, 30, 0);
        endDoor = game.add.sprite(750, 125, 'door');
        game.physics.enable(endDoor);
        endDoor.visible = false;

        //snake = game.add.sprite(100, 420, 'snake');
       
        //game.physics.enable(snakes);
        //snakes.callAll('physics.enable','physics');
        //snakes.callAll('animations.play','animations','move');
        //snake.scale.setTo(0.75,0.75);
        //snakes.body.velocity.x = 100;
        //snakes.callAll('body.velocity.x',null,'100');
        

        // player
        player = game.add.sprite(300, 300, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player);
        player.body.gravity.y = 800;
        player.body.bounce.y = 0.1;
        player.body.drag.x = 2000;
        player.body.collideWorldBounds = true;
        player.animations.add('walk', [0, 1, 2, 3, 4, 5], 7, true);
        player.animations.add('idle', [6, 7], 2, true);
        attackAnim = player.animations.add('attack', [8, 9, 10, 11], 12, false);
        attackAnim.onComplete.add(function () {
            player.frame = 2;
        })
        player.body.setSize(40, 64, 15, 0);

        // game camera
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        // controls
        cursors = game.input.keyboard.createCursorKeys();
        useKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        attackKey.onDown.add(attack);

        // HUD
        hintText = game.add.text(250, 500, 'Find the key to the locked door.', {
            fontSize: '32px',
            fill: '#000'
        });
        hintText.fixedToCamera = true;
        inventory = game.add.text(330, 10, 'INVENTORY', {
            fontSize: '32px',
            fill: '#000'
        });
        inventory.fixedToCamera = true;
        healthBar = game.add.sprite(5, 5, 'healthBar');
        healthBar.fixedToCamera = true;

        // sound FX
        leverSound = game.add.audio('leverSound');
        plateSound = game.add.audio('plateSound');
        
       
       initializeSnakes(); 
    },

    update: function () {
        
        snakes.callAll('animations.play','animations','move');

        game.physics.arcade.collide(player, layerWall);
        game.physics.arcade.collide(player, layerPlatforms);
        game.physics.arcade.collide(player, layerLadders);
        game.physics.arcade.collide(player, doors);
        game.physics.arcade.overlap(player, levers, pushLever);
        game.physics.arcade.overlap(player, keys, takeKey);
        game.physics.arcade.overlap(player, keyholes, insertKey);
        
        game.physics.arcade.collide(snakes, layerCollision);
        game.physics.arcade.collide(snakes, layerCollision2);

        // allow player to climb ladders
        map.setTileIndexCallback(14, playerLadderClimb, null, layerLadders);
        map.setTileIndexCallback(19, snakeReverse, null, layerCollision);
        map.setTileIndexCallback(20, snakeReverse2, null, layerCollision2);

        player.body.gravity.y = 800;

        hintText.text = "Find the key to the locked door.";
        
        //snake.animations.play('move');

        // make player walk
        if (cursors.left.isDown) {
            player.scale.setTo(-1, 1);
            player.animations.play('walk');
            player.body.velocity.x = -200;
        } else if (cursors.right.isDown) {
            player.scale.setTo(1, 1);
            player.animations.play('walk');
            player.body.velocity.x = 200;
        } else {
            player.animations.stop('walk', 2);
            player.body.velocity.x = 0;
        }

        // make player jump
        if (cursors.up.isDown && player.body.onFloor()) {
            player.body.velocity.y = -200;
        }


        if (blowdartCreated == true) {

            if (player.overlap(blowdart)) {

                healthBar.frame += 1;
                health -= 1;
                blowdart.kill();
                blowdartCreated = false;
                if (health == 0) {
                    game.state.start('gameOverState');
                }
            }
        }


        if (player.overlap(keys) && keyCreated == true) {
            hintText.text = "Press 'e' to pickup item.";
        }

        if (player.overlap(keyholes)) {
            hintText.text = "Use the key to open the door.";
        }

        // when player reaches end of level, go to next level or win state if last level
        if (player.overlap(endDoor)) {
            levelNum++;
            game.state.start('gameState');
        }
    }
};

function shootDart() {

    if (blowdartCreated == false) {
        blowdart = game.add.sprite(800, 400, 'blowdart');
        game.physics.enable(blowdart);
        blowdart.body.velocity.x = -300;
        blowdartCreated = true;
        plateSound.play();
    }
    if (blowdartCreated == true) {
        if (blowdart.x < 0) {
            blowdart.kill();
            blowdartCreated = false;
        }


    }
}

function playerLadderClimb() {
    if (cursors.up.isDown) {
        player.body.velocity.y = -100;
    }

}

function attack() {
    if (game.time.now > nextAttack) {
        nextAttack = game.time.now + attackRate;
        player.animations.play('attack');
        console.log('Attacking');
        snakes.forEach(function(snake) {
            if(player.overlap(snake)){
                snake.kill();
            }
        });
    }
}

function loadLevel(levelNum) {
    map = game.add.tilemap('level' + levelNum);
    map.addTilesetImage('tileset');

    layerWall = map.createLayer('Wall');
    layerPlatforms = map.createLayer('Platforms');
    layerDetails = map.createLayer('Detail');
    layerLadders = map.createLayer('Ladder');
    layerCollision = map.createLayer('Collision');
    layerCollision2 = map.createLayer('Collision2');
    layerWall.resizeWorld();
}

function pushLever(player, lever) {
    if (player.overlap(lever) && useKey.isDown) {
        lever.frame = 1;
        leverSound.play();
        keys.visible = true;
        keyCreated = true;

    }
}

function takeKey(player, key) {
    if (keyCreated) {
        hintText.text = "Press 'e' to pickup item.";
    }


    if (useKey.isDown && hasKey == false) {
        key.kill();
        keyInventory = game.add.sprite(350, 50, 'key');
        keyInventory.fixedToCamera = true;
        hasKey = true;
    }
}

function insertKey(player, keyhole) {
    if (hasKey == true && useKey.isDown) {
        doors.killAll(); // temporary
        keyInventory.kill();
    }
}

function snakeReverse(snake){
    
    snake.scale.setTo(-1,1);
    snake.body.velocity.x = -100;
}

function snakeReverse2(snake){
    
    snake.scale.setTo(1,1);
    snake.body.velocity.x = 100;
}

function initializeSnakes(){
    snakes = game.add.group();
        snakes.enableBody = true;
        map.createFromObjects('Snakes',33,'snake',0,true,false,snakes);
     snakes.forEach(function(snake) {
            snake.body.velocity.x = 100;
            snake.anchor.setTo(0.7,0);
        });
    map.setCollision(19);
        map.setCollision(20);
     snakes.callAll('animations.add', 'animations', 'move',null,5,true);
}
