var PLAYER_ATTACK_RATE = 200;
var PLAYER_RUN_SPEED = 200;
var PLAYER_JUMP_SPEED = 305;
var PLAYER_GRAVITY = 800;
var PLAYER_BOUNCE = 0.02;
var PLAYER_DRAG = 0;
var ENEMY_ATTACK_RATE = 600;
var HEART_DROP_CHANCE = 0.5;
var LIGHT_RADIUS = 100;
var GLOW_RADIUS = 75;

var map;
var startPointX, startPointY, endPoint;
var layerWall, layerPlatforms, layerLadders, layerDetails, layerFaces, layerCollisions, endingLayer, layerSpikes, layerLava;
var levers, plates, keys, keyholes, doors, dart, darts, door, f_platforms, rockSpawners, boulders, torches, dartLoopGroup, spears, boxes;
var snake, snakes, spider, spiderSpawners, spiderWebs, spiderWeb;
var switchTriggered = false,
    blowdartCreated = false,
    keyCreated = false;
var leverSound, plateSound, loseHealthSound, doorSound, keySound, unlockSound, templeMusic;
var player;
var cursors, useKey, attackKey;
var hintText, healthBar, keyInventory;
var nextAttackEnemy = 0;
var shadowTexture;
var smokeEmitter;
var hearts;
var levelNum = 1,
    maxLevels = 7;

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['VT323', 'Arvo', 'Rokkitt']
    }
};

var gameState = {

    preload: function () {

        game.load.tilemap('level1', 'assets/tilemaps/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'assets/tilemaps/Level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3', 'assets/tilemaps/Level3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level4', 'assets/tilemaps/Level4.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level5', 'assets/tilemaps/Level5.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level6', 'assets/tilemaps/Level6.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level7', 'assets/tilemaps/Level7.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tilesets/tileset.png');
        game.load.spritesheet('healthBar', 'assets/sprites/health.png', 160, 32);
        game.load.spritesheet('player', 'assets/sprites/player.png', 78, 66);
        game.load.spritesheet('snake', 'assets/sprites/snake2.png', 96, 48);
        game.load.spritesheet('f_block', 'assets/sprites/fall_block.png', 32, 32, 3, 0, 1);
        game.load.spritesheet('leverL', 'assets/sprites/lever_left.png', 32, 32);
        game.load.spritesheet('leverR', 'assets/sprites/lever_right.png', 32, 32);
        game.load.spritesheet('rockSpawner', 'assets/sprites/snakehead4-sheet.png', 64, 64);
        game.load.spritesheet('boulderBroken', 'assets/sprites/boulderBroken.png', 64, 64, 3);
        game.load.spritesheet('smokeParticles', 'assets/sprites/smokeParticles.png', 1, 1);
        game.load.spritesheet('torch', 'assets/sprites/torch.png', 10, 23);
        game.load.spritesheet('spider', 'assets/sprites/spider.png', 72, 44,6);
        game.load.spritesheet('spiderWeb', 'assets/sprites/spiderWeb.png', 128, 128);
        game.load.image('pressurePlate', 'assets/sprites/pressurePlate.png');
        game.load.image('key', 'assets/sprites/key.png');
        game.load.image('keyEmpty', 'assets/sprites/keyEmpty.png');
        game.load.image('keyHole', 'assets/sprites/keyHole.png');
        game.load.image('door', 'assets/sprites/door.png');
        game.load.image('boulder', 'assets/sprites/boulder.png');
        game.load.image('blowdart', 'assets/sprites/blowdart.png');
        game.load.image('heart', 'assets/sprites/heart.png');
        game.load.image('thoughtBubble', 'assets/sprites/thoughtBubble.png');
        game.load.image('spear', 'assets/sprites/spear.png');
        game.load.image('box', 'assets/sprites/Box.png');
        game.load.audio('leverSound', 'assets/audio/lever.wav');
        game.load.audio('plateSound', 'assets/audio/pressure_plate.wav');
        game.load.audio('ouch', 'assets/audio/ouch.wav');
        game.load.audio('doorSound', 'assets/audio/door_open.wav');
        game.load.audio('keySound', 'assets/audio/key_spawn.wav');
        game.load.audio('unlockSound', 'assets/audio/unlock_door.wav');
        game.load.audio('whipSound', 'assets/audio/whip.wav');
        game.load.audio('jumpSound', 'assets/audio/jump.wav');
        game.load.audio('templeMusic', 'assets/audio/temple_theme.wav');
        game.load.bitmapFont('blocktopia', 'assets/fonts/blocktopia.png', 'assets/fonts/blocktopia.xml');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
    },


    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#787878';
        
        templeMusic = game.add.audio('templeMusic', 0.15, true);

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
        

        // PLAYER
        player = game.add.sprite(startPointX, startPointY, 'player');
        player.scale.setTo(1, 1);
        player.anchor.setTo(0.33, 0.5);
        // Attributes
        player.health = 5;
        player.isAttacking = false;
        player.nextAttack = 0;
        player.hasKey = false;
        player.numberOfKeys = 0;
        player.climbing = false;
        // Physics
        game.physics.enable(player);
        player.body.setSize(20, 44, 15, 20);
        player.body.gravity.y = PLAYER_GRAVITY;
        player.body.bounce.y = PLAYER_BOUNCE;
        player.body.drag.x = PLAYER_DRAG;
        player.body.collideWorldBounds = true;
        // Animation
        player.animations.add('walk', [0, 1, 2, 3, 4, 5], 7, true);
        player.animations.add('idle', [13, 14], 2, true);
        player.attackAnimation = player.animations.add('attack', [6, 7, 8, 9], 12, false);
        player.attackAnimation.onComplete.add(function () {
            player.frame = 0;
            player.isAttacking = false;
        });
        player.animations.add('climb', [10, 11, 12, 11], 5, true);

        // GAME CAMERA
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        // CONTROLS
        cursors = game.input.keyboard.createCursorKeys();
        useKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        dropKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        attackKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        attackKey.onDown.add(function () {
            attack();
        }, this);

        // LIGHTING

        // Create shadow texture
        shadowTexture = game.add.bitmapData(map.widthInPixels, map.heightInPixels);

        // Create object that uses bitmap as texture
        var lightSprite = game.add.image(0, 0, shadowTexture);

        // Set blend mode to multiply
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

        // HUD
        player.hintBubble = game.add.sprite(player.x, player.y - 100, 'thoughtBubble');
        player.hintBubble.visible = false;
        
        hintText = game.add.text(player.x + 7, player.y - 95, '', {
            font: 'VT323',
            fontSize: 12,
            wordWrap: true,
            wordWrapWidth: 95
        });
        hintText.visible = false;
        
        keyInventory = game.add.sprite(5, 42, 'keyEmpty');
        keyInventory.fixedToCamera = true;

        healthBar = game.add.sprite(5, 5, 'healthBar');
        healthBar.fixedToCamera = true;
        healthBar.frame = player.health;

        // SOUND FX
        leverSound = game.add.audio('leverSound');
        plateSound = game.add.audio('plateSound');
        loseHealthSound = game.add.audio('ouch', 0.5);
        doorSound = game.add.audio('doorSound', 0.75);
        keySound = game.add.audio('keySound');
        unlockSound = game.add.audio('unlockSound');
        whipSound = game.add.audio('whipSound');
        jumpSound = game.add.audio('jumpSound');

        //timer for boulder spawns
        timer = game.time.create(false);
        timer.loop(3000, rockSpawn, this);
        timer.start();
        
        // dartLoopGroup.forEach(function(dartLoop) {
        //     dartLoop.loopTimer = game.time.create(true);
        //     dartLoop.loopTimer.loop(3000, dartLoopSpawn, this);
        //     dartLoop.loopTimer.start();
        // });
        timerDartLoop = game.time.create(true);
        timerDartLoop.loop(3000, dartLoopSpawn, this);
        timerDartLoop.start();

        // boulder group
        boulders = game.add.group();
        boulders.enableBody = true;
        //boulders.callAll('animations.add','animations','break',3,2,false);

        //spider group
        spiders = game.add.group();
        player.holdingBox = false;
    },

    update: function () {
        // for that ladder physics when gravity = 0
        player.body.gravity.y = PLAYER_GRAVITY;
        player.climbing = false;
        
        

        // spears.forEach(function(spear) {
        //     if (!spear.activated) {
        //         spear.body.enable = false;
        //     }
        // });

        timerDartLoop.resume();
        
        // dartLoopGroup.forEach(function(dartLoop) {
        //     dartLoop.loopTimer.resume();
        // });

        game.physics.arcade.collide(player, layerWall);
        game.physics.arcade.collide(boxes, layerWall);
        game.physics.arcade.collide(player, layerPlatforms);
        game.physics.arcade.collide(spiders, layerPlatforms);
        game.physics.arcade.collide(boxes, layerPlatforms);
        game.physics.arcade.collide(player, layerLadders);
        game.physics.arcade.collide(player, doors);
        game.physics.arcade.collide(player, boxes, moveBox);
        game.physics.arcade.collide(player, endPoint, nextLevel);
        game.physics.arcade.overlap(player, levers, pushLever);
        game.physics.arcade.overlap(player, keys, takeKey);
        game.physics.arcade.overlap(player, keyholes, insertKey);
        game.physics.arcade.overlap(player, plates, shootDart);
        game.physics.arcade.overlap(boxes, plates, shootDart);
        game.physics.arcade.overlap(player, spiderWebs, burnWeb);
        game.physics.arcade.overlap(player, snakes, dmgPlayer);
        game.physics.arcade.overlap(player, spiders, dmgPlayer);
        game.physics.arcade.overlap(player, darts, dartDmgPlayer);
        game.physics.arcade.collide(player, layerLava);
        game.physics.arcade.collide(player, layerSpikes);
        game.physics.arcade.collide(snakes, layerCollisions);
        game.physics.arcade.collide(snakes, layerPlatforms);
        game.physics.arcade.collide(snakes, f_platforms);
        game.physics.arcade.collide(spiders, layerCollisions);
        game.physics.arcade.collide(spiders, layerPlatforms);
        game.physics.arcade.collide(player, f_platforms, startCrumbleTimer);
        game.physics.arcade.collide(player, spiderSpawners, initializeSpider);
        game.physics.arcade.collide(boulders, layerPlatforms, killBoulder);
        game.physics.arcade.overlap(boulders, player, boulderDmgPlayer);
        game.physics.arcade.collide(hearts, layerPlatforms);
        game.physics.arcade.overlap(player, spears, dmgPlayer);
        game.physics.arcade.collide(boxes, darts, killDart);
        // if (heartDropped) {
        //     game.physics.arcade.overlap(player, hearts, healPlayer);
        // }
        game.physics.arcade.overlap(player, hearts, healPlayer);
        
        
        
        // kill players with insta-death things
        map.setTileIndexCallback(21, resetLevel, null, layerSpikes);
        map.setTileIndexCallback([22, 23], resetLevel, null, layerLava);

        // allow player to climb ladders
        map.setTileIndexCallback(14, climbLadder, null, layerLadders);

        // winning game location
        map.setTileIndexCallback(24, gameWin, null, endingLayer);

        // LIGHTING
        updateShadowTexture();



        // falling blocks happen
        f_platforms.forEach(function (f_block) {
            crumbleBlock(f_block);
        });

        // make player walk
        if (cursors.left.isDown) {
            player.scale.setTo(-1, 1);
            if (!player.climbing && !player.isAttacking) {
                player.animations.play('walk');
            }
            player.body.velocity.x = -PLAYER_RUN_SPEED;
        } else if (cursors.right.isDown) {
            player.scale.setTo(1, 1);
            if (!player.climbing && !player.isAttacking) {
                player.animations.play('walk');
            }
            player.body.velocity.x = PLAYER_RUN_SPEED;
        } else {
            if (!player.climbing && !player.isAttacking) {
                player.frame = 0;
            }
            player.body.velocity.x = 0;
        }

        // make player jump
        if (cursors.up.justDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -PLAYER_JUMP_SPEED;
            jumpSound.play();
        }
        
        // jump animations
        if (player.body.velocity.y < -5 && !player.climbing && !player.isAttacking) {
            player.frame = 3;
        }
        
        // whip sound
        if (player.frame == 9) {
            whipSound.play();
        }
        

        // if health reaches 0, game over
        if (player.health == 0) {
            game.state.start('gameOverState');
        }
        
        // snake collision
        snakes.forEach(function (snake) {
            if (snake.body.velocity.x > 0) {
                snake.scale.setTo(0.5, 0.5);
                snake.goingRight = true;
                snake.goingLeft = false;
            } 
            if (snake.body.velocity.x < 0) {
                snake.scale.setTo(-0.5, 0.5);
                snake.goingLeft = true;
                snake.goingRight = false;
            }
        });
                       
        // spider collision
        spiders.forEach(function (spider) {  
            if (spider.body.velocity.x > 0) {
                spider.scale.setTo(0.5, 0.5);
                spider.goingRight = true;
                spider.goingLeft = false;
            } else if (spider.body.velocity.x < 0) {
                spider.scale.setTo(-0.5, 0.5);
                spider.goingLeft = true;
                spider.goingRight = false;
            }
        });
        

        // Hint bubble
        player.hintBubble.x = player.x;
        player.hintBubble.y = player.y - 100;
        hintText.x = player.x + 7;
        hintText.y = player.y - 95;
        
        // Hint text
        if (levelNum == 1) {
            if (player.overlap(keys)) {
                hintText.text = 'A skull-shaped key! This might be useful to me.';
                player.hintBubble.visible = true;
                hintText.visible = true;
            } else if (player.overlap(keyholes) && player.hasKey) {
                hintText.text = 'I should try to use the key I found!';
                player.hintBubble.visible = true;
                hintText.visible = true;
            } else if (player.overlap(levers)) {
                hintText.text = 'An oddly placed lever. I wonder what it does?';
                player.hintBubble.visible = true;
                hintText.visible = true;
            } else {
                player.hintBubble.visible = false;
                hintText.visible = false;
            }
        }
            
        boxes.forEach( function(box) {
            box.body.velocity.x = 0;
        });
        
        if (player.holdingBox == true && dropKey.isDown) {
            player.children[0].destroy();
            box = boxes.create(player.body.x-55, player.body.y-25, 'box');
            box.body.gravity.y = 100;
            player.holdingBox = false;
        }
        
    },

    // DEBUG
    render: function() {
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
    if(map.objects['Plates'][plateID].type == 'stopLoop') {
        if(map.objects['Plates'][plateID].plateSoundAlreadyPlayed == false){
           
           plateSound.play();
           map.objects['Plates'][plateID].plateSoundAlreadyPlayed = true;
        }
        timerDartLoop.pause();
        // dartLoopGroup.forEach(function(dartLoop) {
        //     // dartLoopID = dartLoopGroup.getChildIndex(dartLoop);
        //     // if (map.objects['dartLoop'][dartLoopID].loopGroup == plateID + 1) {
        //     //     dartLoop.loopTimer.pause();
        //     // }
        // });
    } 
}

function climbLadder() {
    // guess intention
    // if (cursors.up.justDown || cursors.down.justDown) {
    //     player.climbing = true;
    // }

    // kill gravity
    if (player.climbing) {
        player.body.gravity.y = 0;
    }

    // movement/climb
    if (cursors.up.isDown) {
        player.body.velocity.y = -100;
        player.climbing = true;
        player.animations.play('climb');
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
        player.climbing = true;
        player.animations.play('climb');
    } else if (cursors.left.isDown || cursors.right.isDown) {
        player.climbing = false;
    } else { // stops player on ladder
        player.body.velocity.y = 0;
        player.climbing = true;
        player.animations.stop('climb', 12);
    }
}

function attack() {
    if (game.time.now > player.nextAttack) {
        player.isAttacking = true;
        // random for heart drop chance

        player.nextAttack = game.time.now + PLAYER_ATTACK_RATE;
        player.animations.play('attack');
        console.log('Attacking');

        // kill snake
        snakes.forEach(function (snake) {
            if (player.overlap(snake) && player.isAttacking) {
                var chance = Math.random();
                snake.lives -= 1;
                dmgEnemy(snake);
                if (chance < 0.25) {
                    dropHeart(snake.x, snake.y);
                }
                if (snake.lives <= 0) {
                    snake.body.velocity.x = 0;
                    anim = snake.animations.play('die');
                    snake.body.enable = false;
                    anim.killOnComplete = true;
                }
            }
        });

        // kill spider
        spiders.forEach(function (spider) {
            if (player.overlap(spider) && player.isAttacking) {
                spider.body.velocity.x = 0;
                spider.lives -= 1;
                dmgEnemy(spider);
                var chance = Math.random();
                if (chance < 0.25) {
                    dropHeart(spider.x, spider.y);
                }
                if (spider.lives <= 0) {
                    anim = spider.animations.play('die');
                    spider.body.enable = false;
                    anim.killOnComplete = true;
                }
            }
        });
    }
    
}

function dmgEnemy(enemy) {
            enemy.body.velocity.x = 0;
            enemy.body.velocity.y = -100;
            anim = enemy.animations.play('dmg');
            anim.onComplete.add(function (){
                if (enemy.goingRight == true){
                enemy.body.velocity.x = 100;
                } else if (enemy.goingLeft == true){
                    enemy.body.velocity.x = -100;
                }        
                enemy.animations.play('move');
            });

}

function loadLevel(levelNum) {
    templeMusic.play();
    keyCreated = false;
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
        smokeEmitter = game.add.emitter(torch.x, torch.y, 250);
        smokeEmitter.makeParticles('smokeParticles', [0, 1, 2, 3]);
        smokeEmitter.maxParticleSpeed.set(5, -5);
        smokeEmitter.minParticleSpeed.set(-5, 5);
        smokeEmitter.gravity = -30;
        smokeEmitter.setAlpha(0.1, 1, 200);
        smokeEmitter.flow(1000, 150, 1);
    });

    darts = game.add.group();
    darts.enableBody = true;
    map.createFromObjects('Darts', 33, 'blowdart', 0, true, false, darts);
    darts.setAll('visible', false);
    darts.setAll('checkWorldBounds', true);
    darts.setAll('outOfBoundsKill', true);

    spears = game.add.group();
    spears.enableBody = true;
    map.createFromObjects('Spears', 32, 'spear', 0, true, false, spears);
    spears.forEach(function(spear) {
        spear.body.setSize(16, 32, 8, 0);

        // spear.position.y -= 32;
        spear.tween1 = game.add.tween(spear).to({ y: spear.y + 32 }, 500);
        spear.tween2 = game.add.tween(spear).to({ y: spear.y - 32 }, 500).delay(1000);
        spear.tween1.chain(spear.tween2);
        spear.tween2.chain(spear.tween1);

        // spear.tween1.start();
        spearID = parseInt(spear.name.charAt(5));
        if (spearID % 2 == 1) {
            spear.position.y -= 32;
            spear.tween1.start();
        } else {
            spear.tween2.start();
        }
    });

    doors = game.add.group();
    doors.enableBody = true;
    map.createFromObjects("Door", 32, 'door', 0, true, false, doors);
    doors.setAll('body.immovable', true);
    doors.setAll('outOfBoundsKill', true);

    layerLava = map.createLayer('Lava');
    layerLadders = map.createLayer('Ladders');
    layerPlatforms = map.createLayer('Platforms');
    layerDetails = map.createLayer('Details');
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
    plates.setAll('plateSoundAlreadyPlayed', false);
    plates.forEach(function(plate) {
        plate.body.setSize(24, 10, 0, 0);
    });

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
    
    dartLoopGroup = game.add.group();
    map.createFromObjects('dartLoop', 32, null, 0, true, false, dartLoopGroup);
    
    boxes = game.add.group();
    boxes.enableBody = true;
    map.createFromObjects('Boxes', 32, 'box', 0, true, false, boxes);
    boxes.setAll('body.gravity.y', 500);
    boxes.setAll('body.collideWorldBounds', true);
    boxes.setAll('body.bounce.x', '0.25');
    boxes.setAll('friction', '0.99');
    
    
    startPointX = map.objects['StartPoint'][0].x;
    startPointY = map.objects['StartPoint'][0].y;

    hearts = game.add.group();
    hearts.enableBody = true;
    
    initializeSnakes();
    snakes.callAll('animations.play', 'animations', 'move');
}

function pushLever(player, lever) {
    var leverID = parseInt(lever.name.charAt(5)) - 1;
    if (map.objects['Lever'][leverID].type == "unlock_key") {
        if (useKey.isDown) {
            lever.frame = 1;
            leverSound.play().onStop.add(function () {
                if (keyCreated == false) {
                    keys.children[leverID].visible = true;
                    keyCreated = true;
                    keySound.play();
                }
            }, this);
        }
    }
    if (map.objects['Lever'][leverID].type == "unlock_door") {
        if (useKey.isDown) {
            lever.frame = 1;
            leverSound.play().onStop.add(function () {
                doors.children[leverID].body.gravity.y = -20;
                doorSound.play();
            }, this);
        }
    }
}

function takeKey(player, key) {
    if (useKey.isDown && player.hasKey == false) {
        key.kill();
        keyInventory.kill();
        keyInventory = game.add.sprite(5, 42, 'key');
        keyInventory.fixedToCamera = true;
        player.hasKey = true;
        player.numberOfKeys++;
    }
}

function insertKey(player, keyhole) {
    var keyholeID = parseInt(keyhole.name.charAt(7)) - 1; // to match with doorID
    if (player.hasKey == true && useKey.isDown) {
        // open door that matches specific keyhole
        unlockSound.play().onStop.add(function () {
            doors.children[keyholeID].body.gravity.y = -20;
            doorSound.play();
            keyInventory.kill();
            keyInventory = game.add.sprite(5, 42, 'keyEmpty');
            keyInventory.fixedToCamera = true;
            player.hasKey = false;
            keyCreated = false;
            player.numberOfKeys--;
        }, this);
    }
}

function initializeSpider(player, spiderSpawner) {
    spiders.enableBody = true;
    spiders.create(spiderSpawner.x, spiderSpawner.y - 90, 'spider', 0, true);
    spiders.callAll('animations.add', 'animations', 'move', [3, 4, 5], 5, true);
    spiders.callAll('animations.add', 'animations', 'die', [0, 1, 2], 5, false);
    spiders.callAll('animations.add', 'animations', 'dmg', [4], 2, false);
    spiders.callAll('animations.play', 'animations', 'move');

    spiders.callAll('anchor.setTo', 'anchor', 0.5, 0);
    spiders.setAll('body.collideWorldBounds', true);
    spiders.setAll('body.gravity.y', 500);
    spiders.setAll('body.immovable', true);
    spiderSpawner.kill();
    spiders.forEach(function (spider){
        game.physics.arcade.collide(spider,layerPlatforms,spider.body.velocity.x = 100);
        spider.scale.setTo(0.5, 0.5);
        spider.body.bounce.x = 1;
        spider.lives = 3;
    });
}

function initializeSnakes() {
    snakes = game.add.group();
    snakes.enableBody = true;
    map.createFromObjects('Snakes', 33, 'snake', 0, true, false, snakes);
    snakes.forEach(function (snake) {
        snake.scale.setTo(0.5, 0.5);
        snake.body.velocity.x = 100;
        snake.anchor.setTo(0.5, 0);
        snake.body.immovable = true;
        snake.body.bounce.x = 1;
        snake.lives = 3;
        snake.goingRight = true;
    });
    map.setCollision(19);
    map.setCollision(20);
    snakes.callAll('animations.add', 'animations', 'move', [0,1,2], 5, true);
    snakes.callAll('animations.add', 'animations', 'dmg', [3], 2, false);
    snakes.callAll('animations.add', 'animations', 'die', [3,4], 5, false);
    snakes.setAll('body.collideWorldBounds', true);
    snakes.setAll('body.gravity.y', 500);
    
}

function dmgPlayer(player, enemy) {
    if (game.time.now > nextAttackEnemy) {
        nextAttackEnemy = game.time.now + ENEMY_ATTACK_RATE;
        player.damage(1);
        healthBar.frame = player.health;
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

function healPlayer(player, heart) {
    if (player.health < 5) {
        player.heal(1);
        healthBar.frame = player.health;
        heart.kill();
        heart.destroy();
    }
        // if (hearts.length == 0) {
        //     heartDropped = false;
        // }
    // } else {
    //     heartDropped = true;
    // }
    // health = Math.min(5, health + 1);
    // healthBar.frame = health;
    // heart.kill();
    // heart.destroy();
    // heartDropped = false;
}

function boulderDmgPlayer(player, boulder) {
    if (boulder.hurtPlayer != true) {
        boulder.hurtPlayer = true;
        player.damage(1);
        healthBar.frame = player.health;
        loseHealthSound.play();
        
        killBoulder(boulder);
    }
}

function dartDmgPlayer(player, dart) {
    if (game.time.now > nextAttackEnemy) {
        nextAttackEnemy = game.time.now + ENEMY_ATTACK_RATE;
        player.damage(1);
        healthBar.frame = player.health;
        loseHealthSound.play();

        killDart(dart);
    }
}


function startCrumbleTimer(player, f_block) {
    // start timer
    if (!f_block.activated) {
        f_block.deathTime = game.time.now + 500;
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
    templeMusic.stop();
    game.state.start(game.state.current);
}

function nextLevel() {
    levelNum++;

    if (levelNum <= maxLevels) {
        templeMusic.stop();
        game.state.start(game.state.current);
    } else {
        templeMusic.stop();
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
    shadowTexture.context.fillStyle = 'rgb(25, 25, 25)';
    shadowTexture.context.fillRect(0, 0, map.widthInPixels, map.heightInPixels);

    // Player torch
    // Change radius randomly each frame
    var radius = LIGHT_RADIUS + game.rnd.integerInRange(1, 10);

    // Draw circle of light with soft edge
    var gradient =
        shadowTexture.context.createRadialGradient(
            player.x, player.y, LIGHT_RADIUS * 0.1,
            player.x, player.y, radius);
    gradient.addColorStop(0, 'rgba(250, 250, 120, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradient;
    shadowTexture.context.arc(player.x, player.y, radius, 0, Math.PI * 2);
    shadowTexture.context.fill();

    // Torches in map
    torches.forEach(function (torch) {
        // Change radius randomly each frame
        var radius = LIGHT_RADIUS + game.rnd.integerInRange(1, 10);

        // Draw circle of light with soft edge
        var gradient =
            shadowTexture.context.createRadialGradient(
                torch.x, torch.y, LIGHT_RADIUS * 0.05,
                torch.x, torch.y, radius);
        gradient.addColorStop(0, 'rgba(250, 250, 120, 0.9)');
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

function burnWeb(player, spiderWeb) {
    hintText.text = 'Burn the web by pressing "e"';
    if (spiderWeb.name != "") {
        if (useKey.isDown) {
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
    } else {
        if (useKey.isDown) {
            game.physics.arcade.overlap(spiderWeb, spiderSpawners, initializeSpider);
            anim = spiderWeb.animations.play('burn');
            anim.killOnComplete = true;
        }
    }
}

function dropHeart(x, y) {
    heart = game.add.sprite(x, y, 'heart');
    heart.scale.setTo(0.5, 0.5);
    game.physics.enable(heart);
    heart.body.gravity.y = 300;
    heart.body.bounce.y = 0.75;
    // heartDropped = true;

    hearts.add(heart);
}

function dartLoopSpawn() {
    dartLoopGroup.forEach(function(dartLoop) {
        dartLoopID = dartLoopGroup.getChildIndex(dartLoop);
        dart = darts.create(dartLoop.x, dartLoop.y, 'blowdart');

        // LEFT
        if (map.objects['dartLoop'][dartLoopID].type == "right") {
            dart.body.velocity.x = -300;
        } else {
            dart.scale.setTo(-1, 1);
            dart.body.velocity.y = 300;
        }
        dart.checkWorldBounds = true;
        dart.outOfBoundsKill = true;
        
        if (!dart.exists) {
            dart.destroy();
        }
    });
}

function killDart(dart,box) {
    dart.kill();
    dart.destroy();
}

function moveBox(player, box) {
    if (useKey.isDown) {
        player.holdingBox = true;
        playerBox = player.addChild(box);
        playerBox.body.gravity.y = 0;
        playerBox.body.velocity.x = 0;
        player.children[0].body.x = 25;
        player.children[0].body.y = -25;
    }
}
