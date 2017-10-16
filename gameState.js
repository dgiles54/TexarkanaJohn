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
var keyInventory, endDoor, snake, snakes, spider, spiderSpawners, spiderWebs, spiderWeb;
var levers, plates, keys, keyholes, doors, darts, door, f_platforms, rockSpawners, boulders, torches, darts;
var keyCreated = false;
var hintText, inventory, healthBar;
var hasKey = false,
    switchTriggered = false,
    blowdartCreated = false;
var leverSound, plateSound;
var attackAnim;
var levelNum = 1,
    maxLevels = 6;
var snakeDirection = 'right',
    nextAttackSnake = 0;
var LIGHT_RADIUS = 100,
    GLOW_RADIUS = 75,
    shadowTexture;
var playerTorch, holdingTorch = false;
var smokeEmitter;

var gameState = {

    preload: function () {

        game.load.tilemap('level1', 'assets/tilemaps/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'assets/tilemaps/Level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3', 'assets/tilemaps/Level3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level4', 'assets/tilemaps/Level5.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level5', 'assets/tilemaps/Level4.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level6', 'assets/tilemaps/Level6.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level7', 'assets/tilemaps/Level7.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tilesets/tileset.png');
        game.load.spritesheet('healthBar', 'assets/sprites/health.png', 160, 32);
        game.load.spritesheet('player', 'assets/sprites/player.png', 78, 66);
        game.load.spritesheet('playerTorch', 'assets/sprites/player_torch.png', 78, 66);
        game.load.spritesheet('snake', 'assets/sprites/snake2.png', 96, 48);
        game.load.spritesheet('f_block', 'assets/sprites/fall_block.png', 32, 32, 3, 0, 1);
        game.load.spritesheet('leverL', 'assets/sprites/lever_left.png', 32, 32);
        game.load.spritesheet('leverR', 'assets/sprites/lever_right.png', 32, 32);
        game.load.spritesheet('rockSpawner', 'assets/sprites/snakehead4-sheet.png', 64, 64);
        game.load.spritesheet('boulderBroken', 'assets/sprites/boulderBroken.png', 64, 64, 3);
        game.load.spritesheet('smokeParticles', 'assets/sprites/smokeParticles.png', 1, 1);
        game.load.spritesheet('torch', 'assets/sprites/torch.png', 10, 23);
        game.load.spritesheet('spider', 'assets/sprites/spider.png', 72, 48,6);
        game.load.spritesheet('spiderWeb', 'assets/sprites/spiderWeb.png', 128, 128);
        game.load.image('pressurePlate', 'assets/sprites/pressurePlate.png');
        game.load.image('key', 'assets/sprites/key.png');
        game.load.image('keyHole', 'assets/sprites/keyHole.png');
        game.load.image('door', 'assets/sprites/door.png');
        game.load.image('boulder', 'assets/sprites/boulder.png');
        game.load.image('blowdart', 'assets/sprites/blowdart.png');
        game.load.audio('leverSound', 'assets/audio/lever.wav');
        game.load.audio('plateSound', 'assets/audio/pressure_plate.wav');
        game.load.audio('ouch', 'assets/audio/ouch.wav');
        game.load.bitmapFont('blocktopia', 'assets/fonts/blocktopia.png', 'assets/fonts/blocktopia.xml');
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

        // PLAYER
        player = game.add.sprite(startPointX, startPointY, 'player');
        player.anchor.setTo(0.33, 0.5);
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
        player.animations.add('holdingTorch', [15, 16, 17, 18, 19, 20], 7, true);
        player.body.setSize(20, 44, 15, 20);
        player.scale.setTo(1, 1);

        // GAME CAMERA
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        // CONTROLS
        cursors = game.input.keyboard.createCursorKeys();
        useKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        attackKey.onDown.add(attack);
        torchKey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        torchKey.onDown.add(toggleTorch);

        // LIGHTING
        playerTorch = game.add.sprite(player.x, player.y, 'playerTorch');
        playerTorch.anchor.setTo(0.33, 0.5);
        playerTorch.visible = false;

        // Create shadow texture
        shadowTexture = game.add.bitmapData(map.widthInPixels, map.heightInPixels);

        // Create object that uses bitmap as texture
        var lightSprite = game.add.image(0, 0, shadowTexture);

        // Set blend mode to multiply
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

        // HUD
        hintText = game.add.bitmapText(game.width / 2, game.height - 16, 'blocktopia', 'Find the key to the locked door.', 32);
        hintText.anchor.set(0.5, 0.5);
        hintText.alpha = 0.6;
        // {
        // fontSize: '32px',
        // fill: '#fff',
        // boundsAlignH: 'center',
        // boundsAlignV: 'bottom',
        // });
        // hintText.setTextBounds(0, 0, game.width, game.height);
        hintText.fixedToCamera = true;

        healthBar = game.add.sprite(5, 5, 'healthBar');
        healthBar.fixedToCamera = true;
        healthBar.frame = 5 - health;

        // SOUND FX
        leverSound = game.add.audio('leverSound');
        plateSound = game.add.audio('plateSound');
        loseHealthSound = game.add.audio('ouch');

        //timer for boulder spawns
        timer = game.time.create(false);
        timer.loop(3000, rockSpawn, this);
        timer.start();

        // boulder group
        boulders = game.add.group();
        boulders.enableBody = true;
        //boulders.callAll('animations.add','animations','break',3,2,false);
        
        //spider group
        spiders = game.add.group();

    },

    update: function () {
        
//        spiders.forEach(function(spider){
//            
//            game.debug.body(spider);
//        });
        // for that ladder physics when gravity = 0
        player.body.gravity.y = PLAYER_GRAVITY;
        playerClimbing = false;

        snakes.callAll('animations.play', 'animations', 'move');
        hintText.text = "Find the key to the locked door.";

        game.physics.arcade.collide(player, layerWall);
        game.physics.arcade.collide(player, layerPlatforms);
        game.physics.arcade.collide(spiders, layerPlatforms);
        game.physics.arcade.collide(player, layerLadders);
        game.physics.arcade.collide(player, doors);
        game.physics.arcade.collide(player, endPoint, nextLevel);
        game.physics.arcade.overlap(player, levers, pushLever);
        game.physics.arcade.overlap(player, keys, takeKey);
        game.physics.arcade.overlap(player, keyholes, insertKey);
        game.physics.arcade.overlap(player, plates, shootDart);
        game.physics.arcade.overlap(player, spiderWebs, burnWeb);        
        game.physics.arcade.overlap(player, snakes, dmgPlayer);
        game.physics.arcade.overlap(player, spiders, dmgPlayer);
        game.physics.arcade.overlap(player, darts, dmgPlayer);
        game.physics.arcade.collide(player, layerLava);
        game.physics.arcade.collide(player, layerSpikes);
        game.physics.arcade.collide(snakes, layerCollisions);
        game.physics.arcade.collide(spiders, layerCollisions);
        game.physics.arcade.collide(player, f_platforms, startCrumbleTimer);
        game.physics.arcade.collide(player, spiderSpawners, initializeSpider);
        game.physics.arcade.collide(boulders, layerPlatforms, killBoulder);
        game.physics.arcade.overlap(boulders, player, boulderDmgPlayer);

        // kill players with insta-death things
        map.setTileIndexCallback(21, resetLevel, null, layerSpikes);
        map.setTileIndexCallback([22, 23], resetLevel, null, layerLava);

        // allow player to climb ladders
        map.setTileIndexCallback(14, climbLadder, null, layerLadders);

        // so snakes don't fall off platform
        map.setTileIndexCallback(19, snakeReverse, null, layerCollisions);
        map.setTileIndexCallback(20, snakeReverse2, null, layerCollisions);
        //map.setTileIndexCallback(14, initializeSpider, null, layerCollisions);

        // winning game location
        map.setTileIndexCallback(24, gameWin, null, endingLayer);

        // LIGHTING
        playerTorch.x = player.x;
        playerTorch.y = player.y;
        updateShadowTexture();

        

        // falling blocks happen
        f_platforms.forEach(function (f_block) {
            crumbleBlock(f_block);
        });

        // make player walk
        if (attackKey.isDown) {
            player.body.velocity.x = 0;
        } else if (cursors.left.isDown) {
            player.scale.setTo(-1, 1);
            playerTorch.scale.setTo(-1, 1);
            if (!playerClimbing && !holdingTorch) {
                player.animations.play('walk');
            } else if (!playerClimbing && holdingTorch) {
                player.animations.play('holdingTorch');
            }
            player.body.velocity.x = -PLAYER_RUN_SPEED;
        } else if (cursors.right.isDown) {
            player.scale.setTo(1, 1);
            playerTorch.scale.setTo(1, 1);
            if (!playerClimbing && !holdingTorch) {
                player.animations.play('walk');
            } else if (!playerClimbing && holdingTorch) {
                player.animations.play('holdingTorch');
            }
            player.body.velocity.x = PLAYER_RUN_SPEED;
        } else {
            if (!playerClimbing && !holdingTorch) {
                player.frame = 0;
            } else if (!playerClimbing && holdingTorch) {
                player.frame = 15;
            }
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

        if (player.overlap(keys) && keyCreated == true) {
            hintText.text = "Press 'e' to pickup item.";
        }

        if (player.overlap(keyholes)) {
            hintText.text = "Use the key to open the door.";
        }
        
        // fix torch on ladder climb
        if (holdingTorch && playerClimbing == true) {
            playerTorch.visible = false;
        } else if (holdingTorch && playerClimbing == false) {
            playerTorch.visible = true;
        }

        // when player reaches end of level, go to next level or win state if last level
        //        if (player.overlap(door)) {
        //            levelNum++;
        //            game.state.start('gameState');
        //        }
        
        
       if(!player.overlap(torches)){
           hintText.text = 'Press "T" to light your torch';
       } 
        
    }
};

function shootDart(player, plate) {
    var plateID = parseInt(plate.name.charAt(5)) - 1;
    if (map.objects['Plates'][plateID].type == 'active') {
        darts.children[plateID].visible = true;
        darts.children[plateID].body.gravity.x = -200;
        plateSound.play();
        map.objects['Plates'][plateID].type = 'inactive';
    }
}

function climbLadder() {
    // guess intention
    // if (cursors.up.justDown || cursors.down.justDown) {
    //     playerClimbing = true;
    // }

    // kill gravity
    if (playerClimbing) {
        player.body.gravity.y = 0;
    }

    // movement/climb
    if (cursors.up.isDown) {
        player.body.velocity.y = -100;
        playerClimbing = true;
        player.animations.play('climb');
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
        playerClimbing = true;
        player.animations.play('climb');
    } else if (cursors.left.isDown || cursors.right.isDown) {
        playerClimbing = false;
    } else { // stops player on ladder
        player.body.velocity.y = 0;
        playerClimbing = true;
        player.animations.stop('climb', 12);
    }
}

function attack() {
    if (game.time.now > nextAttackPlayer) {
        nextAttackPlayer = game.time.now + PLAYER_ATTACK_RATE;
        player.animations.play('attack');
        console.log('Attacking');

        // kill snake
        snakes.forEach(function (snake) {
            if (player.overlap(snake)) {
                snake.kill();
            }
        });

        // kill spider
        spiders.forEach(function (spider) {
            if (player.overlap(spider)) {
                spider.body.velocity.x = 0;
                anim = spider.animations.play('die');
                //spiders.remove(spider);
                spider.body.enable = false;
                anim.killOnComplete = true;
            }
        });
    }
}

function loadLevel(levelNum) {
    keyCreated = false;
    hasKey = false;
    holdingTorch = false;
    blowdartCreated = false;

    map = game.add.tilemap('level' + levelNum);
    map.addTilesetImage('tileset');

    layerWall = map.createLayer('Wall');

    torches = game.add.group();
    map.createFromObjects('Torches', 33, 'torch', 0, true, false, torches);

    torches.forEach(function (torch) {
        torch.anchor.setTo(0.5, 0.05);
        torch.animations.add('fire', [0, 1, 2, 3, 2, 1], 2, true);
        torch.animations.play('fire');
        smokeEmitter = game.add.emitter(torch.x, torch.y, 500);
        smokeEmitter.makeParticles('smokeParticles', [0, 1, 2, 3]);
        smokeEmitter.maxParticleSpeed.set(10, -5);
        smokeEmitter.minParticleSpeed.set(-10, 5);
        smokeEmitter.gravity = -30;
        smokeEmitter.setAlpha(0.1, 1, 200);
        smokeEmitter.flow(2000, 100, 3);
    });
    
    darts = game.add.group();
    darts.enableBody = true;
    map.createFromObjects('Darts', 33, 'blowdart', 0, true, false, darts);
    darts.setAll('visible', false);
    darts.setAll('checkWorldBounds', true);
    darts.setAll('outOfBoundsKill', true);
    
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
    map.createFromObjects('Lever', 32, 'leverR', 0, true, false, levers);
    map.createFromObjects('Lever', 33, 'leverL', 0, true, false, levers);

    plates = game.add.group();
    plates.enableBody = true;
    map.createFromObjects('Plates', 27, 'pressurePlate', 0, true, false, plates);

    keys = game.add.group();
    keys.enableBody = true;
    map.createFromObjects('Key', 32, 'key', 0, true, false, keys);
    keys.setAll('visible', false);
    keyholes = game.add.group();
    keyholes.enableBody = true;
    map.createFromObjects('Keyhole', 33, 'keyHole', 0, true, false, keyholes);

    rockSpawners = game.add.group();
    rockSpawners.enableBody = true;
    map.createFromObjects('Rocks', 32, 'rockSpawner', 1, true, false, rockSpawners);
    
    spiderSpawners = game.add.group();
    spiderSpawners.enableBody = true;
    map.createFromObjects('Spiders', 32, null, 1, true, false, spiderSpawners);
    
    spiderWebs = game.add.group();
    spiderWebs.enableBody = true;
    map.createFromObjects('spiderWebs', 32, 'spiderWeb', 0, true, false, spiderWebs);
    spiderWebs.forEach(function (web) {
        web.animations.add('burn', [0, 1, 2], 9, false);
    });
    spiderWebs.setAll('body.immovable', true);
    game.physics.enable(spiderWebs);


    f_platforms = game.add.group();
    f_platforms.enableBody = true;
    map.createFromObjects('F_Platforms', 33, 'f_block', 0, true, false, f_platforms);
    f_platforms.setAll('body.immovable', true);
    f_platforms.forEach(function (f_block) {
        f_block.animations.add('crumble', [1, 2], 3, true);
        f_block.activated = false;
        f_block.deathTime = null;
    })

    startPointX = map.objects['StartPoint'][0].x;
    startPointY = map.objects['StartPoint'][0].y;
}

function pushLever(player, lever) {
    var leverID = parseInt(lever.name.charAt(5)) - 1;
    if (map.objects['Lever'][leverID].type == "unlock_key") {
        if (useKey.isDown) {
            lever.frame = 1;
            leverSound.play();
            if (keyCreated == false) {
                keys.children[leverID].visible = true;
                keyCreated = true;
            }
        }
    }
    if (map.objects['Lever'][leverID].type == "unlock_door") {
        if (useKey.isDown) {
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
    }
}

function insertKey(player, keyhole) {
    var keyholeID = parseInt(keyhole.name.charAt(7)) - 1; // to match with doorID
    if (hasKey == true && useKey.isDown) {
        // open door that matches specific keyhole
        doors.children[keyholeID].body.gravity.y = -300;
        keyInventory.kill();
        hasKey = false;
        keyCreated = false;
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

function initializeSpider(player,spiderSpawner) {
    spiders.enableBody = true;
    spiders.create(spiderSpawner.x,spiderSpawner.y-90,'spider',0,true);  
    spiders.callAll('animations.add', 'animations', 'move', [3,4,5], 5, true);
    spiders.callAll('animations.add', 'animations', 'die', [0,1,2], 5, false);
    spiders.callAll('animations.play', 'animations', 'move');
    
    spiders.callAll('anchor.setTo', 'anchor', 0.5,0);
    spiders.setAll('body.collideWorldBounds', true);
    spiders.setAll('body.gravity.y',500);
    spiders.setAll('body.immovable',true);
    spiderSpawner.kill();
    spiders.forEach(function (spider){
        game.physics.arcade.collide(spider,layerPlatforms,spider.body.velocity.x = 100);
        spider.body.setSize(60,30,0,12);
    });
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
        health -= 1;
        healthBar.frame = 5 - health;
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

function boulderDmgPlayer(player, boulder) {
    if (boulder.hurtPlayer != true) {
        boulder.hurtPlayer = true;
        health -= 1;
        healthBar.frame = 5 - health;
        loseHealthSound.play();
        killBoulder(boulder);
    }
}

function startCrumbleTimer(player, f_block) {
    // start timer
    if (!f_block.activated) {
        f_block.deathTime = game.time.now + 1500;
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

    if (levelNum <= 4) {
        game.state.start(game.state.current);
    } else {
        game.state.start('gameWinState');
    }
}

function gameWin() {
    game.state.start('gameWinState');
}

function rockSpawn() {

    rockSpawners.forEach(function (rockPlace) {

        boulders.create(rockPlace.x, rockPlace.y, 'boulderBroken');
    });



    boulders.forEach(function (boulder) {
        boulder.body.velocity.y = 500;
        boulder.body.setSize(50, 50, 0, 0);
        boulder.body.immovable = true;
        boulder.hurtPlayer = false;
    });
}

function killBoulder(boulder) {
    anim = boulder.animations.add('break', null, 10, false);
    boulder.animations.play('break');
    anim.killOnComplete = true;
    //    game.add.sprite(boulder.x,boulder.y,'boulderBroken');
    //    boulder.kill()
}

// Create light sources
function updateShadowTexture() {
    // Draw shadow
    shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
    shadowTexture.context.fillRect(0, 0, map.widthInPixels, map.heightInPixels);

    // Player torch
    // Change radius randomly each frame
    var radius = LIGHT_RADIUS + game.rnd.integerInRange(1, 10);

    // Draw circle of light with soft edge
    var gradient =
        shadowTexture.context.createRadialGradient(
            playerTorch.x, playerTorch.y, LIGHT_RADIUS * 0.1,
            playerTorch.x, playerTorch.y, radius);
    gradient.addColorStop(0, 'rgba(250, 250, 120, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    if (holdingTorch) {
        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(playerTorch.x, playerTorch.y, radius, 0, Math.PI * 2);
        shadowTexture.context.fill();
    }

    // Torches in map
    torches.forEach(function (torch) {
        // Change radius randomly each frame
        var radius = LIGHT_RADIUS * 2 + game.rnd.integerInRange(1, 10);

        // Draw circle of light with soft edge
        var gradient =
            shadowTexture.context.createRadialGradient(
                torch.x, torch.y, LIGHT_RADIUS * 0.05,
                torch.x, torch.y, radius);
        gradient.addColorStop(0, 'rgba(250, 250, 120, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(torch.x, torch.y, radius, 0, Math.PI * 2);
        shadowTexture.context.fill();
    });

    // Lava glow
    map.objects['LavaGlow'].forEach(function (glowObject) {
        var gradient =
            shadowTexture.context.createRadialGradient(
                glowObject.x + 16, glowObject.y, GLOW_RADIUS * 0.05,
                glowObject.x + 16, glowObject.y, GLOW_RADIUS);
        gradient.addColorStop(0, 'rgba(250, 75, 50, 1.0)');
        gradient.addColorStop(1, 'rgba(250, 75, 50, 0.0)');

        shadowTexture.context.beginPath();
        shadowTexture.context.fillStyle = gradient;
        shadowTexture.context.arc(glowObject.x + 16, glowObject.y, GLOW_RADIUS, 0, Math.PI * 2);
        shadowTexture.context.fill();
    });

    // Update texture cache
    shadowTexture.dirty = true;
}

function toggleTorch() {
    if (holdingTorch) {
        playerTorch.visible = false;
        holdingTorch = false;
    } else {
        playerTorch.visible = true;
        holdingTorch = true;
    }
}

function burnWeb(player, spiderWeb){
  hintText.text = 'Burn the web by pressing "e"';
    if(spiderWeb.name != ""){
       if(useKey.isDown){
          anim = spiderWeb.animations.play('burn'); 
          game.physics.arcade.overlap(spiderWeb, spiderSpawners, initializeSpider);
          var webID = parseInt(spiderWeb.name.charAt(9)) - 1;
          hintText.text = webID;
          if (keyCreated == false) {
             keys.children[webID].visible = true;
             keyCreated = true;
             anim.killOnComplete = true;
          }  
       }
    } else{
        if(useKey.isDown){
            game.physics.arcade.overlap(spiderWeb, spiderSpawners, initializeSpider);
            anim = spiderWeb.animations.play('burn');
            anim.killOnComplete = true;
        }
    }
}


