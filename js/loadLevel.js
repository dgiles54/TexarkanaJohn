var map;
var startPointX, startPointY, endPoint;
var layerWall, layerPlatforms, layerLadders, layerDetails, layerFaces, layerCollisions, endingLayer, layerSpikes, layerLava;
var levers, plates, keys, keyholes, doors, dart, darts, door, f_platforms, rockSpawners, boulders, torches, dartLoopGroup, spears, boxes;
var bossHands, bossObj;

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
    levers.forEach(function(lever) {
        lever.animations.add('flip', [0, 1, 2, 3, 4], 10, false);
    })

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
    map.createFromObjects('spiderWebs', 32, 'spiderWeb', 3, true, false, spiderWebs);
    spiderWebs.forEach(function (web) {
        web.animations.add('burn', [6,7,8], 9, false);
        web.animations.add('spiderScuttle', [0,1,2,3,5,4], 3, true);
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
    
    bossObj = map.objects['Boss'];
    
    bossHands = game.add.group();
    bossHands.enableBody = true;
    map.createFromObjects('Boss_Hands', 32, 'boss_hand', 0, true, false, bossHands);
    bossHands.setAll('body.immovable', true);
    
    // boss = game.add.group();
    // boss.enableBody = true;
    // map.createFromObjects('Boss', 32, 'boss', 0, true, false, boss);
    // boss.forEach(function (bos) {
    //     bos.animations.add('open', [0 ,1 ,2 ,3 ,3, 2, 1, 0], 5, false);
    // });

    hearts = game.add.group();
    hearts.enableBody = true;
    
    initializeSnakes();
    snakes.callAll('animations.play', 'animations', 'move');
    spiderWebs.callAll('animations.play', 'animations', 'spiderScuttle');
}
