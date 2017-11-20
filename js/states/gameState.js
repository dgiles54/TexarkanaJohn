var TexarkanaJohn = TexarkanaJohn || {};

var switchTriggered = false,
    blowdartCreated = false,
    spiderSoundPlayed = false,
    keyCreated = false;
var hintText, healthBar, keyInventory;
var smokeEmitter;
var hearts;
var health = 5;
var levelNum = 8,
    maxLevels = 8;

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

TexarkanaJohn.gameState = function () {};
TexarkanaJohn.gameState.prototype = {

    preload: function () {

        game.load.script('loadLevel.js', 'js/loadLevel.js');
        game.load.script('loadAudio.js', 'js/loadAudio.js');
        game.load.script('lighting.js', 'js/lighting.js');
        game.load.script('player.js', 'js/player.js');
        game.load.script('enemies.js', 'js/enemies.js');
        game.load.script('darts.js', 'js/darts.js');
        game.load.script('boulders.js', 'js/boulders.js');
        game.load.script('input.js', 'js/input.js');
        game.load.script('boss.js', 'js/boss.js');
        game.load.tilemap('level1', 'assets/tilemaps/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'assets/tilemaps/Level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3', 'assets/tilemaps/Level3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level4', 'assets/tilemaps/Level4.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level5', 'assets/tilemaps/Level5.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level6', 'assets/tilemaps/Level6.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level7', 'assets/tilemaps/Level7.json', null, Phaser.Tilemap.TILED_JSON); 
        game.load.tilemap('level8', 'assets/tilemaps/Boss.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tilesets/tileset.png');
        game.load.spritesheet('healthBar', 'assets/sprites/health.png', 160, 32);
        game.load.spritesheet('player', 'assets/sprites/player.png', 97, 66);
        game.load.spritesheet('snake', 'assets/sprites/snake.png', 96, 48);
        game.load.spritesheet('f_block', 'assets/sprites/fall_block.png', 32, 32, 3, 0, 1);
        game.load.spritesheet('leverL', 'assets/sprites/lever_left.png', 32, 32);
        game.load.spritesheet('leverR', 'assets/sprites/lever_right.png', 32, 32);
        game.load.spritesheet('rockSpawner', 'assets/sprites/snakehead4-sheet.png', 64, 64);
        game.load.spritesheet('boulderBroken', 'assets/sprites/boulderBroken.png', 64, 64, 3);
        game.load.spritesheet('smokeParticles', 'assets/sprites/smokeParticles.png', 1, 1);
        game.load.spritesheet('bloodParticles', 'assets/sprites/bloodParticle.png', 1, 1);
        game.load.spritesheet('torch', 'assets/sprites/torch.png', 10, 23);
        game.load.spritesheet('spider', 'assets/sprites/spider.png', 72, 44,6);
        game.load.spritesheet('spiderWeb', 'assets/sprites/spiderWeb.png', 128, 128);
        game.load.spritesheet('boss', 'assets/sprites/boss_body.png', 332, 410, 8);
        game.load.spritesheet('boss_soul', 'assets/sprites/boss_soul.png', 32, 32, 5);
        game.load.spritesheet('boss_fireball', 'assets/sprites/boss_fireball.png', 32, 17);
        game.load.spritesheet('bossHealthBar', 'assets/sprites/bossHealthBar.png', 320, 16, 6);
        game.load.image('boss_hand', 'assets/sprites/boss_hand.png');
        game.load.image('pressurePlate', 'assets/sprites/pressurePlate.png');
        game.load.image('key', 'assets/sprites/key.png');
        game.load.image('keyEmpty', 'assets/sprites/keyEmpty.png');
        game.load.image('keyHole', 'assets/sprites/keyHole.png');
        game.load.image('door', 'assets/sprites/door.png');
        // game.load.image('boulder', 'assets/sprites/boulder.png');
        game.load.image('blowdart', 'assets/sprites/blowdart.png');
        game.load.image('heart', 'assets/sprites/heart.png');
        game.load.image('thoughtBubble', 'assets/sprites/thoughtBubble.png');
        game.load.image('spear', 'assets/sprites/spear.png');
        game.load.image('box', 'assets/sprites/Box.png');
        game.load.image('boxStopper', 'assets/sprites/blockStop.png');
        game.load.image('bloodParticle', 'assets/sprites/bloodParticle.png');
        game.load.image('whipHitbox', 'assets/sprites/whipHitbox.png');
        game.load.audio('leverSound', 'assets/audio/lever.wav');
        game.load.audio('plateSound', 'assets/audio/pressure_plate.wav');
        game.load.audio('ouch', 'assets/audio/ouch.wav');
        game.load.audio('doorSound', 'assets/audio/door_open.wav');
        game.load.audio('keySound', 'assets/audio/key_spawn.wav');
        game.load.audio('unlockSound', 'assets/audio/unlock_door.wav');
        game.load.audio('whipSound', 'assets/audio/whip.wav');
        game.load.audio('jumpSound', 'assets/audio/jump.wav');
        game.load.audio('templeMusic', 'assets/audio/temple_theme.wav');
        game.load.audio('spiderChatter', 'assets/audio/spider_chattering2.wav');
        game.load.audio('spiderDmg', 'assets/audio/spiderDmg.wav');
        game.load.audio('snakeDmg', 'assets/audio/snakeDmg.wav');
        game.load.audio('spiderWebFire', 'assets/audio/spiderWebFire.wav');
        game.load.audio('lava', 'assets/audio/lava.wav');
        game.load.audio('dartSound', 'assets/audio/dartSound.wav');
        game.load.audio('spikeDeathGrunt', 'assets/audio/spikeDeathGrunt.wav');
        game.load.audio('spikeDeath', 'assets/audio/spikeDeath.wav');
        game.load.audio('boxDragging', 'assets/audio/dragging3.wav');
        game.load.audio('boxDrop', 'assets/audio/boxDrop.wav');
        game.load.bitmapFont('blocktopia', 'assets/fonts/blocktopia.png', 'assets/fonts/blocktopia.xml');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
    },


    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#787878';
        
        // Load audio
        loadAudio();

        // Load level      
        loadLevel(levelNum);
        if (levelNum == 8) {
            createBoss();
        }

        // Set map collisions
        map.setCollisionBetween(1, 10, true, 'Wall');
        map.setCollisionBetween(1, 15, true, 'Platforms');
        map.setCollisionBetween(19, 20, true, 'Collisions');
        map.setCollisionBetween(21, 21, true, 'Spikes');
        map.setCollisionBetween(22, 23, true, 'Lava');
        map.setCollision(24, true, 'EndPoint');

        layerCollisions.visible = false;
        endPoint.visible = false;

        // Player
        createPlayer();
        player.health = health;

        // Game Camera
        game.camera.follow(player);
        
        // Controls
        initializeControls();

        // LIGHTING
        loadShadowTexture();
        
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
        game.physics.arcade.collide(player, boxes);
        game.physics.arcade.collide(player, endPoint, gameSave);
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
        game.physics.arcade.collide(boxes, boxStoppers);
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
        game.physics.arcade.collide(bossHands, player, checkPlayerDeath);
        // if (heartDropped) {
        //     game.physics.arcade.overlap(player, hearts, healPlayer);
        // }
        game.physics.arcade.overlap(player, hearts, healPlayer);
        game.physics.arcade.overlap(whipHitbox, snakes, hitEnemy);
        game.physics.arcade.overlap(whipHitbox, spiders, hitEnemy);
        
        
        
        // kill players with insta-death things
        map.setTileIndexCallback(21, resetLevelSpikes, null, layerSpikes);
        map.setTileIndexCallback([22, 23], resetLevelLava, null, layerLava);

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
        if (cursors.left.isDown || cursors2.left.isDown) {
            player.scale.setTo(-1, 1);
            if (player.holdingBox == true) {
                    boxDrag.play();
                }
            if (!player.climbing && !player.isAttacking && !player.isDead) {
                player.animations.play('walk');
                
            }
            player.body.velocity.x = -PLAYER_RUN_SPEED;
        } else if (cursors.right.isDown || cursors2.right.isDown) {
            player.scale.setTo(1, 1);
            if (player.holdingBox == true) {
                    boxDrag.play();
                }
            if (!player.climbing && !player.isAttacking && !player.isDead) {
                player.animations.play('walk');
                
            }
            player.body.velocity.x = PLAYER_RUN_SPEED;
        } else {
            if (!player.climbing && !player.isAttacking && !player.isDead) {
                player.frame = 5;
            }
            player.body.velocity.x = 0;
        }

        // make player jump
        if ((cursors.up.isDown || cursors2.up.isDown) && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -PLAYER_JUMP_SPEED;
            jumpSound.play();
        }
        
        // jump animations
        if (player.body.velocity.y < -1 && !player.climbing && !player.isAttacking && !player.isDead) {
            player.frame = 3;
        }
        
        // whip sound
        if (player.frame == 9) {
            whipSound.play();
        }

        // if health reaches 0, game over
        if (player.health == 0) {
            game.state.start('campState', true, false, 'died');
        }
        
        // if player dead, play death animation and restart level
        
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
        
//        if (player.holdingBox == true && dropKey.isDown) {
//            boxDrop.play();
//            player.children[0].destroy();
//            box = boxes.create(player.body.x-55, player.body.y-25, 'box');
//            box.body.gravity.y = 500;
//            player.holdingBox = false;
//        }
        
        player.bloodEmitter.x = player.x;
        player.bloodEmitter.y = player.y + 60;
        
        // Check for boss
        if (boss) {
            // If activated, shoot fireballs at player
            if (boss.activated) {             
                game.physics.arcade.overlap(whipHitbox, boss.soul, hitEnemy);
                game.physics.arcade.overlap(player, fireball.bullets, fireballDmgPlayer);
                game.physics.arcade.overlap(player, bDart1.bullets, dartDmgPlayer);
                game.physics.arcade.overlap(player, bDart2.bullets, dartDmgPlayer);
                game.physics.arcade.overlap(player, bDart3.bullets, dartDmgPlayer);
                game.physics.arcade.overlap(player, bDart4.bullets, dartDmgPlayer);

                if (fireball.shots < 3) {
                    fireball.fireAtXY(player.x, player.y);
                }
            }
        }
    },

    // DEBUG
    render: function() {
        snakes.forEach(function(snake) {
            game.debug.body(snake);
        });
        game.debug.body(player);
        if (player.isAttacking) {
            game.debug.body(whipHitbox);
        }
//        game.debug.rectangle(player.bloodEmitter);
//        hitboxes.forEach(function(hb) {
//            game.debug.spriteBounds(hb);
//        });
//        game.debug.body(boss.soul);
//        fireball.debug();
    }
};

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
    health = player.health;
    game.state.start(game.state.current);
}

function resetLevelSpikes() {
    playerDeath();

    spikeDeath.play();
    spikeDeathGrunt.play();
    // templeMusic.stop();
    // health = player.health;
    // game.state.start(game.state.current);
    // resetLevel();
}

function resetLevelLava() {
    lavaSound.play();
    resetLevel();
    // templeMusic.stop();
    // health = player.health;
    // game.state.start(game.state.current);
}

function gameSave() {
    // levelNum++;
    // health = 5
    // if (levelNum <= maxLevels) {
    //     templeMusic.stop();
    //     game.state.start('campState');
    // } else {
    //     templeMusic.stop();
    //     game.state.start('bossState');
    // }
    templeMusic.stop();
    game.state.start('campState', true, false,'next');
}

function gameWin() {
    game.state.start('gameWinState');
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

function healPlayer(player, heart) {
    if (player.health < 5) {
        player.heal(1);
        health += 1;
        healthBar.frame = player.health;
        heart.kill();
        heart.destroy();
    }
}

function playerDeath() {
    if (!player.isDead) {
        player.isDead = true;
        spikeDeath.play();
        spikeDeathGrunt.play();
        player.deathAnimation.play();
        player.bloodEmitter.explode(1000);
    }
}

function checkPlayerDeath() {
    if(player.body.touching.up) {
            console.log('ifStatementWorking');
            resetLevelSpikes()
        }
}
