var TexarkanaJohn = TexarkanaJohn || {};

var gameOver, retry, button;

TexarkanaJohn.gameOverState = function () {};
TexarkanaJohn.gameOverState.prototype = {
    preload: function () {
        // game.load.image('gameOver', 'assets/sprites/GameOverScreen.png');
        // game.load.spritesheet('button', 'assets/sprites/retryButton.png', 320, 168);

        game.load.bitmapFont('blocktopia', 'assets/fonts/blocktopia.png', 'assets/fonts/blocktopia.xml');

    },

    create: function () {
        game.stage.backgroundColor = '#000';
        // var gameOverSprite;

        // gameOverSprite = game.add.sprite(250,200,'gameOver');
        
        // button = game.add.button(game.world.centerX - 320, 400, 'button', this.actionOnClick);
        // button.onInputOver.add(this.over);
        // button.onInputDown.add(this.down);
        // button.onInputOut.add(this.out);

        gameOver = game.add.bitmapText(game.width/2, game.height/2, 'blocktopia', 'Game Over', 64);
        gameOver.anchor.setTo(0.5);
        retry = game.add.bitmapText(game.width/2, game.height/2 + 66, 'blocktopia', 'Retry', 56);
        retry.anchor.setTo(0.5);
        button = game.add.button(game.width/2, game.height/2 + 64, '', this.actionOnClick);
        button.anchor.setTo(0.5);
        button.scale.setTo(3, 2);
        button.onInputOver.add(this.over);
        button.onInputDown.add(this.down);
        button.onInputOut.add(this.out);

    },

    over: function () {
        retry.tint = 0x66ff66;
    },
    
    down: function(){
        retry.tint = 0x00ff00;
    },
    
    out: function(){
        retry.tint = 0xffffff; 
    },
    
    update: function () {
    },

    actionOnClick: function () {
        location.reload();
    }
};
