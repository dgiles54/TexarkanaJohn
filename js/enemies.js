var ENEMY_ATTACK_RATE = 600;
var HEART_DROP_CHANCE = 0.5;

var snake, snakes;
var spider, spiderSpawners, spiderWebs, spiderWeb;
var nextAttackEnemy = 0;

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
    game.physics.arcade.overlap(spiderSpawner,spiderWebs,resetWeb);
    spiderSound.play();
    spiderSpawner.kill();
    spiders.forEach(function (spider) {
        game.physics.arcade.collide(spider,layerPlatforms,spider.body.velocity.x = 100);
        spider.scale.setTo(0.5, 0.5);
        spider.body.bounce.x = 1;
        spider.lives = 3;
    });
}

function resetWeb(spiderSpawner, spiderWeb) {
    spiderWeb.frame = 6;
    spiderWeb.animations.stop('spiderScuttle');
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
