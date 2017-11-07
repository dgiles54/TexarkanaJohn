var TexarkanaJohn = TexarkanaJohn || {};

var backButton;

TexarkanaJohn.helpState = function () {};
TexarkanaJohn.helpState.prototype = {
    preload: function () {
        game.load.image('backButton', 'assets/sprites/ui/backButton.png');
        game.load.image('controls', 'assets/sprites/ui/controls.png');
        game.load.spritesheet('ui_lever', 'assets/sprites/ui/ui_lever_right.png', 32, 32);
        game.load.image('ui_key', 'assets/sprites/ui/ui_key.png');
        game.load.image('ui_keyhole', 'assets/sprites/keyHole.png');
    },

    create: function () {
        var bg = game.add.image(0, 0, 'background');
        var controls = game.add.image(0, 0, 'controls');
        
        var playerWalk = game.add.sprite(game.width*0.05, game.height*0.3, 'ui_player');
        playerWalk.animations.add('walk', [0, 1, 2, 3, 4, 5], 5, true);
        playerWalk.animations.play('walk');
        var playerClimb = game.add.sprite(game.width*0.15, game.height*0.3, 'ui_player');
        playerClimb.animations.add('climb', [10, 11, 12, 11], 5, true);
        playerClimb.animations.play('climb');
        var playerAttack = game.add.sprite(game.width*0.1, game.height*0.49, 'ui_player');
        playerAttack.animations.add('attack', [6, 7, 8, 9], 5, true);
        playerAttack.animations.play('attack');
        var playerInteract = game.add.sprite(game.width*0.1, game.height*0.68, 'ui_player');
        var lever1 = game.add.sprite(game.width*0.15, game.height*0.73, 'ui_lever');
        lever1.animations.add('flip', [0, 1, 2, 3, 4], 8, true);
        lever1.animations.play('flip');
        
        var lever2 = game.add.sprite(game.width*0.76, game.height*0.3, 'ui_lever');
        lever2.scale.setTo(2);
        var key = game.add.sprite(game.width*0.71, game.height*0.54, 'ui_key');
        key.scale.setTo(2);
        var keyhole = game.add.sprite(game.width-181, game.height*0.77, 'ui_keyhole');
        //keyhole.scale.setTo(2);
        
        backButton = game.add.button(game.width*0.5, game.height*0.90, 'backButton', this.goToStart);
        backButton.anchor.setTo(0.5);
        backButton.onInputOver.add(this.over, backButton);
        backButton.onInputDown.add(this.down, backButton);
        backButton.onInputOut.add(this.out, backButton);
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

    goToStart: function () {
        game.state.start('gameStartState');
    }
};
