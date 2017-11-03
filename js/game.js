var game = new Phaser.Game(800, 450, Phaser.AUTO);
game.state.add('gameState', TexarkanaJohn.gameState);
game.state.add('gameOverState', TexarkanaJohn.gameOverState);
game.state.add('gameWinState',TexarkanaJohn.gameWinState);
game.state.add('gameState', TexarkanaJohn.gameState);
game.state.add('gameStartState', TexarkanaJohn.gameStartState);
game.state.start('gameStartState');
