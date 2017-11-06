var TexarkanaJohn = TexarkanaJohn || {};

var button;
var menuMusic;

TexarkanaJohn.gameStartState = function () {};
TexarkanaJohn.gameStartState.prototype = {
    preload: function () {
        game.load.bitmapFont('raineyhearts', 'assets/fonts/raineyhearts.png', 'assets/fonts/raineyhearts.xml');
        game.load.bitmapFont('messe', 'assets/fonts/messe.png', 'assets/fonts/messe.xml');
        game.load.bitmapFont('messeTitle', 'assets/fonts/messeTitle.png', 'assets/fonts/messeTitle.xml');
        game.load.image('background', 'assets/sprites/background.png');
        game.load.image('startButton', 'assets/sprites/startButton.png');
        game.load.audio('menuMusic', 'assets/audio/Escape_from_the_Temple.mp3');
    },

    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignVertically = true;
        game.scale.pageAlignHorizontally = true;
        game.stage.backgroundColor = '#000';
        
        menuMusic = game.add.audio('menuMusic');
        menuMusic.play();
        
        var bg = game.add.image(0, 0, 'background');

        var title = game.add.bitmapText(game.width*0.5, -100, 'messeTitle', 'TEXARKANA JOHN', 72);
        title.anchor.x = 0.5;
        title.anchor.y = 0.5;
        title.angle = -6;
        game.add.tween(title).to({ y: 100 }, 1000, Phaser.Easing.Bounce.Out, true);
        
        var text1 = game.add.bitmapText(game.width*0.5, game.height*0.33, 'raineyhearts', 'and the', 36);
        text1.anchor.setTo(0.5);
        text1.tint = 0x000000;
        game.add.tween(text1).from({ alpha: 0}, 2000, Phaser.Easing.Quartic.In, true, 1000);

        var text2 = game.add.bitmapText(game.width*0.5, game.height*0.4, 'raineyhearts', 'Curse of Moctezuma', 48);
        text2.anchor.setTo(0.5);
        text2.tint = 0x000000;
        game.add.tween(text2).from({ alpha: 0}, 2000, Phaser.Easing.Quartic.In, true, 1000);

        button = game.add.button(game.width*0.5, game.height*0.64, 'startButton', this.actionOnClick);
        button.anchor.setTo(0.5);
        button.tint = 0x000000;
        button.onInputOver.add(this.over);
        button.onInputDown.add(this.down);
        button.onInputOut.add(this.out);
        
        var controls1 = game.add.bitmapText(game.width*0.5, game.height*0.78, 'messe', 'Arrow keys to move', 20);
        controls1.anchor.setTo(0.5);
        controls1.tint = 0x000000;
        var controls2 = game.add.bitmapText(game.width*0.5, game.height*0.83, 'messe', 'Space to attack', 20);
        controls2.anchor.setTo(0.5);
        controls2.tint = 0x000000;
        var controls3 = game.add.bitmapText(game.width*0.5, game.height*0.88, 'messe', 'E to use', 20);
        controls3.anchor.setTo(0.5);
        controls3.tint = 0x000000;
    },
    
    over: function () {
        button.scale.setTo(1.2);
    },
    
    down: function(){
        button.tint = 0x333333;
    },
    
    out: function(){
        button.scale.setTo(1);
    },

    actionOnClick: function () {
        menuMusic.stop();
        game.state.start('gameState');
    }
};
