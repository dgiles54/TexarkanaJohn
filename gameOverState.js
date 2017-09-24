var gameOverState = {
    preload: function() {
        game.load.image('gameOver','assets/sprites/GameOverScreen.png');
        game.load.image('button','assets/sprites/retryButton.png');
    },
    
    create: function() {
        game.stage.backgroundColor = '#000000';
        var gameOverSprite;
        gameOverSprite = game.add.sprite(250,200,'gameOver');
        
        button = game.add.button(game.world.centerX - 95, 200, 'button', this.actionOnClick);
    },
    
    actionOnClick: function(){
    game.state.start('gameState');
},
    
    update: function() {
        
    }
};