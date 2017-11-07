var TexarkanaJohn = TexarkanaJohn || {};

var startButton, helpButton;
var menuMusic;
var ui_player;

TexarkanaJohn.gameStartState = function () {};
TexarkanaJohn.gameStartState.prototype = {
    preload: function () {
        game.load.bitmapFont('raineyhearts', 'assets/fonts/raineyhearts.png', 'assets/fonts/raineyhearts.xml');
        game.load.bitmapFont('messe', 'assets/fonts/messe.png', 'assets/fonts/messe.xml');
        game.load.bitmapFont('messeTitle', 'assets/fonts/messeTitle.png', 'assets/fonts/messeTitle.xml');
        game.load.image('background', 'assets/sprites/ui/background.png');
        game.load.image('startButton', 'assets/sprites/ui/startButton.png');
        game.load.image('helpButton', 'assets/sprites/ui/helpButton.png');
        game.load.spritesheet('ui_player', 'assets/sprites/ui/ui_player.png', 78, 68);
        game.load.audio('menuMusic', 'assets/audio/Escape_from_the_Temple.mp3');
        game.load.audio('whipSound', 'assets/audio/whip.wav');
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
        
        ui_player = game.add.sprite(-80, game.height*0.54, 'ui_player');
        ui_player.animations.add('walk', [0, 1, 2, 3, 4, 5], 9, true);
        var whip = ui_player.animations.add('attack', [6, 7, 8, 9], 12, false);
        whip.onComplete.addOnce(function() {
            startButton.visible = true;
            var whipSound = game.add.audio('whipSound');
            whipSound.play();
            game.add.tween(startButton).to({x: game.width*0.5}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(helpButton).to({y: game.height*0.85}, 1000, Phaser.Easing.Bounce.Out, true, 250);
            game.add.tween(ui_player).to({alpha: 0}, 5000, null, true, 1000);
        });
        ui_player.animations.play('walk');
        this.playerAnimation();
        
        startButton = game.add.button(game.width*0.4, game.height*0.63, 'startButton', this.goToGame);
        startButton.visible = false;
        startButton.anchor.setTo(0.5);
        startButton.tint = 0x000000;
        startButton.onInputOver.add(this.over, startButton);
        startButton.onInputDown.add(this.down, startButton);
        startButton.onInputOut.add(this.out, startButton);
        
        helpButton = game.add.button(game.width*0.5, game.height + 100, 'helpButton', this.goToHelp);
        helpButton.anchor.setTo(0.5);
        helpButton.tint = 0x000000;
        helpButton.onInputOver.add(this.over, helpButton);
        helpButton.onInputDown.add(this.down, helpButton);
        helpButton.onInputOut.add(this.out, helpButton);
    },
    
    over: function () {
        this.scale.setTo(1.2);
    },
    
    down: function(){
        this.tint = 0x333333;
    },
    
    out: function(){
        this.scale.setTo(1);
    },

    goToGame: function () {
        menuMusic.stop();
        game.state.start('gameState');
    },
    
    goToHelp: function () {
        game.state.start('helpState');
    },
    
    playerAnimation: function () {
        game.add.tween(ui_player).to({ 
            x: game.width*0.2
        }, 2000, null, true).onComplete.addOnce(function() {
            ui_player.animations.stop('walk');
            ui_player.animations.play('attack');
        });
    }
};
