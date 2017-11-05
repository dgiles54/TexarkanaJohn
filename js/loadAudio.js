var leverSound, plateSound, doorSound, keySound, unlockSound, lavaSound, templeMusic, dartSound;
var loseHealthSound, whipSound, jumpSound, spikeDeath, spikeDeathGrunt;
var spiderSound, spiderDmg, spiderWebFire, snakeDmg;

function loadAudio() {
    templeMusic = game.add.audio('templeMusic', 0.15, true);
    leverSound = game.add.audio('leverSound');
    plateSound = game.add.audio('plateSound');
    loseHealthSound = game.add.audio('ouch', 0.5);
    doorSound = game.add.audio('doorSound', 0.75);
    keySound = game.add.audio('keySound');
    unlockSound = game.add.audio('unlockSound');
    whipSound = game.add.audio('whipSound');
    jumpSound = game.add.audio('jumpSound');
    spiderSound = game.add.audio('spiderChatter');
    spiderDmg = game.add.audio('spiderDmg');
    snakeDmg = game.add.audio('snakeDmg');
    spiderWebFire = game.add.audio('spiderWebFire');
    lavaSound = game.add.audio('lava');
    dartSound = game.add.audio('dartSound');
    spikeDeath = game.add.audio('spikeDeath');
    spikeDeathGrunt = game.add.audio('spikeDeathGrunt');
}