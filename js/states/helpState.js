var TexarkanaJohn = TexarkanaJohn || {};

var backButton;

TexarkanaJohn.helpState = function () {};
TexarkanaJohn.helpState.prototype = {
    preload: function () {
        game.load.image('backButton', 'assets/sprites/ui/backButton.png');
        game.load.image('controls', 'assets/sprites/ui/controls.png');
        game.load.spritesheet('ui_lever', 'assets/sprites/ui/ui_lever_right.png', 32, 32);
    },

    create: function () {
        var bg = game.add.image(0, 0, 'background');
        var controls = game.add.image(0, 0, 'controls');
        
        var centerX = game.width * 0.5;
        var centerY = game.height * 0.5;
        var playerWalk = game.add.sprite(centerX - 130, centerY - 80, 'ui_player');
        playerWalk.anchor.setTo(0.5);
        playerWalk.animations.add('walk', [0, 1, 2, 3, 4, 5], 5, true);
        playerWalk.animations.play('walk');
        var playerClimb = game.add.sprite(centerX - 60, centerY - 79, 'ui_player');
        playerClimb.anchor.setTo(0.5);
        playerClimb.animations.add('climb', [10, 11, 12, 11], 5, true);
        playerClimb.animations.play('climb');
        var playerAttack = game.add.sprite(centerX - 95, centerY + 15, 'ui_player');
        playerAttack.anchor.setTo(0.5);
        playerAttack.animations.add('attack', [6, 7, 8, 9], 5, true);
        playerAttack.animations.play('attack');
        var playerInteract = game.add.sprite(centerX - 95, centerY + 110, 'ui_player');
        playerInteract.anchor.setTo(0.5);
        var lever1 = game.add.sprite(centerX - 95, centerY + 110, 'ui_lever');
        lever1.animations.add('flip', [0, 1, 2, 3, 4], 8, true);
        lever1.animations.play('flip');
        
        backButton = game.add.button(centerX, game.height*0.93, 'backButton', this.goToStart);
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
