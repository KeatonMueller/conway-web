import { GameEngine } from './conway/GameEngine.js';

const game = new GameEngine(3, 3);
game.primaryGrid[0][1] = true;
game.primaryGrid[1][1] = true;
game.primaryGrid[2][1] = true;
game.show();
game.iteration();
console.log('\n\n');
game.show();
game.iteration();
console.log('\n\n');
game.show();
game.iteration();
console.log('\n\n');
game.show();
game.iteration();
console.log('\n\n');
game.show();
