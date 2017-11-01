function shootDart(player, plate) {
    var plateID = parseInt(plate.name.charAt(5)) - 1;
    if (map.objects['Plates'][plateID].type == 'active') {
        dartSound.play();
        darts.children[plateID].visible = true;
        darts.children[plateID].body.gravity.x = -200;
        plateSound.play();
        map.objects['Plates'][plateID].type = 'inactive';
    }
    if(map.objects['Plates'][plateID].type == 'stopLoop') {
        if(map.objects['Plates'][plateID].plateSoundAlreadyPlayed == false){
           
           plateSound.play();
           map.objects['Plates'][plateID].plateSoundAlreadyPlayed = true;
        }
        timerDartLoop.pause();
        // dartLoopGroup.forEach(function(dartLoop) {
        //     // dartLoopID = dartLoopGroup.getChildIndex(dartLoop);
        //     // if (map.objects['dartLoop'][dartLoopID].loopGroup == plateID + 1) {
        //     //     dartLoop.loopTimer.pause();
        //     // }
        // });
    } 
}

function dartLoopSpawn() {
    
    dartLoopGroup.forEach(function(dartLoop) {
        dartLoopID = dartLoopGroup.getChildIndex(dartLoop);
        dart = darts.create(dartLoop.x, dartLoop.y, 'blowdart');
        dartSound.play();
        // LEFT
        if (map.objects['dartLoop'][dartLoopID].type == "right") {
            dart.body.velocity.x = -300;
        } else {
            dart.scale.setTo(-1, 1);
            dart.body.velocity.y = 300;
        }
        dart.checkWorldBounds = true;
        dart.outOfBoundsKill = true;
        
        if (!dart.exists) {
            dart.destroy();
        }
    });
}

function killDart(dart,box) {
    dart.kill();
    dart.destroy();
}

function dartDmgPlayer(player, dart) {
    if (game.time.now > nextAttackEnemy) {
        nextAttackEnemy = game.time.now + ENEMY_ATTACK_RATE;
        player.damage(1);
        healthBar.frame = player.health;
        loseHealthSound.play();

        killDart(dart);
    }
}
