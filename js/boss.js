var boss;

function createBoss() {
	//Inputs
	bossX = bossObj[0].x;
	bossY = bossObj[0].y;

	boss = game.add.sprite(bossX, bossY, 'boss');
	boss.anchor.setTo(0, 1);
	boss.soul = game.add.sprite(boss.x+0.5*boss.width, boss.y-12, 'boss_soul');
	boss.soul.anchor.setTo(0.5, 1);
	boss.soul.visible = false;
	// boss.anchor.setTo(0.5, 1);
	
	// Attributes
	boss.health = 25;
	boss.invulnerable = true;
	boss.isDead = false;
	// Physics
	game.physics.enable(boss);
	// Animation
	boss.soul.animations.add('idle', [0, 1, 2, 3], 6, true);
	boss.soul.animations.add('hit', [4], 6, false);
	boss.animations.add('idle', [0, 1, 2, 3], 6, true);
	boss.animations.add('opened', [7], 6, false);
	boss.animations.add('closed', [0], 6, false);
	boss.animations.add('open', [0, 4, 5, 6], 6, false).onComplete.add(function() {
		boss.animations.play('opened');
		boss.soul.visible = true;
		boss.soul.animations.play('idle');
		boss.soul.enableBody = true;
	});
	boss.animations.add('close', [7, 6, 5, 4], 6, false).onStart.add(function() {
		boss.animations.play('closed');
		boss.soul.visible = false;
		boss.soul.animations.stop();
		boss.soul.enableBody = false;
	});
}