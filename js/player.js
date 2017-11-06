var PLAYER_ATTACK_RATE = 200;
var PLAYER_RUN_SPEED = 200;
var PLAYER_JUMP_SPEED = 305;
var PLAYER_GRAVITY = 800;
var PLAYER_BOUNCE = 0.02;
var PLAYER_DRAG = 0;

var player;
// var health = 5;

function createPlayer() {
    player = game.add.sprite(startPointX, startPointY, 'player');
    player.scale.setTo(1, 1);
    player.anchor.setTo(0.33, 0.5);
    // Attributes
    player.health;
    player.isAttacking = false;
    player.nextAttack = 0;
    player.hasKey = false;
    player.numberOfKeys = 0;
    player.climbing = false;
    player.isDead = false;
    // Physics
    game.physics.enable(player);
    player.body.setSize(20, 44, 15, 20);
    player.body.gravity.y = PLAYER_GRAVITY;
    player.body.bounce.y = PLAYER_BOUNCE;
    player.body.drag.x = PLAYER_DRAG;
    player.body.collideWorldBounds = true;
    // Animation
    player.animations.add('walk', [0, 1, 2, 3, 4, 5], 8, true);
    player.animations.add('idle', [13, 14], 2, true);
    player.attackAnimation = player.animations.add('attack', [6, 7, 8, 9], 15, false);
    player.attackAnimation.onComplete.add(function () {
        player.frame = 0;
        player.isAttacking = false;
    });
    player.animations.add('climb', [10, 11, 12, 11], 5, true);
    player.deathAnimation = player.animations.add('death', [13, 14, 15, 16], 12, false);
    player.deathAnimation.onComplete.add(function () {
        templeMusic.stop();
        // health = player.health;
        game.state.start(game.state.current);
    });
    // Emitter
    player.bloodEmitter = game.add.emitter(player.x - 5, player.y + 30, 50);
    player.bloodEmitter.makeParticles('bloodParticles', [0, 1, 2]);
    player.bloodEmitter.gravity = PLAYER_GRAVITY * 0.5;
    player.bloodEmitter.setAlpha(0.8, 1);
    player.bloodEmitter.setAngle(-50, -130, 50, 200);
    player.bloodEmitter.setScale(1, 2, 1, 2);
    player.bloodEmitter.setSize(30, 10);
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
                if (snake.lives <= 0) {
                    snake.body.velocity.x = 0;
                    anim = snake.animations.play('die');
                    snake.body.enable = false;
                    anim.killOnComplete = true;
                    if (chance < 0.35) {
                        dropHeart(snake.x, snake.y);
                    }
                    snake.destroy();
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
                if (spider.lives <= 0) {
                    anim = spider.animations.play('die');
                    spider.body.enable = false;
                    anim.killOnComplete = true;
                    if (chance < 0.35) {
                        dropHeart(spider.x, spider.y);
                    }
                    spider.destroy();
                }
            }
        });
    }   
}

function climbLadder() {

    // kill gravity
    if (player.climbing) {
        player.animations.stop('walk', 0);
        player.body.gravity.y = 0;
    }

    // movement/climb
    if (cursors.up.isDown || cursors2.up.isDown) {
        player.body.velocity.y = -100;
        player.climbing = true;
        player.animations.play('climb');
    } else if (cursors.down.isDown || cursors2.down.isDown) {
        player.body.velocity.y = 100;
        player.climbing = true;
        player.animations.play('climb');
    } else if (cursors.left.isDown || cursors.right.isDown || cursors2.right.isDown || cursors2.left.isDown) {
        player.climbing = false;
    } else { // stops player on ladder
        player.body.velocity.y = 0;
        player.climbing = true;
        player.animations.stop('climb', 12);
    }
}

function pushLever(player, lever) {
    var leverID = parseInt(lever.name.charAt(5)) - 1;
    if (map.objects['Lever'][leverID].type == "unlock_key") {
        if (useKey.isDown) {
            lever.frame = 1;
            leverSound.play().onStop.addOnce(function () {
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
            leverSound.play().onStop.addOnce(function () {
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

function burnWeb(player, spiderWeb) {
    hintText.text = 'Burn the web by pressing "e"';
    
    if (spiderWeb.name != "") {
        if (useKey.isDown) {
            spiderWebFire.play();
            anim = spiderWeb.animations.play('burn');
            game.physics.arcade.overlap(spiderWeb, spiderSpawners, initializeSpider);
            var webID = parseInt(spiderWeb.name.charAt(9)) - 1;
            //hintText.text = webID;
            if (keyCreated == false) {
                keys.children[webID].visible = true;
                keyCreated = true;
                anim.killOnComplete = true;
            }
        }
    } else {
        if (useKey.isDown) {
            spiderWebFire.play();
            game.physics.arcade.overlap(spiderWeb, spiderSpawners, initializeSpider);
            anim = spiderWeb.animations.play('burn');
            anim.killOnComplete = true;
        }
    }
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
