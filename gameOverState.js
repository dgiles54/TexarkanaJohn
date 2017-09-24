var gameOverState = {
    preload: function () {
        game.load.image('gameOver', 'assets/sprites/GameOverScreen.png');
        game.load.spritesheet('button', 'assets/sprites/retryButton.png', 320, 168);

    },

    create: function () {
        game.stage.backgroundColor = '#000000';
        var gameOverSprite;

        gameOverSprite = game.add.sprite(250,200,'gameOver');
        
        button = game.add.button(game.world.centerX - 95, 200, 'button', this.actionOnClick);

    },

    update: function () {

    },

    actionOnClick: function () {
        location.reload();
    }
};
