var map;
var layerBG, layerPlatforms, layerLadders, layerPlayer;
var player, health = 5;
var cursors, useKey;
var lever, pressure_plate, key, keyInventory, keyHole, door, blowdart, endDoor;
var keyCreated = false;
var hintText, inventory, healthBar;
var hasKey = false,
    switchTriggered = false,
    blowdartCreated = false;
var leverSound, plateSound;

var gameState = {

    preload: function () {

        game.load.tilemap('temple', 'assets/tilemaps/Level1.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.image('moctRevengeTileset', 'assets/tilesets/moctRevengeTileset.png');
        game.load.spritesheet('healthBar', 'assets/sprites/healthBar.png', 320, 64);
        game.load.spritesheet('player', 'assets/sprites/player_walk.png', 64, 64);
        game.load.spritesheet('lever', 'assets/sprites/lever.png', 32, 32, 2);
        //game.load.image('lever', 'assets/sprites/lever.png');
        game.load.image('pressurePlate', 'assets/sprites/pressurePlate.png');
        game.load.image('key', 'assets/sprites/key.png');
        game.load.image('keyHole', 'assets/sprites/keyHole.png');
        game.load.image('door', 'assets/sprites/door.png');
        game.load.image('blowdart', 'assets/sprites/blowdart.png');
        game.load.audio('leverSound', 'assets/audio/lever.wav');
        game.load.audio('plateSound', 'assets/audio/pressure_plate.wav');


    },


    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#787878';

        //  The 'mario' key here is the Loader key given in game.load.tilemap
        map = game.add.tilemap('temple');

        //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //  The second parameter maps this name to the Phaser.Cache key 'tiles'
        map.addTilesetImage('moctRevengeTileset');

        //  Creates a layer from the World1 layer in the map data.
        //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        layerBG = map.createLayer('bg');
        door = game.add.sprite(700, 125, 'door');
        endDoor = game.add.sprite(750,125,'door');
        endDoor.visible = false;
        game.physics.enable(endDoor);
        game.physics.enable(door);
        layerPlatforms = map.createLayer('platforms');
        layerLadders = map.createLayer('ladders');



        map.setCollisionBetween(1, 12, true, 'platforms');
        map.setCollisionBetween(1, 12, false, 'ladders');


        lever = game.add.sprite(1, 300, 'lever');
        game.physics.enable(lever);
        pressure_plate = game.add.sprite(400, 448, 'pressurePlate');
        game.physics.enable(pressure_plate);

        keyHole = game.add.sprite(625, 205, 'keyHole');

        //game.physics.enable(blowdart);
        //  This resizes the game world to match the layer dimensions
        layerBG.resizeWorld();



        player = game.add.sprite(20, 150, 'player');

        //layerPlayer = map.createLayer('player');


        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player);
        player.body.gravity.y = 800;
        player.body.bounce.y = 0.2;
        player.body.drag.x = 2000;
        player.body.collideWorldBounds = true;
        player.animations.add('walk', [0, 1, 2, 3], 5, true);


        player.body.setSize(40, 64, 15, 0);

        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        cursors = game.input.keyboard.createCursorKeys();
        useKey = game.input.keyboard.addKey(Phaser.Keyboard.E);

        hintText = game.add.text(250, 500, 'Find the key to the locked door.', {
            fontSize: '32px',
            fill: '#000'
        });
        hintText.fixedToCamera = true;
        inventory = game.add.text(330, 10, 'INVENTORY', {
            fontSize: '32px',
            fill: '#000'
        });
        inventory.fixedToCamera = true;

        healthBar = game.add.sprite(5, 5, 'healthBar');
        healthBar.fixedToCamera = true;

        key = game.add.sprite(700, 420, 'key');
        key.visible = false;

        door.body.immovable = true;
        pressure_plate.body.immovable = true;

        pressure_plate.body.setSize(30, 5, 0, 30);
        
        door.body.setSize(50,160,30,0);

        leverSound = game.add.audio('leverSound');
        plateSound = game.add.audio('plateSound');
    },

    update: function () {

        game.debug.body(door);

        map.setTileIndexCallback(5, playerLadderClimb, null, layerLadders);




        player.body.gravity.y = 800;
        hintText.text = "Find the key to the locked door.";
        game.physics.arcade.collide(player, layerPlatforms);
        game.physics.arcade.collide(player, door);
        game.physics.arcade.collide(player, layerLadders);
        //game.physics.arcade.overlap(player, pressure_plate, createBlowDart());

        if (cursors.left.isDown) {
            player.scale.setTo(-1, 1);
            player.animations.play('walk');
            player.body.velocity.x = -200;
        } else if (cursors.right.isDown) {
            player.scale.setTo(1, 1);
            player.animations.play('walk');
            player.body.velocity.x = 200;
        } else {
            player.animations.stop('walk');
            player.body.velocity.x = 0;
        }

        if (cursors.up.isDown && player.body.onFloor()) {
            player.body.velocity.y = -200;
        }


        if (player.overlap(pressure_plate) && player.body.onFloor()) {
            createBlowDart();
        }


        if (player.overlap(lever) && useKey.isDown) {
            lever.frame = 1;
            leverSound.play();
            key.visible = true;
            keyCreated = true;

        }




        if (keyCreated) {
            if (player.overlap(key)) {

                hintText.text = "Press 'e' to pickup item.";
            }


            if (player.overlap(key) && useKey.isDown && hasKey == false) {
                key.kill();
                keyInventory = game.add.sprite(10, 50, 'key');
                keyInventory.fixedToCamera = true;
                hasKey = true;


            }
        }

        if (player.overlap(keyHole)) {

            hintText.text = "Use the key to open the door.";
        }

        if (player.overlap(keyHole) && hasKey == true && useKey.isDown) {

            door.body.gravity.y = -100;
            keyInventory.kill();

        }
        if (blowdartCreated == true) {

            if (player.overlap(blowdart)) {

                healthBar.frame += 1;
                health -= 1;
                blowdart.kill();
                blowdartCreated = false;
                if(health == 0){
                    game.state.start('gameOverState');
                }
            }
        }
       if(player.overlap(endDoor)){
           
           game.state.start('gameWinState');
       } 
        
    }
};

function createBlowDart() {

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
    if (useKey.isDown) {
        player.body.velocity.y = -100;
    }

}
