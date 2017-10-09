var moc, rev, button;
var gameStartState = {
    preload: function () {
        // game.load.image('title', 'assets/sprites/titleScreen.png');
        game.load.bitmapFont('blocktopia', 'assets/fonts/blocktopia.png', 'assets/fonts/blocktopia.xml');
    },

    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.stage.backgroundColor = '#000';

        // var title = game.add.image(game.width/2, game.height/2, 'title');
        // title.anchor.x = 0.5;
        // title.anchor.y = 0.5;
        moc = game.add.bitmapText(game.width/2, game.height/2 - 128, 'blocktopia', 'Moctezuma\'s', 64);
        moc.anchor.setTo(0.5);

        rev = game.add.bitmapText(game.width/2, game.height/2 - 72, 'blocktopia', 'Revenge', 56);
        rev.anchor.setTo(0.5);

        temp = game.add.bitmapText(game.width/2, game.height/2 + 36, 'blocktopia', 'Start', 40);
        temp.anchor.setTo(0.5);

        button = game.add.button(game.width/2, game.height/2 + 34, '', this.actionOnClick);
        button.anchor.setTo(0.5);
        button.scale.setTo(3, 1);
        button.onInputOver.add(this.over);
        button.onInputDown.add(this.down);
        button.onInputOut.add(this.out);
        
        controls1 = game.add.bitmapText(game.width/2, game.height - 150, 'blocktopia', 'Arrow keys to move', 24);
        controls1.anchor.setTo(0.5);
        controls2 = game.add.bitmapText(game.width/2, game.height - 125, 'blocktopia', 'Space to attack', 24);
        controls2.anchor.setTo(0.5);
        controls3 = game.add.bitmapText(game.width/2, game.height - 100, 'blocktopia', 'E to use', 24);
        controls3.anchor.setTo(0.5);
    },

    over: function () {
        temp.tint = 0x66ff66;
    },
    
    down: function(){
        temp.tint = 0x00ff00;
    },
    
    out: function(){
        temp.tint = 0xffffff;
    },

    actionOnClick: function () {
        game.state.start('gameState');
    }
};
