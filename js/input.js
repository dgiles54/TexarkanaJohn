var cursors, useKey, attackKey, cursors2, jumpKey, debugKey;

function initializeControls() {
    cursors = game.input.keyboard.createCursorKeys();
    useKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    dropKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    attackKey = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    attackKey.onDown.add(function () {
        attack();
    }, this);
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    cursors2 = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    }
    debugKey = game.input.keyboard.addKey(Phaser.Keyboard.B);
    // Assign debug key to function you want to test
    debugKey.onDown.add(function () {
        player.bloodEmitter.explode(1000);
    });
}