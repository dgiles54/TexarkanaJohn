var gameOverState = {
    preload: function() {
        game.load.image('gameOver','assets/sprites/GameOverScreen.png')
    },
    
    create: function() {
        game.stage.backgroundColor = '#000000';
        var gameOverSprite;
        gameOverSprite = game.add.sprite(250,200,'gameOver');
        
        //button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
    },
    
    update: function() {
        
    }
};