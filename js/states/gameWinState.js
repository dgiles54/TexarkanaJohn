var TexarkanaJohn = TexarkanaJohn || {};

var win, retry, button;

TexarkanaJohn.gameWinState = function () {};
TexarkanaJohn.gameWinState.prototype = {
    preload: function () {
        // game.load.image('gameWin', 'assets/sprites/winScreen.png');
        // game.load.spritesheet('button', 'assets/sprites/retryButton.png', 320, 168);
        game.load.bitmapFont('blocktopia', 'assets/fonts/blocktopia.png', 'assets/fonts/blocktopia.xml');
    },

    create: function () {
        game.stage.backgroundColor = '#000';
        // var gameWinSprite;

        // gameWinSprite = game.add.sprite(230,200,'gameWin');
        
        // button = game.add.button(game.world.centerX - 320, 400, 'button', this.actionOnClick);
        // button.onInputOver.add(this.over);
        // button.onInputDown.add(this.down);
        // button.onInputOut.add(this.out);

        win = game.add.bitmapText(game.width/2, game.height/2, 'blocktopia', 'You Win', 64);
        win.anchor.setTo(0.5);
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