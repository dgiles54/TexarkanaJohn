var PLAYER_ATTACK_RATE = 400;
var PLAYER_RUN_SPEED = 200;
var PLAYER_JUMP_SPEED = 305;
var PLAYER_GRAVITY = 800;
var PLAYER_BOUNCE = 0.02;
var PLAYER_DRAG = 0;

var player;
var hitboxes, whipHitbox;

function createPlayer() {
    player = game.add.sprite(startPointX, startPointY, 'player');
    player.scale.setTo(1, 1);
    player.anchor.setTo(0.25, 0.5);
    // Attributes
    player.health;
    player.isAttacking = false;
    player.nextAttack = 0;
    player.hasKey = false;
    player.numberOfKeys = 0;
    player.climbing = false;
    player.isDead = false;
    player.facingLeft = false;
    // Physics
    game.physics.enable(player);
    player.body.setSize(20, 44, 15, 20);
    player.body.gravity.y = PLAYER_GRAVITY;
    player.body.bounce.y = PLAYER_BOUNCE;
    player.body.drag.x = PLAYER_DRAG;
    player.body.collideWorldBounds = true;
    // Animation
    player.animations.add('walk', [0, 1, 2, 3, 4, 5], 8, true);
    player.attackAnimation = player.animations.add('attack', [6, 7, 8, 9, 10], 15, false);
    player.attackAnimation.onComplete.add(function () {
        player.frame = 0;
        player.isAttacking = false;
        if (whipHitbox) {
            whipHitbox.destroy();
        }
    });
    player.animations.add('climb', [11, 12, 13, 12], 5, true);
    player.deathAnimation = player.animations.add('death', [14, 15, 16, 17], 12, false);
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
    // Hitboxes
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    player.addChild(hitboxes);
}

function attack() {
    if (game.time.now > player.nextAttack) {
        console.log('Attacking');
        player.nextAttack = game.time.now + PLAYER_ATTACK_RATE;
        player.isAttacking = true;
        player.animations.play('attack');
        if (player.facingLeft) {
            whipHitbox = hitboxes.create(68, 6, 'whipHitbox');
        } else {
            whipHitbox = hitboxes.create(18, 6, 'whipHitbox');
        }
        whipHitbox.alpha = 0; // set to 0.5 for debugging
    }   
}

function hitEnemy(hitbox, enemy) {
    // if (player.frame == 10 || player.frame ) {
    if ([8, 9, 10].indexOf(player.frame) > -1) {
        console.log('Hit enemy');
        hitbox.kill();
        // Decrease hp of enemy
        enemy.hp -= 1;
        
        if (enemy.key == 'boss_soul') {
            // Code for hitting boss
            
            boss.soul.animations.play('hit');
            game.add.tween(enemy).to({tint: 0xFF0000, alpha: 0.8}, 100, null, true);
            game.add.tween(enemy).to({tint: 0xFFFFFF, alpha: 1}, 200, null, true, 100);
        } else {
            // Code for hitting all other enemies
            
            // If hp <= 0, kill enemy
            if (enemy.hp <= 0) {
                enemy.body.velocity.x = 0;
                enemy.body.enable = false;
                var anim = enemy.animations.play('die');
                anim.onComplete.addOnce(function () {
                    var chance = Math.random();
                    if (chance < 0.35) {
                        dropHeart(enemy.x, enemy.y);
                    }
                    enemy.destroy();
                });
            } else {
                // Play enemy hit sound
                if (enemy.key == 'spider') {
                    spiderDmg.play();
                }
                if (enemy.key == 'snake') {
                    snakeDmg.play();
                }
                // Enemy knockback
                if (player.x < enemy.x) {
                    enemy.body.velocity.x = 100;
                } else {
                    enemy.body.velocity.x = -100;
                }
                enemy.body.velocity.y = -100;
                // Enemy hit animation
                var anim = enemy.animations.play('dmg');
                anim.onComplete.add(function (){
                    if (enemy.goingRight) {
                        enemy.body.velocity.x = 100;
                    } else if (enemy.goingLeft) {
                        enemy.body.velocity.x = -100;
                    }        
                    enemy.animations.play('move');
                });
            }
        }
    }
}

function climbLadder() {
    // If player on floor, automatically set to first frame of ladder climb animation
    if (player.body.onFloor()) {
        player.animations.stop('walk', 0);
        player.frame = 11;
    }
    
    // kill gravity, kill any hitboxes
    if (player.climbing) {
        player.animations.stop('walk', 0);
        player.body.gravity.y = 0;
        
        if (whipHitbox) {
            whipHitbox.destroy();
        }
        player.isAttacking = false; // fixes ladder climb animation bug
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
            lever.animations.play('flip');
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
            lever.animations.play('flip');
            leverSound.play().onStop.addOnce(function () {
                doors.children[leverID].body.gravity.y = -20;
                doorSound.play();
            }, this);
        }
    }
    if (map.objects['Lever'][leverID].type == "open_boss") {
        if (useKey.isDown) {
            lever.animations.play('flip');
            leverSound.play().onStop.addOnce(function () {
                boss.animations.play('open');
                fireballLoop = game.time.events.loop(5000, fireballReset); // shoot fireballs every n seconds
                bossDarts();
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

//function moveBox(player, box) {
//    if (useKey.isDown) {
//        player.holdingBox = true;
//        playerBox = player.addChild(box);
//        playerBox.body.gravity.y = 0;
//        playerBox.body.velocity.x = 0;
//        playerBox.body.x = 25;
//        playerBox.body.y = -25;
//    }
//}
