function rockSpawn() {

    rockSpawners.forEach(function (rockPlace) {

        boulders.create(rockPlace.x, rockPlace.y, 'boulderBroken');
    });


    boulders.forEach(function (boulder) {
        boulder.body.velocity.y = 500;
        boulder.body.setSize(50, 50, 0, 0);
        boulder.body.immovable = true;
        boulder.hurtPlayer = false;
    });
}

function killBoulder(boulder) {
    anim = boulder.animations.add('break', null, 10, false);
    boulder.animations.play('break');
    anim.killOnComplete = true;
    //    game.add.sprite(boulder.x,boulder.y,'boulderBroken');
    //    boulder.kill()
}

function boulderDmgPlayer(player, boulder) {
    if (boulder.hurtPlayer != true) {
        boulder.hurtPlayer = true;
        player.damage(1);
        healthBar.frame = player.health;
        loseHealthSound.play();
        
        killBoulder(boulder);
    }
}
