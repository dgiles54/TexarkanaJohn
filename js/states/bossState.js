var TexarkanaJohn = TexarkanaJohn || {};

var keyCreated = false;
var hintText, healthBar, keyInventory;
var smokeEmitter;
var healthBG;

TexarkanaJohn.bossState = function () {};
TexarkanaJohn.bossState.prototype = {

	preload: function() {
	game.load.script('loadLevel.js', 'js/loadLevel.js');
        game.load.script('loadAudio.js', 'js/loadAudio.js');
        game.load.script('lighting.js', 'js/lighting.js');
        game.load.script('player.js', 'js/player.js');
        game.load.script('enemies.js', 'js/enemies.js');
        game.load.script('darts.js', 'js/darts.js');
        game.load.script('boulders.js', 'js/boulders.js');
        game.load.script('input.js', 'js/input.js');
        game.load.tilemap('levelBoss', 'assets/tilemaps/Boss.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset', 'assets/tilesets/tileset.png');
        game.load.spritesheet('healthBar', 'assets/sprites/health.png', 160, 32);
        game.load.spritesheet('player', 'assets/sprites/player.png', 78, 66);
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
        game.load.spritesheet('boss', 'assets/sprites/boss_spritesheet.png', 332, 410, 4);
        game.load.spritesheet('boss_soul', 'assets/sprites/boss_soul.png', 32, 32, 5);
        game.load.image('boss_hand','assets/sprites/boss_hand.png');
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
        game.load.image('bloodParticle', 'assets/sprites/bloodParticle.png');
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
        game.load.bitmapFont('blocktopia', 'assets/fonts/blocktopia.png', 'assets/fonts/blocktopia.xml');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');

	},

	create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#787878';

        //Load level
        loadAudio();
        loadLevel('Boss');

        createPlayer();

	update: function() {

	},

	render: function() {

	},

}