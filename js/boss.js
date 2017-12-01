var boss, bossHands, fireballLoop, bossHealthBar;

function createBoss() {
	//Inputs
	bossX = bossObj[0].x;
	bossY = bossObj[0].y;
  
    fireballLoop = game.time.create(true);
    fireballLoop.loop(5000, fireballReset, this); // shoot fireballs every n seconds
    fireballLoop.start();
    fireballLoop.pause();
    
    //fireballLoop.pause();
    
	boss = game.add.sprite(bossX, bossY, 'boss');
	boss.anchor.setTo(0, 1);
	boss.soul = game.add.sprite(boss.x+0.5*boss.width, boss.y-12, 'boss_soul');
    //boss.soul.enableBody = true;
	boss.soul.anchor.setTo(0.5, 1);
	boss.soul.visible = false;
	// boss.anchor.setTo(0.5, 1);
	
	// Attributes
	boss.soul.hp = 5;
    
    boss.HealthBar = game.add.sprite(270 ,game.height - 90 , 'bossHealthBar');
    boss.HealthBar.fixedToCamera = true;
    boss.HealthBar.frame = 0;
	boss.invulnerable = true;
	boss.isDead = false;
    boss.activated = false;
	// Physics
	game.physics.enable(boss);
	// Animation
	boss.soul.animations.add('idle', [0, 1, 2, 3], 6, true);
	boss.soul.animations.add('hit', [4], 6, false).onComplete.add(function() {
        boss.soul.animations.play('idle');
    });
	boss.animations.add('idle', [0, 1, 2, 3], 6, true);
	boss.animations.add('opened', [7], 6, false);
	boss.animations.add('closed', [0], 6, false);
	boss.animations.add('open', [0, 4, 5, 6], 6, false).onComplete.add(function() {
		boss.animations.play('opened');
		boss.soul.visible = true;
		boss.soul.animations.play('idle');
		game.physics.enable(boss.soul);
        fireballLoop.resume();
        bossSoulRise();
        boss.activated = true;
	});
	boss.animations.add('close', [7, 6, 5, 4], 6, false).onStart.add(function() {
		boss.animations.play('closed');
		boss.soul.visible = false;
		boss.soul.animations.stop();
		boss.soul.enableBody = false;
        fireballLoop.pause();
	});
    // Fireballs
    fireball = game.add.weapon(10, 'boss_fireball');
    fireball.addBulletAnimation('fireball', [0, 1, 2, 3, 2, 1], 10, true);
    fireball.trackSprite(boss, 165, -20);
    fireball.bulletSpeed = 200;
    fireball.fireRate = 500;
    
    bossHands = game.add.group();
    bossHands.enableBody = true;
    map.createFromObjects('Boss_Hands', 32, 'boss_hand', 0, true, false, bossHands);
    bossHands.setAll('body.immovable', true);
    bossHands.setAll('goingUp', false);
    
//    bossHandLoop1 = game.time.create(true);
//    bossHandLoop1.loop(2000)
    //bossHands tweens
    bossHands.forEach(function(hand) {
        hand.tween1 = game.add.tween(hand).to({y: hand.body.y + 100}, hand.body.x);
        hand.tween1.timeScale = 1.25;
       // hand.tween1.yoyo(true, 1000);
        //hand.tween1.repeat(5);
        hand.tween2 = game.add.tween(hand).to({y: hand.body.y}, hand.body.x);
        hand.tween2.timeScale = 0.25;
        hand.tween1.delay(500);
        hand.tween1.chain(hand.tween2);
        hand.tween2.chain(hand.tween1);
        hand.tween2.onStart.add(handGoesUp, this);
        hand.tween1.onStart.add(handGoesDown, this);
    });
    
    bossHands.children[0].tween1.start();
    bossHands.children[1].tween1.start();
    
    
    
    // bossSoul tweens
    boss.soul.tween1 = game.add.tween(boss.soul).to({y:boss.y-182}, boss.x+0.5*boss.width);
    boss.soul.tween2 = game.add.tween(boss.soul).to({y: boss.y-12}, boss.x+0.5*boss.width);
    boss.soul.tween2.delay(3000);
    boss.soul.tween1.delay(1000);
    boss.soul.tween1.chain(boss.soul.tween2);
    boss.soul.tween2.onComplete.add(closeBoss, this);
    
    
}

function fireballDmgPlayer(player, fireball) {
    player.damage(1);
    health -= 1;
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

    player.body.velocity.x = 0;
    player.body.acceleration.x = 0;
    fireball.kill();
}

function fireballReset() {
    if (fireball.shots > 1) {
        fireball.shots = 0;
        console.log('reset shots');
    }
}

function bossDarts() {
    bDart1 = game.add.weapon(1, 'blowdart');
    bDart1.fireFrom.setTo(game.world.width, 0, 1, 1);
    bDart2 = game.add.weapon(1, 'blowdart');
    bDart2.fireFrom.setTo(game.world.width, game.world.height*0.33, 1, 1);
    bDart3 = game.add.weapon(1, 'blowdart');
    bDart3.fireFrom.setTo(game.world.width, game.world.height*0.66, 1, 1);
    bDart4 = game.add.weapon(1, 'blowdart');
    bDart4.fireFrom.setTo(game.world.width, game.world.height, 1, 1);
    
    bDart1.bulletAngleOffset = 180;
    bDart2.bulletAngleOffset = 180;
    bDart3.bulletAngleOffset = 180;
    bDart4.bulletAngleOffset = 180;
    
    bDart1.bulletSpeed = 450;
    bDart2.bulletSpeed = 450;
    bDart3.bulletSpeed = 450;
    bDart4.bulletSpeed = 450;
    
    bDart1.fireAtXY(player.x, player.y - 10);
    bDart2.fireAtXY(player.x, player.y - 5);
    bDart3.fireAtXY(player.x, player.y + 5);
    bDart4.fireAtXY(player.x, player.y + 10);
}

function bossSoulRise() {
    boss.soul.tween1.start();
}

function closeBoss() {
    boss.animations.play('close');
}

function handGoesUp(hand) {
    hand.goingUp = true;
    hand.goingDown = false;
}

function handGoesDown(hand) {
    hand.goingDown = true;
    hand.goingUp = false;
}