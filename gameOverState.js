var gameOverState = {
    preload: function() {
        game.load.image('gameOver','assets/sprites/GaveOverScreen.png')
    },
    var gameOverSprite;
    create: function() {
        gameOverSprite = game.add.sprite(400,400,'gameOver');
    },
    
    update: function() {
        
    }
};