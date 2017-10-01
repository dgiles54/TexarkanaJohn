var moc;
var rev;
var button;
var gameStartState = {
    preload: function () {
        // game.load.image('title', 'assets/sprites/titleScreen.png');
        game.load.bitmapFont('blocktopia', 'assets/fonts/blocktopia.png', 'assets/fonts/blocktopia.xml');
    },

    create: function () {
        game.stage.backgroundColor = '#000';
        // var title = game.add.image(game.width/2, game.height/2, 'title');
        // title.anchor.x = 0.5;
        // title.anchor.y = 0.5;
        moc = game.add.bitmapText(game.width/2, game.height/2 - 64, 'blocktopia', 'Moctezuma\'s', 64);
        moc.anchor.set(0.5);

        rev = game.add.bitmapText(game.width/2, game.height/2 + 4, 'blocktopia', 'Revenge', 56);
        rev.anchor.setTo(0.5);

        temp = game.add.bitmapText(game.width/2, game.height/2 + 108, 'blocktopia', 'Start', 32);
        temp.anchor.setTo(0.5);

        button = game.add.button(game.width/2, game.height/2 + 108, '', this.actionOnClick);
        button.anchor.setTo(0.5);
        button.scale.setTo(2.5, 1);
        button.onInputOver.add(this.over);
        button.onInputDown.add(this.down);
        button.onInputOut.add(this.out);
    },

    update: function() {

    },

    over: function () {
        temp.tint = 0x93052A;
    },
    
    down: function(){
        temp.tint = 0xFFC300;
    },
    
    out: function(){
        temp.tint = 0xffffff;
    },

    actionOnClick: function () {
        game.state.start('gameState');
    }
};
