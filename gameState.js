var PLAYER_ATTACK_RATE = 200;
var PLAYER_RUN_SPEED = 200;
var PLAYER_JUMP_SPEED = 300;
var PLAYER_GRAVITY = 800;
var PLAYER_BOUNCE = 0.1;
var PLAYER_DRAG = 0;
var SNAKE_ATTACK_RATE = 600;

var map;
var startPointX, startPointY, endPoint;
var layerWall, layerPlatforms, layerLadders, layerDetails, layerFaces, layerCollisions, endingLayer, layerSpikes, layerLava;
var player,
    health = 5,
    nextAttackPlayer = 0,
    playerAttacking = false,
    playerClimbing = false;
var cursors, useKey, attackKey;
var keyInventory, endDoor, snake, snakes;
var levers, plates, keys, keyholes, doors, darts, door, f_platforms;
var keyCreated = false;
var hintText, inventory, healthBar;
var hasKey = false,
    switchTriggered = false,
    blowdartCreated = false;
var leverSound, plateSound;
var attackAnim;
var levelNum = 3;
var snakeDirection = 'right',
    nextAttackSnake = 0;

var gameState = {

    preload: function () {

        game.load.tilemap('level1', 'assets/tilemaps/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'assets/tilemaps/Level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3', 'assets/tilemaps/Level3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level4', 'assets/tilemaps/Level4.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tilesets/tileset.png');
        game.load.spritesheet('healthBar', 'assets/sprites/health.png', 160, 32);
        game.load.spritesheet('player', 'assets/sprites/player.png', 78, 66);
        game.load.spritesheet('snake', 'assets/sprites/snake.png', 96, 48);
        game.load.spritesheet('f_block', 'assets/sprites/fall_block.png', 32, 32, 3, 0, 1);
        game.load.spritesheet('lever', 'assets/sprites/lever.png', 32, 32);
        game.load.image('pressurePlate', 'assets/sprites/pressurePlate.png');
        game.load.image('key', 'assets/sprites/key.png');
        game.load.image('keyHole', 'assets/sprites/keyHole.png');
        game.load.image('door', 'assets/sprites/door.png');
        game.load.image('blowdart', 'assets/sprites/blowdart.png');
        game.load.audio('leverSound', 'assets/audio/lever.wav');
        game.load.audio('plateSound', 'assets/audio/pressure_plate.wav');
        game.load.audio('ouch', 'assets/audio/ouch.wav');

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
        map.setCollisionBetween(19, 20, true, 'Collisions');
        map.setCollisionBetween(21, 21, true, 'Spikes');
        map.setCollisionBetween(22, 23, true, 'Lava');
        map.setCollision(24, true, 'EndPoint');

        layerCollisions.visible = false;
        endPoint.visible = false;

        // SNAKES
        initializeSnakes();

        // FALLING PLATFORMS


        // PLAYER
        player = game.add.sprite(startPointX, startPointY, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player);
        player.body.gravity.y = PLAYER_GRAVITY;
        player.body.bounce.y = PLAYER_BOUNCE;
        player.body.drag.x = PLAYER_DRAG;
        player.body.collideWorldBounds = true;
        player.animations.add('walk', [0, 1, 2, 3, 4, 5], 7, true);
        player.animations.add('idle', [6, 7], 2, true);
        attackAnim = player.animations.add('attack', [8, 9, 10, 11], 12, false);
        attackAnim.onComplete.add(function () {
            player.frame = 2;
        });
        player.animations.add('climb', [12, 13, 14, 13], 5, true);
        player.body.setSize(20, 44, 15, 20);
        player.scale.setTo(-1, 1);

        // GAME CAMERA
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        // CONTROLS
        cursors = game.input.keyboard.createCursorKeys();
        useKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        attackKey.onDown.add(attack);

        // HUD
        hintText = game.add.text(0, 0, 'Find the key to the locked door.', {
            fontSize: '32px',
            fill: '#000',
            boundsAlignH: 'center',
            boundsAlignV: 'bottom'
        });
        hintText.setTextBounds(0, 0, game.width, game.height);
        hintText.fixedToCamera = true;

        healthBar = game.add.sprite(5, 5, 'healthBar');
        healthBar.fixedToCamera = true;

        // SOUND FX
        leverSound = game.add.audio('leverSound');
        plateSound = game.add.audio('plateSound');
        loseHealthSound = game.add.audio('ouch');
    },

    update: function () {
        // for that ladder physics when gravity = 0
        player.body.gravity.y = PLAYER_GRAVITY;

        snakes.callAll('animations.play', 'animations', 'move');

        game.physics.arcade.collide(player, layerWall);
        game.physics.arcade.collide(player, layerPlatforms);
        game.physics.arcade.collide(player, layerLadders);
        game.physics.arcade.collide(player, doors);
        game.physics.arcade.collide(player, endPoint, nextLevel);
        game.physics.arcade.overlap(player, levers, pushLever);
        game.physics.arcade.overlap(player, keys, takeKey);
        game.physics.arcade.overlap(player, keyholes, insertKey);
        game.physics.arcade.collide(player, snakes, dmgPlayer);
        game.physics.arcade.collide(player, layerLava);
        game.physics.arcade.collide(player, layerSpikes);
        game.physics.arcade.collide(snakes, layerCollisions);
        game.physics.arcade.collide(player, f_platforms, startCrumbleTimer);

        // kill players with insta-death things
        map.setTileIndexCallback(21, resetLevel, null, layerSpikes);
        map.setTileIndexCallback([22, 23], resetLevel, null, layerLava);

        // allow player to climb ladders
        map.setTileIndexCallback(14, playerLadderClimb, null, layerLadders);

        // so snakes don't fall off platform
        map.setTileIndexCallback(19, snakeReverse, null, layerCollisions);
        map.setTileIndexCallback(20, snakeReverse2, null, layerCollisions);

        // winning game location
        map.setTileIndexCallback(24, gameWin, null, endingLayer);

        hintText.text = "Find the key to the locked door.";

        // falling blocks happen
        f_platforms.forEach(function(f_block) { crumbleBlock(f_block); });

        // make player walk
        if (attackKey.isDown) {
            player.body.velocity.x = 0;
        } else if (cursors.left.isDown) {
            player.scale.setTo(-1, 1);
            player.animations.play('walk');
            player.body.velocity.x = -PLAYER_RUN_SPEED;
        } else if (cursors.right.isDown) {
            player.scale.setTo(1, 1);
            player.animations.play('walk');
            player.body.velocity.x = PLAYER_RUN_SPEED;
        } else {
            player.animations.stop('walk', 2);
            player.body.velocity.x = 0;
        }

        // make player jump
        if (cursors.up.justDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -PLAYER_JUMP_SPEED;
        }

        // if health reaches 0, game over
        if (health == 0) {
            game.state.start('gameOverState');
        }

        if (blowdartCreated == true) {

            if (player.overlap(blowdart)) {

                healthBar.frame += 1;
                health -= 1;
                blowdart.kill();
                blowdartCreated = false;
            }
        }


        if (player.overlap(keys) && keyCreated == true) {
            hintText.text = "Press 'e' to pickup item.";
        }

        if (player.overlap(keyholes)) {
            hintText.text = "Use the key to open the door.";
        }

        // when player reaches end of level, go to next level or win state if last level
        //        if (player.overlap(door)) {
        //            levelNum++;
        //            game.state.start('gameState');
        //        }
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
    // allows for player to wait on ladder
    player.body.gravity.y = 0;

    if (cursors.up.isDown) {
        player.body.velocity.y = -100;
        playerClimbing = true;
        player.animations.play('climb');
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
        playerClimbing = true;
        player.animations.play('climb');
    } else {
        player.body.velocity.y = 0; // stops player on ladder
        playerClimbing = false;
        player.animations.stop('climb', 12);
    }

}

function attack() {
    if (game.time.now > nextAttackPlayer) {
        nextAttackPlayer = game.time.now + PLAYER_ATTACK_RATE;
        player.animations.play('attack');
        console.log('Attacking');
        snakes.forEach(function (snake) {
            if (player.overlap(snake)) {
                snake.kill();
            }
        });
    }
}

function loadLevel(levelNum) {
    map = game.add.tilemap('level' + levelNum);
    map.addTilesetImage('tileset');

    layerWall = map.createLayer('Wall');

    doors = game.add.group();
    doors.enableBody = true;
    map.createFromObjects("Door", 32, 'door', 0, true, false, doors);
    doors.setAll('body.immovable', true);
    doors.setAll('outOfBoundsKill', true);

    layerLava = map.createLayer('Lava');
    layerPlatforms = map.createLayer('Platforms');
    layerDetails = map.createLayer('Details');
    layerLadders = map.createLayer('Ladders');
    layerCollisions = map.createLayer('Collisions');
    layerFaces = map.createLayer('Faces');
    layerSpikes = map.createLayer('Spikes');
    endPoint = map.createLayer('EndPoint');
    layerWall.resizeWorld();

    levers = game.add.group();
    levers.enableBody = true;
    map.createFromObjects('Lever', 33, 'lever', 0, true, false, levers);
    levers.setAll('anchor.setTo', 0.5, 0.5);

    keys = game.add.group();
    keys.enableBody = true;
    map.createFromObjects('Key', 32, 'key', 0, true, false, keys);
    keys.setAll('visible', false);
    keyholes = game.add.group();
    keyholes.enableBody = true;
    map.createFromObjects('Keyhole', 33, 'keyHole', 0, true, false, keyholes);

    f_platforms = game.add.group();
    f_platforms.enableBody = true;
    map.createFromObjects('F_Platforms', 33, 'f_block', 0, true, false, f_platforms);
    f_platforms.setAll('body.immovable', true);
    f_platforms.forEach(function(f_block) { f_block.animations.add('crumble', [1, 2], 3, true); f_block.activated = false; f_block.deathTime = null;})

    startPointX = map.objects['StartPoint'][0].x;
    startPointY = map.objects['StartPoint'][0].y;
}

function pushLever(player, lever) {
    var leverID = parseInt(lever.name.charAt(5)) - 1;
    console.log(leverID);
    if (map.objects['Lever'][leverID].type == "unlock_key") {
        if (useKey.justDown) {
            lever.frame = 1;
            leverSound.play();
            keys.children[leverID].visible = true;
            keyCreated = true;
        }
    }
    if (map.objects['Lever'][leverID].type == "unlock_door") {
        if (useKey.justDown) {
            console.log('unlocking door');
            lever.frame = 1;
            leverSound.play();
            doors.children[leverID].body.gravity.y = -300;
        }
    }
}

function takeKey(player, key) {
    if (useKey.isDown && hasKey == false) {
        key.kill();
        keyInventory = game.add.sprite(game.width / 2, 0, 'key');
        keyInventory.anchor.setTo(0.5, 0);
        keyInventory.fixedToCamera = true;
        hasKey = true;
        keyCreated = false;
    }
}

function insertKey(player, keyhole) {
    var keyholeID = parseInt(keyhole.name.charAt(7)) - 1; // to match with doorID
    if (hasKey == true && useKey.isDown) {
        // open door that matches specific keyhole
        doors.children[keyholeID].body.gravity.y = -300;
        keyInventory.kill();
        hasKey = false;
    }
}

function snakeReverse(snake) {

    snake.scale.setTo(-1, 1);
    snake.body.velocity.x = -100;
    snakeDirection = 'left';
}

function snakeReverse2(snake) {

    snake.scale.setTo(1, 1);
    snake.body.velocity.x = 100;
    snakeDirection = 'right';
}

function initializeSnakes() {
    snakes = game.add.group();
    snakes.enableBody = true;
    map.createFromObjects('Snakes', 33, 'snake', 0, true, false, snakes);
    snakes.forEach(function (snake) {
        snake.body.velocity.x = 100;
        snake.anchor.setTo(0.5, 0);
        snake.body.immovable = true;
        snake.body.setSize(90, 15, 3, 33);
        snake.body.bounce.x = 1;
    });
    map.setCollision(19);
    map.setCollision(20);
    snakes.callAll('animations.add', 'animations', 'move', null, 5, true);
    snakes.setAll('body.collideWorldBounds', true);
}

function dmgPlayer(player, snake) {
    if (game.time.now > nextAttackSnake) {
        nextAttackSnake = game.time.now + SNAKE_ATTACK_RATE;
        healthBar.frame += 1;
        health -= 1;
        loseHealthSound.play();
        if (player.body.touching.left) {
            player.body.velocity.x = 10000;
            player.body.acceleration.x = 10000;
            player.body.velocity.y = -200;
        } else if (player.body.touching.right) {
            player.body.velocity.x = -10000;
            player.body.acceleration.x = -10000;
            player.body.velocity.y = -200;
        } else {
            player.body.velocity.y = -200;
        }
    }
    player.body.velocity.x = 0;
    player.body.acceleration.x = 0;
}

function startCrumbleTimer(player, f_block) {
    // start timer
    if (!f_block.activated) {
        f_block.deathTime = game.time.now + 2000;
        f_block.activated = true;
    }
}

function crumbleBlock(f_block) {
     if (f_block.activated) {
        // check timer
        if (game.time.now > f_block.deathTime + 500) {
            f_block.exists = false;
        } else if (game.time.now > f_block.deathTime) {
            // trigger animation
            f_block.animations.play('crumble');
        }
    }
}

function resetLevel() {
    game.state.start(game.state.current);
}

function nextLevel() {
    levelNum++;
    game.state.start(game.state.current);
}

function gameWin() {
    game.state.start('gameWinState');
}
