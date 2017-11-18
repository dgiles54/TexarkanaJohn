var TexarkanaJohn = TexarkanaJohn || {};

var scene;
var layerWall, layerPlatforms, layerDetails;
var endPoint, startPointX, startPoint;
var campfire, tent;

WebFontConfig = {
    google: {
        families: ['VT323', 'Arvo', 'Rokkitt']
    }
};

TexarkanaJohn.campState = function () {};
TexarkanaJohn.campState.prototype = {
	preload: function() {
		game.load.script('loadAudio.js', 'js/loadAudio.js');
		game.load.script('player.js', 'js/player.js');
		game.load.script('input.js', 'js/input.js');
		// game.load.script('lighting.js', 'js/lighting.js');
		game.load.tilemap('cutscene', 'assets/tilemaps/cutscene.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tileset', 'assets/tilesets/tileset.png');
		game.load.spritesheet('player', 'assets/sprites/player.png', 97, 66);
		game.load.image('keyEmpty', 'assets/sprites/keyEmpty.png');
		game.load.spritesheet('healthBar', 'assets/sprites/health.png', 160, 32);
		game.load.spritesheet('campfire', 'assets/sprites/cutscene/campfire.png', 48, 32, 4);
		game.load.spritesheet('tent', 'assets/sprites/cutscene/tent.png', 96, 64, 3);
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

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#787878';
        
        // Load audio
        loadAudio();

        // Load level
        scene = game.add.tilemap('cutscene');
        scene.addTilesetImage('tileset');

        layerWall = scene.createLayer('Wall');
        layerPlatforms = scene.createLayer('Platforms');
        layerDetails = scene.createLayer('Details');
        endPoint = scene.createLayer('EndPoint');
        layerWall.resizeWorld();

		campfire = game.add.group();
		campfire.enableBody = true;
		scene.createFromObjects('Campfire', 33, 'campfire', 0, true, false, campfire);
		campfire.forEach(function(campfire) {
			campfire.animations.add('idle', [0,1,2,3], 6, true).play();
    		campfire.body.immovable = true;
		})
    	game.physics.enable(campfire);

    	tent = game.add.group();
    	tent.enableBody = true;
    	scene.createFromObjects('Tent', 32, 'tent', 0, true, false, tent);
    	tent.forEach(function(tent) {
    		tent.animations.add('idle', [0,1,2], 3, true).play();
    		tent.body.immovable = true;
    	})
    	game.physics.enable(tent);

        startPointX = scene.objects['StartPoint'][0].x;
    	startPointY = scene.objects['StartPoint'][0].y;

    	// Create player
    	createPlayer();
    	player.health = 5;
    	// Camera follows player
    	game.camera.follow(player);

    	// Initialize controls
    	initializeControls();

    	// Set collisions
    	scene.setCollisionBetween(1, 10, true, 'Wall');
        scene.setCollisionBetween(1, 15, true, 'Platforms');
        scene.setCollision(24, true, 'EndPoint');

	},

	update: function() {
		player.body.gravity.y = PLAYER_GRAVITY;

		//------------//
		// COLLISIONS //
		//------------//
		game.physics.arcade.collide(player, layerWall);
        game.physics.arcade.collide(player, layerPlatforms);
        // game.physics.arcade.collide(player, endPoint, nextLevel);

        //----------//
        // CONTROLS //
        //----------//
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
        // Jump
        if ((cursors.up.isDown || cursors2.up.isDown) && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -PLAYER_JUMP_SPEED;
            jumpSound.play();
        }
        // Jump animation
        if (player.body.velocity.y < -1 && !player.climbing && !player.isAttacking && !player.isDead) {
            player.frame = 3;
        }
        // whip sound
        if (player.frame == 9) {
            whipSound.play();
        }
	},

	render: function() {

	},

}